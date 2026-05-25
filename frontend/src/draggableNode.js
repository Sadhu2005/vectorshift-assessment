import { useCallback } from 'react';
import { useStore } from './store';
import { createPipelineNode } from './utils/addPipelineNode';
import { nodeConfigs } from './nodes/nodeConfigs';

const accentStyles = {
  emerald: 'border-l-emerald-500 hover:bg-slate-800',
  rose: 'border-l-rose-500 hover:bg-slate-800',
  violet: 'border-l-violet-500 hover:bg-slate-800',
  amber: 'border-l-amber-500 hover:bg-slate-800',
  cyan: 'border-l-cyan-500 hover:bg-slate-800',
  blue: 'border-l-blue-500 hover:bg-slate-800',
  orange: 'border-l-orange-500 hover:bg-slate-800',
  slate: 'border-l-slate-500 hover:bg-slate-800',
  indigo: 'border-l-indigo-500 hover:bg-slate-800',
};

const dotStyles = {
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  slate: 'bg-slate-500',
  indigo: 'bg-indigo-500',
};

export const DraggableNode = ({ type, label }) => {
  const getNodeID = useStore((s) => s.getNodeID);
  const addNode = useStore((s) => s.addNode);
  const nodes = useStore((s) => s.nodes);

  const accent = nodeConfigs[type]?.accent || 'indigo';
  const accentClass = accentStyles[accent] || accentStyles.indigo;
  const dotClass = dotStyles[accent] || dotStyles.indigo;

  const addToCanvas = useCallback(() => {
    const offset = nodes.length * 40;
    const position = {
      x: 180 + offset,
      y: 120 + offset,
    };
    addNode(createPipelineNode(type, position, getNodeID));
  }, [type, nodes.length, getNodeID, addNode]);

  const onDragStart = (event) => {
    const appData = { nodeType: type };
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onClick = (event) => {
    event.preventDefault();
    addToCanvas();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex w-full cursor-grab items-center gap-2.5 rounded-md border border-slate-700/80 border-l-[3px] bg-slate-800/80 px-3 py-2.5 text-left shadow-sm transition active:cursor-grabbing active:scale-[0.98] ${accentClass}`}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          addToCanvas();
        }
      }}
      title="Click to add, or drag onto the canvas"
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`}
        aria-hidden
      />
      <span className="pointer-events-none text-sm font-medium text-slate-100">
        {label}
      </span>
    </div>
  );
};
