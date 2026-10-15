import { useOutletContext } from "react-router-dom";
import { layersConfig } from "../config/layersConfig";

// Import Lucide Icons (added XCircle icon for the clear button)
import { LayoutGrid, XCircle } from "lucide-react";

import PageHeader from "../../../components/Header";
import LayerCard from "../../../components/LayerCard";

export default function LiveLayersPage() {
  // Destructured clearAllGraphics from Outlet Context
  const { overLayStates, toggleOverlay, clearAllGraphics } = useOutletContext();

  return (
    <div className="space-y-4 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Joyful Neon Glow Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Header layout containing the title and the panic button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-850 pb-2.5">
        <PageHeader
          title="Live Control Board"
          description="Quickly trigger and toggle graphics overlays directly on the stream broadcast from a single master view."
          Icon={LayoutGrid}
        />

        {/* Panic Button placed inside the page */}
        <button
          type="button"
          onClick={clearAllGraphics}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-rose-600/30 hover:scale-[1.03] active:scale-95 font-outfit shrink-0 self-start sm:self-center cursor-pointer group"
          title="Turn off all active overlays"
        >
          <XCircle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
          <span>Clear All Graphics</span>
        </button>
      </div>

      {/* Responsive Switcher Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-4 px-1">
        {layersConfig.map((layer) => (
          <LayerCard
            key={layer.id}
            layer={layer}
            isLive={overLayStates[layer.id]}
            onToggle={toggleOverlay}
          />
        ))}
      </div>
    </div>
  );
}
