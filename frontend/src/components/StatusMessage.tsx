type Props = {
  type?: 'info' | 'error' | 'success';
  message: string;
  onClose?: () => void;
};

const colorMap: Record<string,string> = {
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

export function StatusMessage({ type = 'info', message, onClose }: Props) {
  const classes = colorMap[type];
  return (
    <div className={`fade-in rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-3 shadow-sm ${classes}`}>
      <span className="flex-1 leading-relaxed">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xs opacity-70 hover:opacity-100 transition"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
