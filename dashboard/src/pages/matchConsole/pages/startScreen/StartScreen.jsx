import { Play, Save } from "lucide-react";
import useStartScreen from "./useStartScreen";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";

export default function StartScreen() {
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
  } = useStartScreen();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Match Intro Details...
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient backgrounds spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Start Screen Match Intro"
        description="Control the initial match introduction graphics displaying competing clubs and tournament branding."
        Icon={Play}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow ml-4">
        {/* Left Column: Visual Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[8px] sm:text-[9px] font-mono font-bold text-emerald-455 uppercase z-10 tracking-wider">
              1080p Stream Output
            </div>

            {/* Visual start screen graphic preview box - Positioned and Scaled */}
            <div
              className="relative mx-auto self-center flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 w-[90%] sm:w-full max-w-xs sm:max-w-sm bg-[#050915]/90 border border-slate-800/60 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-150"
              style={{
                transform: `scale(${scale}) translate(${xOffset / 5}px, ${-yOffset / 5}px)`,
              }}
            >
              {/* Tournament Brand Logo */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center overflow-hidden p-1.5 shadow-inner">
                {matchData.tournament?.logoUrl ? (
                  <img
                    src={`/uploads/misc/${matchData.tournament.logoUrl}`}
                    alt={matchData.tournament.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xl">🏆</span>
                )}
              </div>

              {/* Tournament Name */}
              <h4 className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest font-outfit">
                {matchData.tournament?.name}
              </h4>

              {/* Competing Teams Grid */}
              <div className="flex justify-between items-center w-full px-3 py-3.5 sm:px-5 sm:py-4.5 bg-slate-900/40 border border-slate-850 rounded-2xl gap-2 sm:gap-4">
                {/* Home Team */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-955 flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 border border-slate-800 shadow-sm">
                    {matchData.homeTeam?.imageUrl ? (
                      <img
                        src={`/uploads/misc/${matchData.homeTeam.imageUrl}`}
                        alt={matchData.homeTeam.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                        {matchData.homeTeam?.shortName}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-slate-200 truncate w-full text-center font-outfit uppercase tracking-wide">
                    {matchData.homeTeam?.name}
                  </span>
                </div>

                <span className="text-[8px] sm:text-[10px] font-black text-emerald-400 px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg sm:rounded-xl uppercase tracking-wider shrink-0 font-outfit">
                  VS
                </span>

                {/* Away Team */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-955 flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 border border-slate-800 shadow-sm">
                    {matchData.awayTeam?.imageUrl ? (
                      <img
                        src={`/uploads/misc/${matchData.awayTeam.imageUrl}`}
                        alt={matchData.awayTeam.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                        {matchData.awayTeam?.shortName}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-slate-200 truncate w-full text-center font-outfit uppercase tracking-wide">
                    {matchData.awayTeam?.name}
                  </span>
                </div>
              </div>

              <p className="text-[8px] sm:text-[10px] text-slate-550 font-bold uppercase tracking-widest font-inter">
                Broadcast Intro Overlay
              </p>
            </div>
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
              Save Start Screen to Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
