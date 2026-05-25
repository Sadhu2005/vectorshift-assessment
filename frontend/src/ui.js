import { useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeTypes } from './nodes/nodeRegistry';
import { createPipelineNode } from './utils/addPipelineNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const FlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const { project, viewportInitialized } = useReactFlow();
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      let type;
      try {
        const appData = JSON.parse(raw);
        type = appData?.nodeType;
      } catch {
        return;
      }

      if (!type || !reactFlowWrapper.current) return;

      if (!viewportInitialized) {
        console.warn('Canvas not ready yet — try again in a moment');
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(createPipelineNode(type, position, getNodeID));
    },
    [project, viewportInitialized, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="h-full w-full bg-slate-50"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        fitView={nodes.length > 0}
        deleteKeyCode={['Backspace', 'Delete']}
        elementsSelectable
        style={{ width: '100%', height: '100%' }}
      >
        <Background color="#94a3b8" gap={gridSize} size={1} />
        <Controls
          position="bottom-right"
          className="!rounded-lg !border !border-slate-200 !bg-white !shadow-lg"
        />
        <MiniMap
          position="bottom-left"
          className="!rounded-lg !border !border-slate-200 !bg-white !shadow-lg"
          nodeColor="#6366f1"
          maskColor="rgba(241, 245, 249, 0.85)"
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-8 py-6 text-center shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-600">
              Your canvas is empty
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Add nodes from the left panel — click or drag them here
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Select a node and press Delete, or use the × on the node header
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const PipelineUI = () => (
  <div className="absolute inset-0">
    <FlowCanvas />
  </div>
);
