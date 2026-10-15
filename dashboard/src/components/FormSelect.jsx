import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// custom styled dropdown select component
export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  // track dropdown open/closed state
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find currently selected option detail
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle option selection and close dropdown
  const handleSelect = (val) => {
    // Simulate standard select event structure to keep compatibility with parent handleChange
    onChange({
      target: {
        name,
        value: val,
      },
    });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={dropdownRef}>
      {label && (
        <span className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
          {label}
        </span>
      )}

      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-slate-950/80 hover:bg-slate-900 border rounded-2xl px-5 py-3.5 text-xs text-slate-200 transition-all duration-200 text-left font-outfit font-bold relative cursor-pointer ${
          isOpen
            ? "border-emerald-500/50 shadow-md shadow-emerald-500/5"
            : "border-slate-850 hover:border-slate-800"
        }`}
      >
        <span className="truncate">{selectedOption?.label || "Select..."}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-450 transition-transform duration-250 shrink-0 ${isOpen ? "rotate-180 text-emerald-450" : ""}`}
        />
      </button>

      {/* Floating Options Menu (Glassmorphism & pl-6 spacing) */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#0b1021]/95 border border-slate-800 rounded-2xl py-2 shadow-2xl z-50 backdrop-blur-lg animate-in fade-in slide-in-from-top-1 duration-150 max-h-[220px] overflow-y-auto scrollbar-thin">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left pl-6 pr-4 py-3.5 text-xs transition-all duration-150 font-outfit font-bold flex items-center justify-between ${
                  isSelected
                    ? "bg-emerald-500/10 text-emerald-455"
                    : "text-slate-350 hover:bg-slate-900/60 hover:text-slate-100"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400 mr-1.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
