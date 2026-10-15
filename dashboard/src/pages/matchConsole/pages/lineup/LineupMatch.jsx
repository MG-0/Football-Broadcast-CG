import React from "react";
import { Sliders, Save, Trash2, Plus } from "lucide-react";
import useLineup from "./useLineup";

// Import configurations and modular components
import { POSITIONS } from "../../config/layersConfig.js";
import PageHeader from "../../../../components/Header";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";

export default function LineupMatch() {
  const {
    matchData,
    isLive,
    isTacticalLive,
    activeTab,
    setActiveTab,
    homeFormation,
    setHomeFormation,
    awayFormation,
    setAwayFormation,
    homeCoach,
    setHomeCoach,
    awayCoach,
    setAwayCoach,
    lineupAssignments,
    playerName,
    setPlayerName,
    playerNumber,
    setPlayerNumber,
    playerPosition,
    setPlayerPosition,
    handleAddPlayer,
    handleUpdateCoach,
    handleDeletePlayer,
    handleAssignPlayer,
    getHomeStarters,
    getHomeBench,
    getAwayStarters,
    getAwayBench,
    handleSaveLineup,
    handleShowLineup,
    handleShowTacticalLineup,
    toggleOverlay,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
  } = useLineup();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Match Details...
      </div>
    );
  }

  const activePlayers =
    activeTab === "home"
      ? matchData.homeTeam?.players || []
      : matchData.awayTeam?.players || [];
  const activeTeamName =
    activeTab === "home" ? matchData.homeTeam?.name : matchData.awayTeam?.name;

  const starters = activeTab === "home" ? getHomeStarters() : getAwayStarters();
  const bench = activeTab === "home" ? getHomeBench() : getAwayBench();
  const formation = activeTab === "home" ? homeFormation : awayFormation;

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Match Lineups & Formations"
        description="Manage squad rosters, assign starters and bench lists, and configure custom formation layouts."
        Icon={Sliders}
      />

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-grow">
        {/* Left Column: Team Squad Selectors & Inputs */}
        <div className="xl:col-span-7 flex flex-col space-y-5 min-w-0">
          {/* Tab Headers - Spaced and Glowing */}
          <div className="flex bg-[#0c1324]/80 border border-slate-850 p-2 rounded-2xl gap-2 w-full sm:w-fit shadow-md shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("home")}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl text-xs font-black uppercase transition-all tracking-wider font-outfit border ${
                activeTab === "home"
                  ? "bg-slate-900 border-slate-805 text-emerald-400 shadow-md shadow-emerald-500/5"
                  : "text-slate-500 border-transparent hover:text-slate-350"
              }`}
            >
              🏠 {matchData.homeTeam?.name || "Home Team"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("away")}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl text-xs font-black uppercase transition-all tracking-wider font-outfit border ${
                activeTab === "away"
                  ? "bg-slate-900 border-slate-805 text-emerald-400 shadow-md shadow-emerald-500/5"
                  : "text-slate-500 border-transparent hover:text-slate-350"
              }`}
            >
              ✈️ {matchData.awayTeam?.name || "Away Team"}
            </button>
          </div>

          {/* Unified Configuration Panel (Removed flex-grow to flow naturally on mobile) */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl w-full">
            {/* Formation & Coach/Manager inputs row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-955 border border-slate-850/80 p-5 rounded-2xl">
              {/* Formation Column */}
              <FormInput
                label="Formation Style"
                name="formation"
                type="text"
                placeholder="e.g. 4-3-3"
                value={activeTab === "home" ? homeFormation : awayFormation}
                onChange={(e) =>
                  activeTab === "home"
                    ? setHomeFormation(e.target.value)
                    : setAwayFormation(e.target.value)
                }
              />

              {/* Coach/Manager Column */}
              <FormInput
                label="Manager / Coach"
                name="coach"
                type="text"
                placeholder="e.g. Pep Guardiola"
                value={activeTab === "home" ? homeCoach : awayCoach}
                onChange={(e) =>
                  activeTab === "home"
                    ? setHomeCoach(e.target.value)
                    : setAwayCoach(e.target.value)
                }
              />
            </div>

            {/* Players Table listing - Scrollable */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1.5 scrollbar-thin">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 font-mono">
                <span>Player Details</span>
                <span className="mr-24 sm:mr-28">Assignment Toggle</span>
              </div>

              <div className="space-y-2.5">
                {activePlayers.length > 0 ? (
                  activePlayers.map((player) => {
                    const assignment = lineupAssignments[player.id] || "none";

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                          assignment === "starter"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-slate-200"
                            : assignment === "bench"
                              ? "bg-amber-500/5 border-amber-500/20 text-slate-200"
                              : "bg-slate-955 border-slate-850 text-slate-500 hover:border-slate-800"
                        }`}
                      >
                        {/* Name and Shirt Number */}
                        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => handleDeletePlayer(player.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-rose-500 border border-slate-855 hover:border-rose-500/20 flex items-center justify-center transition-all shrink-0 active:scale-90"
                            title="Delete Player"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-emerald-400 shrink-0 shadow-inner">
                            {player.number}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-bold truncate text-slate-200 font-outfit uppercase tracking-wide">
                              {player.name}
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-bold font-mono text-slate-500 uppercase tracking-wider">
                              {player.position}
                            </span>
                          </div>
                        </div>

                        {/* Selector Controls - Responsive segmented button group */}
                        <div className="flex items-center bg-slate-950 border border-slate-850/80 rounded-xl p-0.5 sm:p-1 gap-0.5 sm:gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleAssignPlayer(player.id, "starter")
                            }
                            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase transition-all duration-150 tracking-wider font-outfit cursor-pointer ${
                              assignment === "starter"
                                ? "bg-emerald-500 text-slate-950 shadow shadow-emerald-500/20"
                                : "text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            S
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAssignPlayer(player.id, "bench")
                            }
                            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase transition-all duration-150 tracking-wider font-outfit cursor-pointer ${
                              assignment === "bench"
                                ? "bg-amber-500 text-slate-950 shadow shadow-amber-500/20"
                                : "text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAssignPlayer(player.id, "none")
                            }
                            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase transition-all duration-150 tracking-wider font-outfit cursor-pointer ${
                              assignment === "none"
                                ? "bg-slate-800 text-slate-400 border border-slate-700/50"
                                : "text-slate-650 hover:text-slate-400"
                            }`}
                          >
                            O
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-3xl">
                    No players registered in {activeTeamName} roster yet. Add
                    players below.
                  </div>
                )}
              </div>
            </div>

            {/* Prominent Save Lineup Button */}
            <button
              type="button"
              onClick={handleSaveLineup}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Lineup to Database
            </button>

            {/* Unified Form to Add Player */}
            <form
              onSubmit={handleAddPlayer}
              className="bg-slate-955 border border-slate-850 p-5 rounded-2xl space-y-4"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono border-b border-slate-900/40 pb-2">
                Add Player to {activeTeamName}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <FormInput
                    label="Player Name"
                    name="playerName"
                    type="text"
                    placeholder="e.g. Lionel Messi"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormInput
                    label="Shirt No."
                    name="playerNumber"
                    type="number"
                    min="1"
                    max="99"
                    value={playerNumber}
                    placeholder="10"
                    onChange={(e) => setPlayerNumber(e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <FormSelect
                    label="Position"
                    name="playerPosition"
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value)}
                    options={POSITIONS}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-2xl py-4 md:col-span-2 transition uppercase tracking-widest w-full flex items-center justify-center gap-1.5 font-outfit cursor-pointer active:scale-95 shadow-md shadow-emerald-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Preview and Broadcast Actions */}
        <div className="xl:col-span-5 flex flex-col space-y-6 min-w-0">
          {/* Live Preview Monitor */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
              Broadcast Graphics Preview
            </h3>

            <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-end p-4">
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-mono font-bold text-emerald-450 uppercase z-10">
                1080p Stream Output
              </div>

              {/* Team Lineup Graphic Simulation - Scaled down for mobile */}
              <div
                className="relative w-full origin-bottom bg-[#050915]/95 border border-slate-800/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3.5 text-left font-inter"
                style={{
                  transform: `scale(${scale || 1}) translate(${xOffset / 5}px, ${-yOffset / 5}px)`,
                }}
              >
                {/* Header (Team Logo & Name) */}
                <div className="flex justify-between items-center border-b border-slate-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🛡️</span>
                    <span className="text-xs font-black text-slate-100 uppercase tracking-wider font-outfit">
                      {activeTeamName}
                    </span>
                  </div>
                  <span className="text-[9px] font-black font-mono text-emerald-400 tracking-wider">
                    FORMATION: {formation}
                  </span>
                </div>

                {/* Starters list inside preview */}
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 max-h-[100px] overflow-y-auto pr-1">
                  {starters.slice(0, 11).map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-2 text-[9px] font-bold text-slate-300 font-mono"
                    >
                      <span className="text-emerald-400 font-black w-4 text-right">
                        {player.number}
                      </span>
                      <span className="truncate uppercase">{player.name}</span>
                      <span className="text-[7px] text-slate-500 font-black uppercase ml-auto">
                        {player.position}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Substitutes row at bottom */}
                <div className="border-t border-slate-900/60 pt-2 flex flex-wrap gap-x-2.5 gap-y-1 items-center max-h-[35px] overflow-y-auto">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mr-1 font-mono">
                    Subs:
                  </span>
                  {bench.map((player) => (
                    <span
                      key={player.id}
                      className="text-[9px] text-slate-400 font-bold uppercase font-outfit"
                    >
                      {player.name} ({player.number})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Console Action Control Panel - Replaced with LiveToggle Components */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Console Controls
            </h3>

            <div className="bg-[#0b1021]/80 border border-slate-800/80 rounded-3xl p-6 space-y-6 shadow-xl">
              {/* Classic List Live Toggle */}
              <div className="space-y-2.5">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider font-outfit block">
                  Classic List Overlay Bumper
                </span>
                <LiveToggle
                  isLive={isLive}
                  onToggle={
                    isLive
                      ? () => toggleOverlay("lineup", false)
                      : handleShowLineup
                  }
                />
              </div>

              {/* Tactical Pitch Live Toggle */}
              <div className="space-y-2.5 border-t border-slate-850 pt-5">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider font-outfit block">
                  Tactical Pitch Overlay Bumper
                </span>
                <LiveToggle
                  isLive={isTacticalLive}
                  onToggle={
                    isTacticalLive
                      ? () => toggleOverlay("tacticalLineup", false)
                      : handleShowTacticalLineup
                  }
                />
              </div>

              {/* Squad Verification Status Panel */}
              <div className="p-4.5 bg-slate-900/50 border border-slate-850 rounded-2xl">
                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  ✅ <strong>Squad Validation:</strong> Home Starters:{" "}
                  <code>{getHomeStarters().length}/11</code> | Away Starters:{" "}
                  <code>{getAwayStarters().length}/11</code>
                </p>
              </div>

              {/* Positioning Offset & Scale Controls */}
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
      </div>
    </div>
  );
}
