import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const STORAGE_KEY = 'vectorshift-pipeline';

const serializePipeline = (nodes, edges, nodeIDs) => {
  const cleanNodes = nodes.map(({ selected, dragging, ...node }) => ({
    ...node,
    selected: false,
    dragging: false,
  }));
  return JSON.stringify({
    nodes: cleanNodes,
    edges,
    nodeIDs,
    savedAt: new Date().toISOString(),
  });
};

const parsePipeline = (raw) => {
  const data = JSON.parse(raw);
  const nodes = (data.nodes || []).map((n) => ({
    ...n,
    selected: false,
    dragging: false,
  }));
  return {
    nodes,
    edges: data.edges || [],
    nodeIDs: data.nodeIDs || {},
    savedAt: data.savedAt,
  };
};

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  uiMessage: null,

  showMessage: (text, type = 'info') => {
    set({ uiMessage: { text, type } });
  },

  clearMessage: () => set({ uiMessage: null }),

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes) => {
    const removedIds = changes
      .filter((c) => c.type === 'remove')
      .map((c) => c.id);
    const newNodes = applyNodeChanges(changes, get().nodes);
    let newEdges = get().edges;

    if (removedIds.length > 0) {
      newEdges = newEdges.filter(
        (e) =>
          !removedIds.includes(e.source) && !removedIds.includes(e.target)
      );
    }

    set({ nodes: newNodes, edges: newEdges });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            height: '20px',
            width: '20px',
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue },
          };
        }
        return node;
      }),
    });
  },

  savePipeline: () => {
    const { nodes, edges, nodeIDs } = get();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        serializePipeline(nodes, edges, nodeIDs)
      );
      get().showMessage(
        `Saved — ${nodes.length} node${nodes.length !== 1 ? 's' : ''}, ${edges.length} connection${edges.length !== 1 ? 's' : ''}`,
        'success'
      );
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      get().showMessage(
        'Save failed. Browser may block storage — try Export instead.',
        'error'
      );
      return false;
    }
  },

  loadPipeline: () => {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      get().showMessage('Cannot read saved data from this browser.', 'error');
      return false;
    }

    if (!raw) {
      get().showMessage(
        'Nothing saved yet. Add nodes, then click Save.',
        'info'
      );
      return false;
    }

    try {
      const { nodes, edges, nodeIDs, savedAt } = parsePipeline(raw);
      const currentCount = get().nodes.length;

      if (currentCount > 0) {
        const ok = window.confirm(
          `Load saved pipeline${savedAt ? ` from ${new Date(savedAt).toLocaleString()}` : ''}? This replaces your current canvas.`
        );
        if (!ok) return false;
      }

      set({ nodes, edges, nodeIDs: nodeIDs || {} });
      get().showMessage(
        `Loaded — ${nodes.length} nodes, ${edges.length} connections`,
        'success'
      );
      return true;
    } catch (err) {
      console.error('Load failed:', err);
      get().showMessage('Saved file is corrupted. Save again.', 'error');
      return false;
    }
  },

  exportPipeline: () => {
    const { nodes, edges, nodeIDs } = get();
    if (nodes.length === 0) {
      get().showMessage('Add nodes before exporting.', 'info');
      return;
    }
    try {
      const blob = new Blob(
        [serializePipeline(nodes, edges, nodeIDs)],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipeline-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      get().showMessage('Downloaded pipeline.json', 'success');
    } catch (err) {
      get().showMessage('Export failed', 'error');
    }
  },

  importPipeline: () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const { nodes, edges, nodeIDs } = parsePipeline(reader.result);
          if (get().nodes.length > 0) {
            const ok = window.confirm('Import file? Replaces current canvas.');
            if (!ok) return;
          }
          set({ nodes, edges, nodeIDs: nodeIDs || {} });
          get().showMessage(
            `Imported — ${nodes.length} nodes, ${edges.length} edges`,
            'success'
          );
          try {
            localStorage.setItem(
              STORAGE_KEY,
              serializePipeline(nodes, edges, nodeIDs)
            );
          } catch {
            /* ignore */
          }
        } catch {
          get().showMessage('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  clearPipeline: () => {
    if (get().nodes.length > 0) {
      const ok = window.confirm('Clear the entire canvas?');
      if (!ok) return;
    }
    set({ nodes: [], edges: [], nodeIDs: {} });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    get().showMessage('Canvas cleared', 'info');
  },

  loadTemplate: (template) => {
    const nodes = (template.nodes || []).map((n) => ({
      ...n,
      selected: false,
      dragging: false,
    }));
    set({
      nodes,
      edges: template.edges || [],
      nodeIDs: { ...(template.nodeIDs || {}) },
    });
    get().showMessage(`Template loaded — ${nodes.length} nodes`, 'success');
  },
}));
