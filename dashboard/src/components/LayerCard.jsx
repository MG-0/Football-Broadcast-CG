import React from "react";

export default function LayerCard({ isLive, layer, onToggle }) {
  return (
    <div
      className={`bg-[#0c1324]/90 backdrop-blur border rounded-2xl p-4 flex flex-col justify-between gap-3.5 transition-all duration-200 hover:scale-[1.02] ${
        isLive
          ? "border-emerald-500/80 shadow-lg shadow-emerald-500/10 bg-[#0e1a32]/95"
          : "border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0f172a]/70 hover:shadow-lg hover:shadow-cyan-500/5"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          {(() => {
            const IconComponent = layer.icon;

            return (
              <IconComponent className="w-5 h-5 text-cyan-400 stroke-[2.2]" />
            );
          })()}
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">
            Graphic Layer
          </span>

          <span className="text-sm font-black text-slate-100 truncate block font-outfit uppercase tracking-wide">
            {layer.name}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-850/80 gap-2">
        {/* Status */}
        <span
          className={`text-[10px] font-black font-mono uppercase tracking-wider flex items-center gap-2 shrink-0 ${
            isLive ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {isLive ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              ON AIR
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-700" />
              OFF LINE
            </>
          )}
        </span>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggle(layer.id, true)}
            className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all duration-150 font-outfit min-w-[56px] text-center border active:scale-95 cursor-pointer ${
              isLive
                ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-default font-black"
                : "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100"
            }`}
          >
            Show
          </button>

          <button
            type="button"
            onClick={() => onToggle(layer.id, false)}
            className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all duration-150 font-outfit min-w-[56px] text-center border active:scale-95 cursor-pointer ${
              !isLive
                ? "bg-slate-955/80 border-slate-900/60 text-slate-600 cursor-default opacity-60"
                : "bg-rose-600 border-rose-500 text-slate-100 hover:bg-rose-500 shadow-md shadow-rose-500/20"
            }`}
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
