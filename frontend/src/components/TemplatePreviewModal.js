import { TemplateIcon } from './TemplateIcon';
import { getTemplateMeta } from '../templates/templateMeta';

export const TemplatePreviewModal = ({ template, onClose, onUse }) => {
  if (!template) return null;

  const meta = getTemplateMeta(template.id);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="template-preview-title"
      >
        <div className="flex items-start gap-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6">
          <TemplateIcon type={meta.icon} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {template.category}
            </p>
            <h2
              id="template-preview-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {template.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{meta.tagline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <p className="text-sm text-slate-600">{template.description}</p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Flow
            </p>
            <div className="flex flex-wrap items-center gap-1">
              {meta.flow.map((step, i) => (
                <span key={`${step}-${i}`} className="flex items-center gap-1">
                  <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800">
                    {step}
                  </span>
                  {i < meta.flow.length - 1 && (
                    <span className="text-slate-300">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-4 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm">
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">
                {template.nodes.length}
              </p>
              <p className="text-xs text-slate-500">Nodes</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">
                {template.edges.length}
              </p>
              <p className="text-xs text-slate-500">Connections</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onUse(template)}
            className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            Use this template
          </button>
        </div>
      </div>
    </div>
  );
};
