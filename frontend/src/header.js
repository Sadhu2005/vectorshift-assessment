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
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 shadow-sm sm:h-14 sm:px-5">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow sm:h-9 sm:w-9 sm:text-sm">
          VS
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            Pipeline Editor
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Build and validate your workflow
          </p>
        </div>
      </div>

      <div className="flex max-w-[58vw] shrink-0 items-center gap-1 overflow-x-auto sm:max-w-none sm:gap-2">
        <button
          type="button"
          onClick={savePipeline}
          title="Save to browser storage (this device)"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-3 sm:py-1.5 sm:text-sm"
        >
          Save
        </button>
        <button
          type="button"
          onClick={loadPipeline}
          title="Load from browser storage"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-3 sm:py-1.5 sm:text-sm"
        >
          Load
        </button>
        <button
          type="button"
          onClick={exportPipeline}
          title="Download pipeline as JSON file"
          className="hidden shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 min-[700px]:inline sm:px-3 sm:py-1.5 sm:text-sm"
        >
          Export
        </button>
        <button
          type="button"
          onClick={importPipeline}
          title="Upload a JSON pipeline file"
          className="hidden shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 min-[700px]:inline sm:px-3 sm:py-1.5 sm:text-sm"
        >
          Import
        </button>
        <button
          type="button"
          onClick={clearPipeline}
          className="shrink-0 rounded-lg border border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-600 shadow-sm transition hover:bg-rose-50 sm:px-3 sm:py-1.5 sm:text-sm"
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
