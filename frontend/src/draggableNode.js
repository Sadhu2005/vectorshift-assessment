export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`${type} flex min-w-[88px] cursor-grab flex-col items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 shadow transition hover:border-indigo-400 hover:bg-slate-700 active:cursor-grabbing`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => {
        event.target.style.cursor = 'grab';
      }}
      draggable
    >
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
  );
};
