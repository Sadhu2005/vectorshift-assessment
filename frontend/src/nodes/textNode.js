import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { NodeDeleteButton } from '../components/NodeDeleteButton';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;

const parseVariables = (text) => {
  const names = new Set();
  let match;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(text || '')) !== null) {
    names.add(match[1]);
  }
  return Array.from(names);
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const textareaRef = useRef(null);
  const text = data?.text ?? '{{input}}';

  const variables = useMemo(() => parseVariables(text), [text]);

  const dynamicHandles = useMemo(
    () =>
      variables.map((name, index) => ({
        id: `${id}-var-${name}`,
        style: {
          top: `${((index + 1) / (variables.length + 1)) * 100}%`,
        },
      })),
    [id, variables]
  );

  const resizeNode = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const minWidth = 220;
    const minHeight = 120;
    const width = Math.max(minWidth, el.scrollWidth + 24);
    const height = Math.max(minHeight, el.scrollHeight + 56);
    updateNodeField(id, 'width', width);
    updateNodeField(id, 'height', height);
  }, [id, updateNodeField]);

  useEffect(() => {
    resizeNode();
  }, [text, resizeNode]);

  useEffect(() => {
    updateNodeField(id, 'variables', variables);
  }, [id, variables, updateNodeField]);

  const onTextChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <div
      className="pipeline-node relative rounded-lg border-2 border-indigo-400/60 bg-indigo-50 shadow-md"
      style={{
        minWidth: 220,
        minHeight: 120,
        width: data?.width,
        height: data?.height,
      }}
    >
      {dynamicHandles.map((h) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={h.id}
          style={h.style}
          className="!h-3 !w-3 !border-2 !border-white !bg-violet-500"
        />
      ))}

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500"
      />

      <div className="flex items-center rounded-t-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">
        <span>Text</span>
        <NodeDeleteButton nodeId={id} title="Text" />
      </div>

      <div className="flex flex-col gap-1 px-3 py-2">
        <label className="text-xs font-medium text-slate-600">
          Template (use {'{{variable}}'} for inputs)
        </label>
        <textarea
          ref={textareaRef}
          className="min-h-[60px] w-full resize-none overflow-hidden rounded border border-slate-200 bg-white px-2 py-1 font-mono text-sm leading-relaxed"
          value={text}
          onChange={onTextChange}
          onInput={resizeNode}
          placeholder="Hello {{name}}"
        />
        {variables.length > 0 && (
          <p className="text-xs text-violet-600">
            Variables: {variables.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};
