import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export const NodeDeleteButton = ({ nodeId, title }) => {
  const { deleteElements, getNode } = useReactFlow();

  const onDelete = useCallback(
    (event) => {
      event.stopPropagation();
      const node = getNode(nodeId);
      if (node) {
        deleteElements({ nodes: [node] });
      }
    },
    [nodeId, deleteElements, getNode]
  );

  return (
    <button
      type="button"
      onClick={onDelete}
      className="nodrag nopan ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded text-white/80 transition hover:bg-white/20 hover:text-white"
      title={`Remove ${title}`}
      aria-label={`Remove ${title}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
      >
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  );
};
