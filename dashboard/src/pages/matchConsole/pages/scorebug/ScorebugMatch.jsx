import React from "react";
import { Tv, Save, Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import useScorebug from "./useScorebug";
import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";

export default function ScorebugMatch() {
  const {
    matchData,
    isLive,
    homeScore,
    setHomeScore,
    awayScore,
    setAwayScore,
    minute,
    setMinute,
    second,
    setSecond,
    period,
    setPeriod,
    isRunning,
    setIsRunning,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    addedTime,
    setAddedTime,
    fmt,
    logoUrl,
    adjustOffset,
    handleSave,
    handleToggleLive,
    PERIODS,
    periodLabels,
    getPeriodStyle,
  } = useScorebug();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Match Details...
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <PageHeader
        title="Score Bug Control"
        description="Control the live scoreboard graphic, match timer, and period displayed on the broadcast stream."
        Icon={Tv}
      />

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-grow">
        {/* ── LEFT: Score Controls + Preview ── */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Broadcast Preview Monitor */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
              Broadcast Preview
            </h3>
            <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex items-start justify-center pt-6">
              <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-emerald-450 uppercase">
                1080p Stream Output
              </div>

              {/* Score Bug Preview Card */}
              <div
                className="relative z-10 origin-top"
                style={{
                  top: `${(yOffset || 0) / 7}px`,
                  left: `${(xOffset || 0) / 7}px`,
                  transform: `scale(${scale || 1})`,
                }}
              >
                <div
                  className="flex items-stretch shadow-2xl border border-white/10 rounded-2xl overflow-hidden"
                  style={{ minWidth: "360px" }}
                >
                  {/* Home Side */}
                  <div className="flex items-center gap-3 bg-[#0d1526]/98 px-5 py-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {logoUrl(matchData.homeTeam?.imageUrl) ? (
                        <img
                          src={logoUrl(matchData.homeTeam.imageUrl)}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          H
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider truncate font-outfit">
                      {matchData.homeTeam?.shortName ||
                        matchData.homeTeam?.name}
                    </span>
                  </div>

                  {/* Center Score Block */}
                  <div className="flex flex-col items-center justify-center bg-[#060c1a] px-6 py-3 border-x border-white/5 gap-1 relative min-w-[110px]">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <span className="bg-[#0f172a] text-white border border-white/20 px-3 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider block">
                        {period}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-white tabular-nums leading-none">
                        {homeScore}
                      </span>
                      {logoUrl(matchData?.tournament?.logoUrl) ? (
                        <img
                          src={logoUrl(matchData.tournament.logoUrl)}
                          className="w-5 h-5 object-contain"
                          alt=""
                        />
                      ) : (
                        <span className="text-slate-500 font-bold">–</span>
                      )}
                      <span className="text-3xl font-black text-white tabular-nums leading-none">
                        {awayScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-black font-mono ${isRunning ? "text-emerald-400" : "text-slate-500"}`}
                      >
                        {fmt(minute)}:{fmt(second)}
                      </span>
                      {addedTime > 0 && (
                        <span className="text-[9px] font-black font-sans text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1 rounded">
                          +{addedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Away Side */}
                  <div className="flex items-center gap-3 bg-[#0d1526]/98 px-5 py-3 flex-1 flex-row-reverse">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {logoUrl(matchData.awayTeam?.imageUrl) ? (
                        <img
                          src={logoUrl(matchData.awayTeam.imageUrl)}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          A
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider truncate font-outfit">
                      {matchData.awayTeam?.shortName ||
                        matchData.awayTeam?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Goal Controls ── */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
              Goal Controls
            </h3>
            <div className="grid grid-cols-2 gap-5">
              {/* Home Score Card */}
              <div className="bg-slate-955 border border-slate-850 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    {logoUrl(matchData.homeTeam?.imageUrl) ? (
                      <img
                        src={logoUrl(matchData.homeTeam.imageUrl)}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[8px] text-slate-400">H</span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-200 uppercase tracking-wider truncate font-outfit">
                    {matchData.homeTeam?.shortName || matchData.homeTeam?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setHomeScore((prev) => Math.max(0, prev - 1))
                    }
                    className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center justify-center active:scale-90"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-5xl font-black text-white tabular-nums font-outfit">
                    {homeScore}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHomeScore((prev) => prev + 1)}
                    className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Away Score Card */}
              <div className="bg-slate-955 border border-slate-850 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    {logoUrl(matchData.awayTeam?.imageUrl) ? (
                      <img
                        src={logoUrl(matchData.awayTeam.imageUrl)}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[8px] text-slate-400">A</span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-200 uppercase tracking-wider truncate font-outfit">
                    {matchData.awayTeam?.shortName || matchData.awayTeam?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setAwayScore((prev) => Math.max(0, prev - 1))
                    }
                    className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center justify-center active:scale-90"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-5xl font-black text-white tabular-nums font-outfit">
                    {awayScore}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAwayScore((prev) => prev + 1)}
                    className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Timer + Period + Console ── */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* ── Match Timer Block ── */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
              Match Timer
            </h3>

            {/* Big MM:SS Display */}
            <div className="bg-slate-955 border border-slate-850 rounded-2xl p-6 flex flex-col items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                Elapsed Time
              </span>
              <div className="flex items-end gap-1">
                <span className="text-6xl font-black text-white tabular-nums leading-none font-outfit">
                  {fmt(minute)}
                </span>
                <span
                  className={`text-4xl font-black leading-none mb-1 transition-colors ${isRunning ? "text-emerald-400 animate-pulse" : "text-slate-700"}`}
                >
                  :
                </span>
                <span className="text-6xl font-black text-white tabular-nums leading-none font-outfit">
                  {fmt(second)}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider font-mono ${
                  isRunning
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`}
                />
                {isRunning ? "Timer Running" : "Timer Stopped"}
              </div>
            </div>

            {/* Start / Pause / Reset */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setIsRunning(true)}
                disabled={isRunning}
                className="py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all font-outfit flex items-center justify-center gap-1.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-emerald-500/15"
              >
                <Play className="w-3.5 h-3.5" /> Start
              </button>
              <button
                type="button"
                onClick={() => setIsRunning(false)}
                disabled={!isRunning}
                className="py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all font-outfit flex items-center justify-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 disabled:opacity-35 disabled:cursor-not-allowed active:scale-95"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
              <button
                type="button"
                onClick={() => {
                  setMinute(0);
                  setSecond(0);
                  setIsRunning(false);
                }}
                className="py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all font-outfit flex items-center justify-center gap-1.5 bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Manual MM:SS Adjust */}
            <div className="grid grid-cols-2 gap-3">
              {/* Minutes */}
              <div className="bg-slate-955 border border-slate-850 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                  Minutes
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMinute((p) => Math.max(0, p - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-black flex items-center justify-center transition active:scale-90"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={minute}
                    onChange={(e) =>
                      setMinute(
                        Math.max(0, Math.min(120, Number(e.target.value))),
                      )
                    }
                    className="flex-grow bg-transparent text-center text-xl font-black font-mono text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMinute((p) => Math.min(120, p + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-black flex items-center justify-center transition active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-slate-955 border border-slate-850 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                  Seconds
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSecond((p) => Math.max(0, p - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-black flex items-center justify-center transition active:scale-90"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={second}
                    onChange={(e) =>
                      setSecond(
                        Math.max(0, Math.min(59, Number(e.target.value))),
                      )
                    }
                    className="flex-grow bg-transparent text-center text-xl font-black font-mono text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSecond((p) => Math.min(59, p + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-black flex items-center justify-center transition active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Added/Injury Time */}
            <div className="bg-slate-955 border border-slate-850 rounded-2xl p-4 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                  Injury Time (Added Minutes)
                </span>
                {addedTime > 0 && (
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-black font-mono px-2 py-0.5 rounded">
                    +{addedTime} MIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddedTime((p) => Math.max(0, p - 1))}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-350 hover:text-white text-sm font-black flex items-center justify-center transition active:scale-90"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={addedTime}
                  onChange={(e) =>
                    setAddedTime(
                      Math.max(0, Math.min(15, Number(e.target.value))),
                    )
                  }
                  className="flex-grow bg-transparent text-center text-xl font-black font-mono text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAddedTime((p) => Math.min(15, p + 1))}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-355 hover:text-white text-sm font-black flex items-center justify-center transition active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* ── Period Selector ── */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
              Match Period
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all font-outfit flex flex-col items-center gap-1 active:scale-95 ${
                    period === p
                      ? getPeriodStyle(p) + " shadow-md"
                      : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-base font-black">{p}</span>
                  <span className="text-[8px] normal-case font-bold opacity-70">
                    {periodLabels[p]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Console Controls ── */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
              Console Controls
            </h3>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Scorebug to Database
            </button>

            {/* Live Toggle */}
            <LiveToggle isLive={isLive} onToggle={handleToggleLive} />

            {/* Auto-Sync Status Indicator */}
            <div
              className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-2 font-mono transition-all ${
                isLive
                  ? "bg-cyan-500/8 text-cyan-400 border-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                  : "bg-slate-900/50 text-slate-600 border-slate-850"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isLive ? "bg-cyan-400 animate-pulse" : "bg-slate-700"}`}
              />
              {isLive
                ? "Live Sync Active — Auto Updating"
                : "Live Sync Inactive"}
            </div>
          </div>

          {/* ── Positioning Offset Controls ── */}
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
