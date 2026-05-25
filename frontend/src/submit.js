import { useState } from 'react';
import { useStore } from './store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const parseApiError = async (response) => {
  const text = await response.text();
  try {
    const body = JSON.parse(text);
    if (body.detail) {
      return typeof body.detail === 'string'
        ? body.detail
        : JSON.stringify(body.detail);
    }
  } catch {
    /* not JSON */
  }
  return text || `Request failed (${response.status})`;
};

/**
 * Part 4: user-friendly alert text for num_nodes, num_edges, is_dag.
 * Shown via window.alert() when the backend responds successfully.
 */
export const formatPipelineAlert = (data) => {
  const dagLine = data.is_dag
    ? 'Yes — this pipeline is a valid DAG (no cycles).'
    : 'No — this pipeline has a cycle. Remove circular connections.';

  return (
    'Pipeline analysis\n\n' +
    `Number of nodes: ${data.num_nodes}\n` +
    `Number of edges: ${data.num_edges}\n` +
    `Is DAG: ${dagLine}`
  );
};

const Spinner = () => (
  <span
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
    aria-hidden="true"
  />
);

export const SubmitButton = ({ inline = false }) => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEmpty = nodes.length === 0;

  const handleSubmit = async () => {
    if (isEmpty || loading) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pipeline', JSON.stringify({ nodes, edges }));

      const response = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const data = await response.json();
      // Assessment Part 4: alert displaying num_nodes, num_edges, is_dag
      window.alert(formatPipelineAlert(data));
    } catch (err) {
      setError(err.message || 'Failed to submit pipeline');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (loading) return;
    setError(null);
  };

  const buttonClass = inline
    ? 'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
    : 'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <>
      <button
        type="button"
        data-testid="submit-pipeline"
        onClick={handleSubmit}
        disabled={loading || isEmpty}
        aria-busy={loading}
        title={isEmpty ? 'Add at least one node before submitting' : undefined}
        className={buttonClass}
      >
        {loading && <Spinner />}
        {loading ? 'Validating…' : 'Submit'}
      </button>

      {error && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="error-title"
            aria-modal="true"
          >
            <h2 id="error-title" className="text-lg font-bold text-rose-600">
              Submission failed
            </h2>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <p className="mt-2 text-xs text-slate-400">
              Ensure the backend is running at {API_URL}
            </p>
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
