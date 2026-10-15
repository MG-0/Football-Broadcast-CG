// reusable text and numeric input field
export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full bg-slate-955 border border-slate-850 focus:border-emerald-500/50 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition duration-150 font-inter ${className}`}
      />
    </div>
  );
}
