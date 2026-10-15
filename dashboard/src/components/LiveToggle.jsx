import { Radio, Power } from "lucide-react";

// button component to toggle live broadcast visibility status
export default function LiveToggle({ isLive, onToggle }) {
  return (
    <div className="flex flex-col gap-2 bg-[#0c1324]/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl font-inter">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Broadcast Control
      </span>

      <button
        type="button"
        onClick={onToggle}
        className={`relative w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl font-outfit font-black uppercase tracking-widest text-sm transition duration-300 shadow-lg group overflow-hidden ${
          isLive
            ? "bg-rose-600/10 border border-rose-500/40 text-rose-400 hover:bg-rose-600/20"
            : "bg-emerald-600/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/20"
        }`}
      >
        {isLive && (
          <span className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
        )}
        <div className="flex items-center gap-3.5 z-10">
          <div
            className={`p-1.5 rounded-lg ${
              isLive
                ? "bg-rose-500/20 text-rose-400"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            <Radio
              className={`w-4.5 h-4.5 ${isLive ? "animate-bounce" : ""}`}
            />
          </div>

          <div className="text-left space-y-0.5">
            <div className="text-xs tracking-wider">
              {isLive ? "ON AIR" : "OFF AIR"}
            </div>
            <div className="text-[9px] text-slate-400 font-normal tracking-wide lowercase normal-case">
              {isLive
                ? "graphic is visible on live stream"
                : "graphic is hidden from live stream"}
            </div>
          </div>
        </div>

        <div
          className={`p-2 rounded-lg border transition duration-300 z-10 ${
            isLive
              ? "bg-rose-500 border-rose-400 text-slate-950 group-hover:scale-105"
              : "bg-slate-950 border-slate-800 text-slate-400 group-hover:scale-105 group-hover:text-emerald-400"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}
