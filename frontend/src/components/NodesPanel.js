import { DraggableNode } from '../draggableNode';
import { toolbarNodes } from '../nodes/nodeRegistry';

const categories = [
  { id: 'Input', description: 'Data sources' },
  { id: 'Transform', description: 'Processing steps' },
  { id: 'Output', description: 'Results' },
  { id: 'Utility', description: 'Annotations' },
];

export const NodesPanel = () => (
  <div className="space-y-4 px-3 py-3">
    {categories.map((category) => (
      <section key={category.id} className="mb-5 last:mb-0">
        <div className="mb-2 px-1">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {category.id}
          </h3>
          <p className="text-[10px] text-slate-600">{category.description}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          {toolbarNodes
            .filter((n) => n.category === category.id)
            .map((n) => (
              <DraggableNode key={n.type} type={n.type} label={n.label} />
            ))}
        </div>
      </section>
    ))}
  </div>
);
