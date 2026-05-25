import { useState } from 'react';
import { useStore } from './store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const SubmitButton = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('pipeline', JSON.stringify({ nodes, edges }));

      const response = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(errBody || `Request failed (${response.status})`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to submit pipeline');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <footer className="border-t border-slate-200 bg-white px-6 py-4 shadow-inner">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || nodes.length === 0}
            className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Validating…' : 'Submit Pipeline'}
          </button>
        </div>
      </footer>

      {(result || error) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="max-w-md w-full rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="result-title"
          >
            {error ? (
              <>
                <h2
                  id="result-title"
                  className="text-lg font-bold text-rose-600"
                >
                  Submission failed
                </h2>
                <p className="mt-2 text-sm text-slate-600">{error}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Ensure the backend is running at {API_URL}
                </p>
              </>
            ) : (
              <>
                <h2
                  id="result-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Pipeline analysis
                </h2>
                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                    <dt className="text-sm text-slate-600">Nodes</dt>
                    <dd className="font-semibold text-slate-900">
                      {result.num_nodes}
                    </dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                    <dt className="text-sm text-slate-600">Edges</dt>
                    <dd className="font-semibold text-slate-900">
                      {result.num_edges}
                    </dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                    <dt className="text-sm text-slate-600">Valid DAG</dt>
                    <dd
                      className={`font-semibold ${
                        result.is_dag ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {result.is_dag ? 'Yes' : 'No — cycle detected'}
                    </dd>
                  </div>
                </dl>
                {!result.is_dag && (
                  <p className="mt-3 text-xs text-slate-500">
                    Remove circular connections so data flows in one direction.
                  </p>
                )}
              </>
            )}
            <button
              type="button"
              onClick={closeModal}
              className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
