import { useStore } from './store';
import { SubmitButton } from './submit';
import { DeleteSelectionButton } from './components/DeleteSelectionButton';

export const PipelineHeader = () => {
  const savePipeline = useStore((s) => s.savePipeline);
  const loadPipeline = useStore((s) => s.loadPipeline);
  const exportPipeline = useStore((s) => s.exportPipeline);
  const importPipeline = useStore((s) => s.importPipeline);
  const clearPipeline = useStore((s) => s.clearPipeline);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow">
          VS
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900">
            Pipeline Editor
          </h1>
          <p className="text-xs text-slate-500">
            Build and validate your workflow
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={savePipeline}
          title="Save to browser storage (this device)"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={loadPipeline}
          title="Load from browser storage"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Load
        </button>
        <button
          type="button"
          onClick={exportPipeline}
          title="Download pipeline as JSON file"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          Export
        </button>
        <button
          type="button"
          onClick={importPipeline}
          title="Upload a JSON pipeline file"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          Import
        </button>
        <button
          type="button"
          onClick={clearPipeline}
          className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 shadow-sm transition hover:bg-rose-50"
        >
          Clear
        </button>
        <DeleteSelectionButton />
        <div className="mx-1 h-6 w-px bg-slate-200" />
        <SubmitButton inline />
      </div>
    </header>
  );
};
