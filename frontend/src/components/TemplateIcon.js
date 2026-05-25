const icons = {
  llm: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  rag: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M4 6h16M4 12h10M4 18h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M7 8h10v8H7V8zM4 12h3M17 12h3M12 5v3M12 16v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  merge: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M6 6v12M18 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  delay: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M12 4l7 3v5c0 4.5-3 7.5-7 8-4-.5-7-3.5-7-8V7l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  branch: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M6 6v12M6 12h6M12 8v8M12 12h6M18 6v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const colors = {
  llm: 'bg-violet-500/20 text-violet-300',
  rag: 'bg-indigo-500/20 text-indigo-300',
  api: 'bg-blue-500/20 text-blue-300',
  merge: 'bg-cyan-500/20 text-cyan-300',
  delay: 'bg-orange-500/20 text-orange-300',
  shield: 'bg-emerald-500/20 text-emerald-300',
  branch: 'bg-amber-500/20 text-amber-300',
};

export const TemplateIcon = ({ type, size = 'md' }) => {
  const box =
    size === 'lg'
      ? 'h-14 w-14 rounded-xl'
      : 'h-10 w-10 rounded-lg';
  const color = colors[type] || colors.llm;

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${box} ${color}`}
    >
      {icons[type] || icons.llm}
    </div>
  );
};
