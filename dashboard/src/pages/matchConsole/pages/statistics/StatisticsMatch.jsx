import React from "react";
import { BarChart3, Save, Plus, Minus } from "lucide-react";
import useStatistics from "./useStatistics";
import { STATS_CONFIG } from "../../config/layersConfig.js";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";
import FormInput from "../../../../components/FormInput";

export default function StatisticsMatch() {
  const {
    logoUrl,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    handleSave,
    handleUpdate,
    handleToggleLive,
    isLive,
    matchData,
    period,
    setPeriod,
    stats,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
  } = useStatistics();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Match Details...
      </div>
    );
  }

  // Quick helper to increment/decrement stat by a certain step amount
  const adjustStat = (statKey, team, amount) => {
    const currentVal = stats[statKey]?.[team] ?? 0;
    const newVal = Math.max(0, currentVal + amount);

    handleUpdate(statKey, team, newVal);
  };

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Match Statistics"
        description="Enter, save, and broadcast live match stats (possession, shots, cards) to the stream overlay."
        Icon={BarChart3}
      />

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        {/* Left Column: Visual Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          <div className="w-full h-[380px] rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-emerald-450 uppercase">
              1080p Stream Output
            </div>

            {/* Broadcast Statistics Card Preview Simulator */}
            <div
              className="relative w-80 bg-slate-955 border border-slate-800/60 rounded-2xl p-0 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden transition-all duration-75"
              style={{
                transform: `scale(${scale || 1}) translate(${xOffset / 5}px, ${-yOffset / 5}px)`,
              }}
            >
              {/* Header with Teams info */}
              <div className="flex items-center justify-between bg-slate-900 border-b border-slate-850 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  {logoUrl(homeTeam?.imageUrl) ? (
                    <img
                      src={logoUrl(homeTeam.imageUrl)}
                      className="h-6 w-6 object-contain shrink-0"
                      alt=""
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      H
                    </span>
                  )}
                  <span className="text-xs font-black text-white uppercase truncate font-outfit">
                    {homeTeam?.shortName || "HOME"}
                  </span>
                </div>

                <div className="flex flex-col items-center shrink-0 px-2">
                  <span className="text-[8px] font-black text-slate-555 tracking-widest uppercase mb-0.5 font-mono">
                    Match Stats
                  </span>
                  <div className="flex items-center gap-2 bg-[#050915] px-2.5 py-0.5 rounded-lg border border-slate-800">
                    <span className="text-xs font-black text-slate-200 font-mono">
                      {homeScore}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 font-mono">
                      -
                    </span>
                    <span className="text-xs font-black text-slate-200 font-mono">
                      {awayScore}
                    </span>
                  </div>
                  {period && (
                    <span className="mt-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                      {period}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
                  {logoUrl(awayTeam?.imageUrl) ? (
                    <img
                      src={logoUrl(awayTeam.imageUrl)}
                      className="h-6 w-6 object-contain shrink-0"
                      alt=""
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      A
                    </span>
                  )}
                  <span className="text-xs font-black text-white uppercase truncate font-outfit">
                    {awayTeam?.shortName || "AWAY"}
                  </span>
                </div>
              </div>

              {/* Stats Rows Table */}
              <div className="flex flex-col py-2.5 divide-y divide-slate-900/40">
                {STATS_CONFIG.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex justify-between items-center px-6 py-2 hover:bg-slate-900/30 transition-colors"
                  >
                    <span
                      className="text-xs font-bold w-8 text-left font-mono"
                      style={{ color: homeTeam?.primaryColor || "#34d399" }}
                    >
                      {stats[key]?.home ?? 0}
                    </span>
                    <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider flex-1 text-center font-mono">
                      {label}
                    </span>
                    <span
                      className="text-xs font-bold w-8 text-right font-mono"
                      style={{ color: awayTeam?.primaryColor || "#34d399" }}
                    >
                      {stats[key]?.away ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Toggle */}
          <LiveToggle isLive={isLive} onToggle={handleToggleLive} />
        </div>

        {/* Right Column: Controls Panel */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Data Entry Deck
          </h3>

          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl flex flex-col space-y-6">
            {/* Header Labels */}
            <div className="flex justify-between items-center border-b border-slate-900/60 pb-3">
              <div className="text-xs font-black text-emerald-400 w-24 text-center font-outfit uppercase tracking-wider">
                {homeTeam?.shortName || "HOME"}
              </div>
              <div className="text-[9px] font-black text-slate-555 uppercase tracking-widest font-mono">
                Statistic Type
              </div>
              <div className="text-xs font-black text-emerald-400 w-24 text-center font-outfit uppercase tracking-wider">
                {awayTeam?.shortName || "AWAY"}
              </div>
            </div>

            {/* Form Inputs Container */}
            <div className="space-y-4">
              {/* Period Input row */}
              <div className="pb-3 border-b border-slate-900/60">
                <FormInput
                  label="Match Period Display Title"
                  name="period"
                  type="text"
                  placeholder="e.g. FULL TIME"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="text-center font-outfit font-black tracking-widest"
                />
              </div>

              {/* Stats entries list */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin">
                {STATS_CONFIG.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-slate-955 border border-slate-850/80 rounded-2xl group hover:border-slate-800 transition duration-150"
                  >
                    {/* Home controls */}
                    <div className="flex items-center gap-1.5 w-24 shrink-0 justify-center">
                      <button
                        type="button"
                        onClick={() => adjustStat(key, "home", -1)}
                        className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 flex items-center justify-center transition active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={stats[key]?.home ?? 0}
                        onChange={(e) =>
                          handleUpdate(key, "home", Number(e.target.value))
                        }
                        className="w-10 bg-transparent text-center text-sm font-bold font-mono text-slate-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustStat(key, "home", 1)}
                        className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/25 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Centered stat title */}
                    <span className="flex-grow text-center text-[10px] font-black text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest font-mono px-3 leading-snug">
                      {label}
                    </span>

                    {/* Away controls */}
                    <div className="flex items-center gap-1.5 w-24 shrink-0 justify-center">
                      <button
                        type="button"
                        onClick={() => adjustStat(key, "away", -1)}
                        className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 flex items-center justify-center transition active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={stats[key]?.away ?? 0}
                        onChange={(e) =>
                          handleUpdate(key, "away", Number(e.target.value))
                        }
                        className="w-10 bg-transparent text-center text-sm font-bold font-mono text-slate-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustStat(key, "away", 1)}
                        className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/25 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Stats Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Statistics to Database
            </button>
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
        </div>
      </div>
    </div>
  );
}
