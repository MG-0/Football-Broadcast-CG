import React from "react";
import { Award, Save, Upload, RefreshCw } from "lucide-react";
import usePlayerSpotlight from "./usePlayerSpotlight";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";
import FormInput from "../../../../components/FormInput";

export default function PlayerSpotlightMatch() {
  const {
    isLive,
    form,
    setForm,
    imageFile,
    setImageFile,
    previewUrl,
    handleChange,
    homeTeam,
    awayTeam,
    getTeamPlayers,
    handlePlayerChange,
    handleSave,
    handleToggleLive,
    currentPayload,
  } = usePlayerSpotlight();

  const logoUrl = (img) =>
    img ? `/uploads/misc/${img}` : null;

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Player Spotlight Card"
        description="Showcase outstanding player performances, player stats cards, or premium UCL-style 3D player spotlight profiles live on air."
        Icon={Award}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        {/* Left Column: Preview and controls */}
        <div className="space-y-4 flex flex-col">
          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          {/* Simulated Broadcast Output */}
          <div className="w-full flex-grow rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 min-h-[360px]">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none" />
            <div className="absolute top-4 left-4 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-cyan-450 uppercase z-10">
              1080p Stream Output
            </div>

            {/* Broadcast Card Preview container (16:9 box simulation) */}
            <div className="relative w-full aspect-video border border-slate-850 rounded-2xl bg-[#05070c] overflow-hidden flex items-center justify-center shadow-inner z-10">
              {/* Overlay Mock Card Positioned dynamically with offsets */}
              <div
                className="absolute flex items-end select-none"
                style={{
                  transform: `translate(${form.xOffset / 5}px, ${-form.yOffset / 5}px) scale(${form.scale || 1})`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                {/* Simulated UCL style spotlight Card */}
                <div className="relative w-64 bg-slate-950/85 border border-slate-855 rounded-3xl p-4 backdrop-blur shadow-2xl flex flex-col overflow-visible">
                  {/* Glowing dynamic background accent */}
                  <div
                    className="absolute -inset-px rounded-3xl opacity-15 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${form.team === "home" ? homeTeam.primaryColor : awayTeam.primaryColor}, transparent 60%)`,
                    }}
                  />

                  {/* Header: Logo, shortname, position */}
                  <div className="flex justify-between items-start mb-2.5 relative z-10">
                    <div className="flex items-center gap-2">
                      {logoUrl(
                        form.team === "home"
                          ? homeTeam.imageUrl
                          : awayTeam.imageUrl,
                      ) && (
                        <img
                          src={logoUrl(
                            form.team === "home"
                              ? homeTeam.imageUrl
                              : awayTeam.imageUrl,
                          )}
                          className="h-5 w-5 object-contain"
                          alt="Team Logo"
                        />
                      )}
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-outfit">
                        {form.team === "home"
                          ? homeTeam.shortName || "HOME"
                          : awayTeam.shortName || "AWAY"}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest text-slate-100 font-mono"
                      style={{
                        backgroundColor:
                          form.team === "home"
                            ? homeTeam.primaryColor
                            : awayTeam.primaryColor,
                      }}
                    >
                      {form.position}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="relative z-10 mt-1">
                    <h4 className="text-sm font-black text-slate-100 uppercase tracking-wide truncate w-[60%] font-outfit">
                      {form.playerName || "SELECT PLAYER"}
                    </h4>
                  </div>

                  {/* Stat Grid */}
                  <div className="grid grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-slate-900 relative z-10 font-outfit">
                    <div className="text-center">
                      <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                        Rating
                      </p>
                      <p className="text-xs font-black text-cyan-400 mt-0.5">
                        {form.rating}
                      </p>
                    </div>
                    {form.role === "goalkeeper" ? (
                      <>
                        <div className="text-center">
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                            Saves
                          </p>
                          <p className="text-xs font-black text-slate-200 mt-0.5">
                            {form.saves}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                            Conceded
                          </p>
                          <p className="text-xs font-black text-slate-200 mt-0.5">
                            {form.conceded}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                            Save %
                          </p>
                          <p className="text-xs font-black text-slate-200 mt-0.5">
                            {form.savePercentage}%
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                            Goals
                          </p>
                          <p className="text-xs font-black text-slate-200 mt-0.5">
                            {form.goals}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                            Assists
                          </p>
                          <p className="text-xs font-black text-slate-200 mt-0.5">
                            {form.assists}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                            Shots
                          </p>
                          <p className="text-xs font-black text-slate-200 mt-0.5">
                            {form.shots}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Overlapping player cutout image */}
                  <div className="absolute -top-11 right-4 w-24 h-28 pointer-events-none overflow-visible flex items-end">
                    <img
                      src={
                        currentPayload.playerImgUrl ||
                        "https://i.postimg.cc/kX4yXW1b/player-cutout-placeholder.png"
                      }
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] transform scale-105 origin-bottom transition-transform"
                      alt="Player cutout"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-4">
              16:9 Broadcast viewport mockup (offsets scaled by 5 for preview)
            </p>
          </div>

          {/* Live Toggle */}
          <LiveToggle isLive={isLive} onToggle={handleToggleLive} />
        </div>

        {/* Right Column: Configuration Form */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Spotlight Configuration
          </h3>

          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl flex flex-col space-y-5">
            {/* Selection row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team Selector Switch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                  Team
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange("team", "home");
                      handleChange("playerId", "");
                      handleChange("playerName", "");
                    }}
                    className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                      form.team === "home"
                        ? "bg-violet-600/10 border-violet-500 text-violet-400 shadow"
                        : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    🏠 Home
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange("team", "away");
                      handleChange("playerId", "");
                      handleChange("playerName", "");
                    }}
                    className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                      form.team === "away"
                        ? "bg-violet-600/10 border-violet-500 text-violet-400 shadow"
                        : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    ✈ Away
                  </button>
                </div>
              </div>

              {/* Player Dropdown selector and Role Toggle */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                    Choose Player
                  </label>
                  <select
                    value={form.playerId}
                    onChange={(e) => handlePlayerChange(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-850 focus:border-violet-500/50 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-200 outline-none focus:ring-1 focus:ring-violet-500/20 transition cursor-pointer appearance-none uppercase"
                  >
                    <option value="" className="bg-[#0b1021] text-slate-500">
                      -- Choose Player --
                    </option>
                    {getTeamPlayers(form.team).map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        className="bg-[#0b1021] text-slate-200"
                      >
                        #{p.number} - {p.name} ({p.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Player Role / Stat Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("role", "outfield")}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.role !== "goalkeeper"
                          ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow"
                          : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Outfield
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("role", "goalkeeper")}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.role === "goalkeeper"
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow"
                          : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Goalkeeper
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Cutout image field */}
            <div className="space-y-3 bg-[#070b16] border border-slate-850 rounded-2xl p-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest block font-mono">
                  Transparent Cutout PNG (500x500 px)
                </label>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-2xl text-xs font-black uppercase tracking-wider font-outfit transition duration-150 active:scale-95 cursor-pointer">
                    <Upload className="w-4 h-4 text-violet-400" />
                    Browse Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {imageFile && (
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-emerald-400 font-bold truncate">
                        ✓ Selected: {imageFile.name}
                      </p>
                      <p className="text-[8px] text-slate-500 font-mono mt-0.5">
                        ({Math.round(imageFile.size / 1024)} KB) - Click Save to
                        Upload
                      </p>
                    </div>
                  )}

                  {form.playerImgUrl && !imageFile && (
                    <p className="text-[9px] text-slate-500 truncate flex-1 font-mono">
                      DB Link: {form.playerImgUrl.split("/").pop()}
                    </p>
                  )}
                </div>
              </div>

              {/* Reset to silhouette button */}
              <div className="flex justify-end pt-2 border-t border-slate-900/60">
                <button
                  type="button"
                  onClick={() => {
                    handleChange(
                      "playerImgUrl",
                      "https://i.postimg.cc/kX4yXW1b/player-cutout-placeholder.png",
                    );
                    setImageFile(null);
                  }}
                  className="flex items-center gap-1 text-[9px] font-bold text-slate-500 hover:text-slate-350 uppercase tracking-widest transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset to Silhouette
                </button>
              </div>
            </div>

            {/* Stat values input row */}
            <div className="grid grid-cols-5 gap-2.5">
              <FormInput
                label="POS"
                name="position"
                type="text"
                value={form.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className="text-center font-mono"
              />
              <FormInput
                label="Rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.rating}
                onChange={(e) =>
                  handleChange("rating", parseFloat(e.target.value) || 0)
                }
                className="text-center font-mono"
              />
              {form.role === "goalkeeper" ? (
                <>
                  <FormInput
                    label="Saves"
                    name="saves"
                    type="number"
                    min="0"
                    value={form.saves}
                    onChange={(e) =>
                      handleChange("saves", parseInt(e.target.value) || 0)
                    }
                    className="text-center font-mono"
                  />
                  <FormInput
                    label="Conceded"
                    name="conceded"
                    type="number"
                    min="0"
                    value={form.conceded}
                    onChange={(e) =>
                      handleChange("conceded", parseInt(e.target.value) || 0)
                    }
                    className="text-center font-mono"
                  />
                  <FormInput
                    label="Save %"
                    name="savePercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={form.savePercentage}
                    onChange={(e) =>
                      handleChange(
                        "savePercentage",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="text-center font-mono"
                  />
                </>
              ) : (
                <>
                  <FormInput
                    label="Goals"
                    name="goals"
                    type="number"
                    min="0"
                    value={form.goals}
                    onChange={(e) =>
                      handleChange("goals", parseInt(e.target.value) || 0)
                    }
                    className="text-center font-mono"
                  />
                  <FormInput
                    label="Assists"
                    name="assists"
                    type="number"
                    min="0"
                    value={form.assists}
                    onChange={(e) =>
                      handleChange("assists", parseInt(e.target.value) || 0)
                    }
                    className="text-center font-mono"
                  />
                  <FormInput
                    label="Shots"
                    name="shots"
                    type="number"
                    min="0"
                    value={form.shots}
                    onChange={(e) =>
                      handleChange("shots", parseInt(e.target.value) || 0)
                    }
                    className="text-center font-mono"
                  />
                </>
              )}
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Player Spotlight to Database
            </button>
          </div>

          {/* Positioning Offset Controls */}
          <LayoutControls
            xOffset={form.xOffset || 0}
            setXOffset={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.xOffset || 0)
                    : updater;

                return { ...prev, xOffset: nextVal };
              });
            }}
            yOffset={form.yOffset || 0}
            setYOffset={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.yOffset || 0)
                    : updater;

                return { ...prev, yOffset: nextVal };
              });
            }}
            scale={form.scale || 1}
            setScale={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.scale || 1)
                    : updater;

                return { ...prev, scale: nextVal };
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
