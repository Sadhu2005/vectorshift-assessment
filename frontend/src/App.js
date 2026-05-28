import { ReactFlowProvider } from 'reactflow';
import { PipelineHeader } from './header';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { PipelineToast } from './components/PipelineToast';
import { MobileLandscapeGate } from './components/MobileLandscapeGate';

function App() {
  const envLabel = process.env.REACT_APP_ENV_LABEL;

  return (
    <ReactFlowProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-slate-100">
        {envLabel && (
          <div className="shrink-0 bg-amber-500 px-4 py-1 text-center text-xs font-semibold text-amber-950">
            {envLabel}
          </div>
        )}
        <MobileLandscapeGate>
          <PipelineHeader />
          <div className="flex min-h-0 flex-1">
            <PipelineToolbar />
            <div className="relative min-w-0 flex-1">
              <PipelineUI />
            </div>
          </div>
        </MobileLandscapeGate>
      </div>
      <PipelineToast />
    </ReactFlowProvider>
  );
}

export default App;
