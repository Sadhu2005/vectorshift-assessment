import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { NodeDeleteButton } from '../components/NodeDeleteButton';
import { getFilterConditionHint } from '../utils/filterConditions';

const getFilterHint = getFilterConditionHint;

const accentClasses = {
  emerald: 'border-emerald-400/60 bg-emerald-50',
  rose: 'border-rose-400/60 bg-rose-50',
  violet: 'border-violet-400/60 bg-violet-50',
  amber: 'border-amber-400/60 bg-amber-50',
  cyan: 'border-cyan-400/60 bg-cyan-50',
  blue: 'border-blue-400/60 bg-blue-50',
  orange: 'border-orange-400/60 bg-orange-50',
  slate: 'border-slate-400/60 bg-slate-50',
  indigo: 'border-indigo-400/60 bg-indigo-50',
};

const headerAccent = {
  emerald: 'bg-emerald-600',
  rose: 'bg-rose-600',
  violet: 'bg-violet-600',
  amber: 'bg-amber-600',
  cyan: 'bg-cyan-600',
  blue: 'bg-blue-600',
  orange: 'bg-orange-600',
  slate: 'bg-slate-600',
  indigo: 'bg-indigo-600',
};

export const BaseNode = ({ id, data, config, dynamicHandles = [], width, height }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const accent = config.accent || 'indigo';
  const shellClass = accentClasses[accent] || accentClasses.indigo;
  const headerClass = headerAccent[accent] || headerAccent.indigo;

  const style = {
    minWidth: config.minWidth || 200,
    minHeight: config.minHeight || 80,
    width: width || data?.width,
    height: height || data?.height,
  };

  const onFieldChange = (name, value) => {
    updateNodeField(id, name, value);
  };

  const shouldShowField = (field) => {
    if (!field.showWhen) return true;
    const depValue = data?.[field.showWhen.field];
    if (field.showWhen.in) {
      return field.showWhen.in.includes(depValue);
    }
    if (field.showWhen.notIn) {
      return !field.showWhen.notIn.includes(depValue);
    }
    return true;
  };

  const renderField = (field) => {
    if (!shouldShowField(field)) return null;

    const value = data?.[field.name] ?? field.default ?? '';

    if (field.type === 'checkbox') {
      const checked = Boolean(data?.[field.name] ?? field.default ?? false);
      return (
        <label
          key={field.name}
          className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            checked={checked}
            onChange={(e) => onFieldChange(field.name, e.target.checked)}
          />
          <span className="font-medium">{field.label}</span>
        </label>
      );
    }

    if (field.type === 'select') {
      return (
        <label key={field.name} className="flex flex-col gap-0.5 text-xs text-slate-600">
          <span className="font-medium">{field.label}</span>
          <select
            className="rounded border border-slate-200 bg-white px-2 py-1 text-sm"
            value={value}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (field.type === 'textarea') {
      return (
        <label key={field.name} className="flex flex-col gap-0.5 text-xs text-slate-600">
          <span className="font-medium">{field.label}</span>
          <textarea
            className="resize-none rounded border border-slate-200 bg-white px-2 py-1 text-sm"
            rows={field.rows || 3}
            value={value}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
          />
        </label>
      );
    }

    if (field.type === 'number') {
      return (
        <label key={field.name} className="flex flex-col gap-0.5 text-xs text-slate-600">
          <span className="font-medium">{field.label}</span>
          <input
            type="number"
            min={field.min}
            max={field.max}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-sm"
            value={value}
            onChange={(e) => onFieldChange(field.name, Number(e.target.value))}
          />
        </label>
      );
    }

    return (
      <label key={field.name} className="flex flex-col gap-0.5 text-xs text-slate-600">
        <span className="font-medium">{field.label}</span>
        <input
          type="text"
          className="rounded border border-slate-200 bg-white px-2 py-1 text-sm"
          value={value}
          onChange={(e) => onFieldChange(field.name, e.target.value)}
        />
      </label>
    );
  };

  const staticHandles = config.handles || [];

  return (
    <div
      className={`pipeline-node relative rounded-lg border-2 shadow-md ${shellClass}`}
      style={style}
    >
      {staticHandles.map((h) => (
        <Handle
          key={h.idSuffix}
          type={h.type}
          position={h.position}
          id={`${id}-${h.idSuffix}`}
          style={h.style}
          className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500"
        />
      ))}

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

      <div
        className={`flex items-center rounded-t-md px-3 py-1.5 text-sm font-semibold text-white ${headerClass}`}
      >
        <span>{config.title}</span>
        <NodeDeleteButton nodeId={id} title={config.title} />
      </div>

      <div className="flex flex-col gap-2 px-3 py-2">
        {config.description && (
          <p className="text-xs text-slate-500">{config.description}</p>
        )}
        {config.fields?.map(renderField).filter(Boolean)}
        {config.title === 'Filter' && data?.condition && (
          <p className="text-[10px] leading-snug text-amber-700/90">
            {getFilterHint(data.condition)}
          </p>
        )}
      </div>
    </div>
  );
};
