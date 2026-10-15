// modal component for deletion confirmation
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay with blur */}
      <div
        className="absolute inset-0 bg-[#03060f]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card container */}
      <div className="bg-[#0c1325] border border-slate-800/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 transition duration-200 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Warning Icon & Copy */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shrink-0">
            <svg
              className="w-7 h-7 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-wide">
              {title || "Confirm Delete"}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {message ||
                "Are you sure you want to remove this asset? This action is permanent and cannot be undone."}
            </p>
          </div>
        </div>

        {/* Buttons Action Insets */}
        <div className="flex gap-3 justify-center mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-slate-100 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
