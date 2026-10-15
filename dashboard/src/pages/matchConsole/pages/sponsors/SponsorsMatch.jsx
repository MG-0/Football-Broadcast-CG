import { Handshake, Save } from "lucide-react";
import useSponsors from "./useSponsors";

import PageHeader from "../../../../components/Header";
import LayoutControls from "../../../../components/LayoutControls";
import LiveToggle from "../../../../components/LiveToggle";

export default function SponsorsMatch() {
  const {
    matchData,
    sponsorsList,
    selectedSponsorIds,
    isLoadingSponsors,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    isLive,
    toggleSponsorSelection,
    getSelectedSponsorsList,
    handleToggleLive,
    handleSaveSettings,
  } = useSponsors();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Match Details...
      </div>
    );
  }

  const selectedSponsors = getSelectedSponsorsList();

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Match Sponsors"
        description="Select individual commercial sponsors to show or hide on the stream broadcast."
        Icon={Handshake}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow ml-5">
        {/* Left Column: Visual Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex items-end justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-mono font-bold text-cyan-455 uppercase z-10 tracking-wider">
              1080p Stream Output
            </div>

            {/* Broadcast Sponsor Ticker Preview Bumper */}
            <div
              className="relative w-[90%] sm:w-[85%] origin-bottom bg-[#050915]/95 border border-slate-800/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col items-center space-y-3.5 z-10 transition-all duration-75"
              style={{
                bottom: `${(yOffset || 0) / 7}px`,
                left: `${(xOffset || 0) / 7}px`,
                transform: `scale(${scale || 1})`,
              }}
            >
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                Sponsors Bumper Preview
              </span>

              <div className="flex items-center justify-center gap-4 flex-wrap w-full">
                {isLoadingSponsors ? (
                  <span className="text-[10px] text-slate-600 font-mono animate-pulse">
                    Loading assigned sponsors...
                  </span>
                ) : selectedSponsors.length > 0 ? (
                  selectedSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="flex items-center gap-2 bg-slate-900/60 border border-slate-850 px-3 py-1.5 rounded-xl transition duration-200 shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-1 shrink-0">
                        <img
                          src={`/uploads/misc/${sponsor.logoUrl}`}
                          alt={sponsor.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200 font-outfit uppercase">
                        {sponsor.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-500 italic">
                    No sponsors selected for broadcast.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Live Toggle Control */}
          <LiveToggle isLive={isLive} onToggle={handleToggleLive} />
        </div>

        {/* Right Column: Console Action Controls */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Select Sponsors to Display
            </h3>

            {/* Sponsors Checklist Selection Panel */}
            <div className="bg-[#0b1021]/80 border border-slate-800/80 rounded-3xl p-5 max-h-[220px] overflow-y-auto space-y-3.5 shadow-xl">
              {isLoadingSponsors ? (
                <div className="text-center py-6 text-xs text-slate-600 font-mono animate-pulse">
                  Loading checklist...
                </div>
              ) : sponsorsList.length > 0 ? (
                sponsorsList.map((sponsor) => {
                  const isChecked = selectedSponsorIds.includes(sponsor.id);

                  return (
                    <label
                      key={sponsor.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                        isChecked
                          ? "bg-emerald-500/10 border-emerald-500/30 text-slate-100 shadow-md shadow-emerald-500/5"
                          : "bg-slate-955 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center p-1.5 shadow-inner">
                          <img
                            src={`/uploads/misc/${sponsor.logoUrl}`}
                            alt={sponsor.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-sm font-bold font-outfit uppercase tracking-wide">
                          {sponsor.name}
                        </span>
                      </div>

                      {/* Checkbox input */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSponsorSelection(sponsor.id)}
                        className="w-5 h-5 rounded-lg border-slate-800 text-emerald-555 focus:ring-emerald-500/20 bg-slate-900 cursor-pointer"
                      />
                    </label>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 italic">
                  No assigned sponsors found.
                </div>
              )}
            </div>
          </div>

          {/* Positioning Offset Controls */}
          <LayoutControls
            xOffset={xOffset}
            setXOffset={setXOffset}
            yOffset={yOffset}
            setYOffset={setYOffset}
            scale={scale}
            setScale={setScale}
          />

          {/* Save Configuration to Database Button */}
          <button
            type="button"
            onClick={handleSaveSettings}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4 text-white shrink-0" />
            Save Sponsors Config to Database
          </button>
        </div>
      </div>
    </div>
  );
}
