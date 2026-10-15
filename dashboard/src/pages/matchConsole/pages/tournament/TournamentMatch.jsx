import { Trophy, Save } from "lucide-react";
import useTournament from "./useTournament";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";

export default function TournamentMatch() {
  const {
    matchData,
    isLive,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    handleSave,
    handleToggleLive,
  } = useTournament();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Tournament Brand Details...
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Tournament Watermark Bug"
        description="Toggle and position the tournament identity badge / logo watermark broadcasted live on screen."
        Icon={Trophy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow ml-4">
        {/* Left Column: Visual Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none" />

            <div className="absolute top-4 left-4 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-[8.5px] font-mono font-bold text-cyan-450 uppercase z-10 tracking-wider">
              1080p Stream Output
            </div>

            {/* Visual tournament watermark bug preview box */}
            <div
              className="absolute bg-[#0b1021]/95 border border-slate-850 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl transition-all duration-150"
              style={{
                transform: `scale(${scale}) translate(${xOffset / 5}px, ${-yOffset / 5}px)`,
              }}
            >
              <div className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center overflow-hidden p-1">
                {matchData.tournament?.logoUrl ? (
                  <img
                    src={`/uploads/misc/${matchData.tournament.logoUrl}`}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm">🏆</span>
                )}
              </div>
              <span className="text-[10.5px] font-black text-slate-100 uppercase tracking-widest font-outfit">
                {matchData.tournament?.name || "League Cup"}
              </span>
            </div>

            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-auto">
              Broadcast Watermark View
            </p>
          </div>
        </div>

        {/* Right Column: Console Action Controls */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Console Controls
          </h3>

          <div className="space-y-6">
            {/* Live Toggle Component */}
            <LiveToggle isLive={isLive} onToggle={handleToggleLive} />

            {/* Layout Controls for X, Y, and Scale */}
            <LayoutControls
              xOffset={xOffset}
              setXOffset={setXOffset}
              yOffset={yOffset}
              setYOffset={setYOffset}
              scale={scale}
              setScale={setScale}
            />

            {/* Save Layout Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Tournament Layout to Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
