import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const STORAGE_KEY = 'vectorshift-pipeline';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

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
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nodes, edges, nodeIDs })
    );
  },

  loadPipeline: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const { nodes, edges, nodeIDs } = JSON.parse(raw);
      set({ nodes: nodes || [], edges: edges || [], nodeIDs: nodeIDs || {} });
    } catch {
      console.error('Failed to load pipeline');
    }
  },

  clearPipeline: () => {
    set({ nodes: [], edges: [], nodeIDs: {} });
    localStorage.removeItem(STORAGE_KEY);
  },
}));
