import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  const envLabel = process.env.REACT_APP_ENV_LABEL;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {envLabel && (
        <div className="bg-amber-500 px-4 py-1 text-center text-xs font-semibold text-amber-950">
          {envLabel}
        </div>
      )}
      <PipelineToolbar />
      <main className="flex-1">
        <PipelineUI />
      </main>
      <SubmitButton />
    </div>
  );
}

export default App;
