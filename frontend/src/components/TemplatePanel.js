import { useState } from 'react';
import { useStore } from '../store';
import { pipelineTemplates } from '../templates/pipelineTemplates';
import { getTemplateMeta } from '../templates/templateMeta';
import { TemplateIcon } from './TemplateIcon';
import { TemplatePreviewModal } from './TemplatePreviewModal';

const categoryOrder = [
  'Getting started',
  'AI workflows',
  'Data pipelines',
  'Safety',
  'Advanced',
];

export const TemplatePanel = () => {
  const loadTemplate = useStore((s) => s.loadTemplate);
  const nodeCount = useStore((s) => s.nodes.length);
  const [preview, setPreview] = useState(null);

  const applyTemplate = (template) => {
    if (
      nodeCount > 0 &&
      !window.confirm(`Replace canvas with "${template.name}"?`)
    ) {
      return;
    }
    loadTemplate(template);
    setPreview(null);
  };

  return (
    <>
      <div className="space-y-4 px-3 py-3">
        {categoryOrder.map((category) => {
          const items = pipelineTemplates.filter((t) => t.category === category);
          if (items.length === 0) return null;

          return (
            <section key={category}>
              <h3 className="mb-2 px-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {category}
              </h3>
              <div className="space-y-1.5">
                {items.map((template) => {
                  const meta = getTemplateMeta(template.id);
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setPreview(template)}
                      className="group flex w-full items-center gap-2.5 rounded-lg border border-transparent bg-slate-800/60 px-2 py-2 text-left transition hover:border-indigo-500/50 hover:bg-slate-800"
                    >
                      <TemplateIcon type={meta.icon} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {template.name}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                          {meta.tagline}
                        </p>
                      </div>
                      <span className="shrink-0 text-slate-500 transition group-hover:text-indigo-300">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <TemplatePreviewModal
        template={preview}
        onClose={() => setPreview(null)}
        onUse={applyTemplate}
      />
    </>
  );
};
