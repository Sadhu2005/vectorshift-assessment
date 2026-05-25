import { useEffect } from 'react';
import { useStore } from '../store';

export const PipelineToast = () => {
  const message = useStore((s) => s.uiMessage);
  const clearMessage = useStore((s) => s.clearMessage);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clearMessage, 3500);
    return () => clearTimeout(t);
  }, [message, clearMessage]);

  if (!message) return null;

  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-800 text-white',
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${styles[message.type] || styles.info}`}
      role="status"
    >
      {message.text}
    </div>
  );
};
