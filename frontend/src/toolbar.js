import { useState, useCallback, useEffect } from 'react';
import { NodesPanel } from './components/NodesPanel';
import { TemplatePanel } from './components/TemplatePanel';

const tabs = [
  { id: 'templates', label: 'Templates', icon: '◇' },
  { id: 'nodes', label: 'Nodes', icon: '▣' },
];

const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 300;
const MOBILE_DEFAULT_WIDTH = 200;
const MOBILE_MIN_WIDTH = 160;

const getInitialWidth = () => {
  if (typeof window === 'undefined') return DEFAULT_WIDTH;
  const mobile =
    window.matchMedia('(max-width: 896px)').matches ||
    (window.innerWidth <= 896 && 'ontouchstart' in window);
  return mobile ? MOBILE_DEFAULT_WIDTH : DEFAULT_WIDTH;
};

export const PipelineToolbar = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [width, setWidth] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const minW =
      window.innerWidth <= 896 && 'ontouchstart' in window
        ? MOBILE_MIN_WIDTH
        : MIN_WIDTH;

    const onMove = (e) => {
      setWidth(Math.min(MAX_WIDTH, Math.max(minW, e.clientX)));
    };
    const onUp = () => setIsResizing(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing]);

  return (
    <aside
      className="relative flex shrink-0 flex-col border-r border-slate-800 bg-slate-900"
      style={{ width }}
    >
      <div className="border-b border-slate-800 px-3 pt-3 pb-2">
        <div className="flex rounded-lg bg-slate-800 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-80">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {activeTab === 'templates' ? <TemplatePanel /> : <NodesPanel />}
      </div>

      <p className="shrink-0 border-t border-slate-800 px-3 py-2 text-center text-[10px] text-slate-600">
        {activeTab === 'templates'
          ? 'Click template to preview · drag right edge to widen'
          : 'Click or drag nodes to canvas'}
      </p>

      {/* Drag to resize sidebar */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={startResize}
        className={`absolute top-0 right-0 z-10 h-full w-1.5 cursor-col-resize transition hover:bg-indigo-500/60 ${
          isResizing ? 'bg-indigo-500' : 'bg-transparent'
        }`}
      />
    </aside>
  );
};
