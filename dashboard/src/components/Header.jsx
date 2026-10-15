// dashboard header component showing title, description, and icon
export default function Header({ title, description, Icon }) {
  return (
    <div className="flex items-start gap-3.5 mb-2">
      {Icon && (
        <div className="p-2.5 rounded-xl ml-4 bg-slate-900 border border-slate-800 text-emerald-400 shadow-md">
          <Icon className="w-5 h-5" />
        </div>
      )}

      <div className="space-y-0.5">
        <h2 className="text-xl font-extrabold text-slate-100 tracking-wide font-outfit">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-400 font-inter">{description}</p>
        )}
      </div>
    </div>
  );
}
