import { useState, useCallback } from 'react';
import { useOnSelectionChange, useReactFlow } from 'reactflow';

export const DeleteSelectionButton = () => {
  const { getNodes, deleteElements } = useReactFlow();
  const [selectedCount, setSelectedCount] = useState(0);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedCount(nodes.length);
    },
  });

  const handleDelete = useCallback(() => {
    const selectedNodes = getNodes().filter((n) => n.selected);
    if (selectedNodes.length === 0) return;
    deleteElements({ nodes: selectedNodes });
  }, [getNodes, deleteElements]);

  if (selectedCount === 0) return null;

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-rose-100"
      title="Delete selected (Backspace or Delete)"
    >
      Delete{selectedCount > 1 ? ` (${selectedCount})` : ''}
    </button>
  );
};
