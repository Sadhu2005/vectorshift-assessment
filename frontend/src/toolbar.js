import { DraggableNode } from './draggableNode';
import { toolbarNodes } from './nodes/nodeRegistry';
import { useStore } from './store';

const categories = ['Input', 'Transform', 'Output', 'Utility'];

export const PipelineToolbar = () => {
  const loadPipeline = useStore((s) => s.loadPipeline);
  const savePipeline = useStore((s) => s.savePipeline);
  const clearPipeline = useStore((s) => s.clearPipeline);

  return (
    <aside className="border-b border-slate-800 bg-slate-900 px-4 py-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Pipeline Editor</h1>
          <p className="text-xs text-slate-400">Drag nodes onto the canvas</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={savePipeline}
            className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={loadPipeline}
            className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600"
          >
            Load
          </button>
          <button
            type="button"
            onClick={clearPipeline}
            className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-slate-600"
          >
            Clear
          </button>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {category}
          </h2>
          <div className="flex flex-wrap gap-2">
            {toolbarNodes
              .filter((n) => n.category === category)
              .map((n) => (
                <DraggableNode key={n.type} type={n.type} label={n.label} />
              ))}
          </div>
        </div>
      ))}
    </aside>
  );
};
