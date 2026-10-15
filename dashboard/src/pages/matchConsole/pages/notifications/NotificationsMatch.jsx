import React from "react";
import {
  Bell,
  Save,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import useNotifications from "./useNotifications";

import { TABS_NOTIFICATIONS } from "../../config/layersConfig";
import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";
import FormInput from "../../../../components/FormInput";

export default function NotificationsMatch() {
  const {
    isLive,
    form,
    setForm,
    activeTab,
    setActiveTab,
    activeShotStatus,
    setActiveShotStatus,
    handleChange,
    handleGoalClick,
    clearShots,
    homeTeam,
    awayTeam,
    getSubPlayers,
    getCardPlayers,
    handleSave,
    handleToggleLive,
    currentPayload,
  } = useNotifications();

  // Load team players lists
  const subPlayers = getSubPlayers(form.subTeam);
  const cardPlayers = getCardPlayers(form.cardTeam);
  const offsidePlayers = getCardPlayers(form.offsideTeam);

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Event Alerts & Notifications"
        description="Trigger live broadcast bumpers for key match events like substitutions, yellow/red cards, VAR reviews, offsides, and penalty shootouts."
        Icon={Bell}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow ml-4">
        {/* Left Column: Preview and controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          {/* Simulated Broadcast Output */}
          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-end p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none" />
            <div className="absolute top-4 left-4 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-rose-450 uppercase z-10">
              1080p Stream Output
            </div>

            {/* Notification Card Mockup positioned dynamically */}
            <div
              className="w-full flex justify-center z-10 transition-all duration-75"
              style={{
                bottom: `${(form.yOffset || 50) / 7}px`,
                left: `${(form.xOffset || 0) / 7}px`,
                position: "relative",
                transform: `scale(${form.scale || 1})`,
              }}
            >
              {/* Substitution Preview */}
              {activeTab === "substitution" &&
                currentPayload.substitution?.playerOut && (
                  <div className="bg-slate-955 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[85%] text-xs font-bold text-slate-200">
                    <div className="bg-slate-900/60 px-4 py-2 flex justify-between items-center border-b border-slate-855">
                      <span className="text-[9px] text-emerald-400 font-mono font-black uppercase tracking-wider">
                        Substitution
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">
                        {currentPayload.substitution.teamName}
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded-xl font-outfit">
                        <span className="text-[10px] font-mono font-black">
                          {currentPayload.substitution.playerOut.number}
                        </span>
                        <span className="truncate flex-1 px-3 text-slate-100 uppercase tracking-wide">
                          {currentPayload.substitution.playerOut.name}
                        </span>
                        <span className="text-[9px] font-mono font-black">
                          ▼ OUT
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl font-outfit">
                        <span className="text-[10px] font-mono font-black">
                          {currentPayload.substitution.playerIn.number}
                        </span>
                        <span className="truncate flex-1 px-3 text-slate-100 uppercase tracking-wide">
                          {currentPayload.substitution.playerIn.name}
                        </span>
                        <span className="text-[9px] font-mono font-black">
                          ▲ IN
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {/* Booking Card Preview */}
              {activeTab === "card" && currentPayload.card?.player && (
                <div className="bg-slate-955 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden flex items-center gap-4 p-4 w-[85%] text-xs font-bold text-slate-200">
                  <div
                    className={`w-9 h-12 rounded-lg shrink-0 shadow-lg border border-white/10 ${
                      currentPayload.card.cardType === "yellow"
                        ? "bg-amber-400"
                        : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0 font-outfit">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-mono font-black mb-0.5">
                      {currentPayload.card.cardType === "yellow"
                        ? "Yellow Card"
                        : "Red Card"}
                    </p>
                    <p className="text-sm font-black text-slate-100 uppercase tracking-wide truncate">
                      {currentPayload.card.player.name}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5 font-mono">
                      {currentPayload.card.teamName}
                    </p>
                  </div>
                </div>
              )}

              {/* VAR Check Preview */}
              {activeTab === "var" && (
                <div className="bg-slate-955 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-4 w-[85%] text-center border-l-4 border-l-violet-500 font-outfit">
                  <span className="text-[9px] font-black text-violet-400 tracking-widest bg-violet-500/10 border border-violet-500/25 px-3 py-0.5 rounded-lg font-mono">
                    {form.varTitle || "VAR CHECK"}
                  </span>
                  <p className="text-sm font-black text-slate-100 uppercase mt-2 tracking-widest leading-snug">
                    {form.varDetail || "CHECKING EVENT"}
                  </p>
                </div>
              )}

              {/* Offside Preview */}
              {activeTab === "offside" && (
                <div className="bg-slate-955 border border-slate-855 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-4 w-[85%] text-center border-l-4 border-l-cyan-500 font-outfit">
                  <span className="text-[9px] font-black text-cyan-400 tracking-widest bg-cyan-500/10 border border-cyan-500/25 px-3 py-0.5 rounded-lg font-mono">
                    ⚑ OFFSIDE
                  </span>
                  <p className="text-sm font-black text-slate-100 uppercase mt-2 tracking-wide truncate w-full">
                    {(() => {
                      const p = getCardPlayers(form.offsideTeam).find(
                        (p) => p.id === form.offsidePlayerId,
                      );

                      return p ? p.name : "SELECT PLAYER";
                    })()}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase font-mono mt-0.5 tracking-wider">
                    {currentPayload.offside?.teamName}
                  </p>
                </div>
              )}

              {/* Penalty Shootout Preview */}
              {activeTab === "penalty" && (
                <div className="bg-slate-955 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden flex items-center gap-4 p-4 w-[95%] text-left border-l-4 border-l-amber-500 font-outfit">
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black text-amber-400 tracking-widest bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg uppercase font-mono block w-max">
                      {currentPayload.penalty?.text || "PENALTY KICK"}
                    </span>
                    <p className="text-sm font-black text-slate-100 mt-1.5 truncate uppercase tracking-wide">
                      {form.penaltyPlayerName || "PLAYER NAME"}
                    </p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5 font-mono">
                      {currentPayload.penalty?.teamName}
                    </p>
                  </div>

                  {/* Goal Net Mock */}
                  <div className="relative w-24 h-14 bg-[#050915] border border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-inner">
                    {/* Goal frame */}
                    <div className="absolute top-1.5 left-2 right-2 bottom-0 border-t border-x border-slate-600/50 z-10" />
                    {/* Shots */}
                    {(form.penaltyShots || []).map((s, idx) => (
                      <span
                        key={idx}
                        className={`absolute w-2 h-2 rounded-full border border-white z-20 shadow-md ${
                          s.status === "goal"
                            ? "bg-emerald-500 shadow-emerald-500/35"
                            : "bg-red-500 shadow-red-500/35"
                        }`}
                        style={{
                          left: `${s.x}%`,
                          top: `${s.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Profile Preview */}
              {activeTab === "custom" && (
                <div
                  className="bg-slate-955 border rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[85%] text-xs font-bold text-slate-200 transition-all border-l-4 font-outfit"
                  style={{
                    borderColor: `${form.customTeam === "home" ? homeTeam?.primaryColor || "#f59e0b" : awayTeam?.primaryColor || "#f59e0b"}40`,
                    borderLeftColor:
                      form.customTeam === "home"
                        ? homeTeam?.primaryColor || "#f59e0b"
                        : awayTeam?.primaryColor || "#f59e0b",
                  }}
                >
                  <div className="bg-slate-900/60 px-4 py-2 flex justify-between items-center border-b border-slate-855">
                    <span
                      className="text-[8px] font-mono font-black uppercase tracking-wider bg-slate-955 border px-2 py-0.5 rounded-lg"
                      style={{
                        color:
                          form.customTeam === "home"
                            ? homeTeam?.primaryColor || "#f59e0b"
                            : awayTeam?.primaryColor || "#f59e0b",
                        borderColor: `${form.customTeam === "home" ? homeTeam?.primaryColor || "#f59e0b" : awayTeam?.primaryColor || "#f59e0b"}25`,
                      }}
                    >
                      {form.customBadgeTitle || "PLAYER PROFILE"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">
                      {form.customTeam === "home"
                        ? homeTeam?.name
                        : awayTeam?.name}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-1 text-left">
                    <h4 className="text-sm font-black uppercase text-slate-100 font-outfit">
                      {form.customPlayerName || "PLAYER NAME"}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400 font-inter">
                      {form.customText || "Scored 9 goals in 3 matches"}
                    </p>
                  </div>
                </div>
              )}

              {/* Hydration Break Preview */}
              {activeTab === "hydration" && (
                <div className="bg-slate-955 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-between p-4 w-[90%] text-left border-l-4 border-l-cyan-500 font-outfit">
                  <div className="flex-1 min-w-0 pr-3">
                    <span className="text-[8px] font-black text-cyan-400 tracking-widest bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-lg uppercase font-mono inline-flex items-center gap-1.5">
                      <span>💧</span> {form.hydrationBadgeTitle || "HYDRATION BREAK"}
                    </span>
                    <p className="text-sm font-black text-slate-100 mt-2 truncate uppercase tracking-wide">
                      {form.hydrationTitle || "OFFICIAL COOLING BREAK"}
                    </p>
                    <p className="text-[9px] font-medium text-cyan-200/80 uppercase tracking-wider mt-0.5 font-inter">
                      {form.hydrationDetail?.trim() ||
                        `TEMPERATURE ${form.hydrationTemp || "32°C"} • ${form.hydrationMinute || "30'"} MINUTE`}
                    </p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-3 py-2 shrink-0 text-center shadow-inner">
                    <span className="text-xs font-black text-cyan-400 font-outfit">
                      {form.hydrationTemp || "32°C"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Toggle */}
          <LiveToggle isLive={isLive} onToggle={handleToggleLive} />
        </div>

        {/* Right Column: Settings & Forms (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Tab Selector Switches */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#0b1021]/80 border border-slate-850 rounded-2xl">
            {TABS_NOTIFICATIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-outfit transition duration-150 active:scale-95 cursor-pointer ${
                  activeTab === id
                    ? "bg-[#11182c] border border-slate-800 text-slate-100 shadow"
                    : "text-slate-500 hover:text-slate-355"
                }`}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>

          {/* Configuration Form Card */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl flex flex-col space-y-6 flex-grow">
            {/* SUB TAB: Substitution Settings */}
            {activeTab === "substitution" && (
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  Substitution Settings
                </h4>

                {/* Team Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Team
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("subTeam", "home")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.subTeam === "home"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      🏠 {homeTeam.name || "Home Team"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("subTeam", "away")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.subTeam === "away"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      ✈ {awayTeam.name || "Away Team"}
                    </button>
                  </div>
                </div>

                {/* Player Selects grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Player Out (Starters list) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                      Player OUT (Starters)
                    </label>
                    <select
                      value={form.subPlayerOutId}
                      onChange={(e) =>
                        handleChange("subPlayerOutId", e.target.value)
                      }
                      className="w-full bg-slate-955 border border-slate-850 focus:border-violet-500/50 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-200 outline-none focus:ring-1 focus:ring-violet-500/20 transition cursor-pointer appearance-none uppercase"
                    >
                      <option value="" className="bg-[#0b1021] text-slate-500">
                        -- SELECT PLAYER OUT --
                      </option>
                      {subPlayers.starters.map((p) => (
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

                  {/* Player In (Bench list) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                      Player IN (Bench)
                    </label>
                    <select
                      value={form.subPlayerInId}
                      onChange={(e) =>
                        handleChange("subPlayerInId", e.target.value)
                      }
                      className="w-full bg-slate-955 border border-slate-850 focus:border-violet-500/50 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-200 outline-none focus:ring-1 focus:ring-violet-500/20 transition cursor-pointer appearance-none uppercase"
                    >
                      <option value="" className="bg-[#0b1021] text-slate-500">
                        -- SELECT PLAYER IN --
                      </option>
                      {subPlayers.bench.map((p) => (
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
                </div>
              </div>
            )}

            {/* SUB TAB: Booking Card Settings */}
            {activeTab === "card" && (
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  Card Booking Settings
                </h4>

                {/* Team Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Team
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("cardTeam", "home")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.cardTeam === "home"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      🏠 {homeTeam.name || "Home Team"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("cardTeam", "away")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.cardTeam === "away"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      ✈ {awayTeam.name || "Away Team"}
                    </button>
                  </div>
                </div>

                {/* Player Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                    Select Booked Player
                  </label>
                  <select
                    value={form.cardPlayerId}
                    onChange={(e) =>
                      handleChange("cardPlayerId", e.target.value)
                    }
                    className="w-full bg-slate-955 border border-slate-850 focus:border-violet-500/50 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-200 outline-none focus:ring-1 focus:ring-violet-500/20 transition cursor-pointer appearance-none uppercase"
                  >
                    <option value="" className="bg-[#0b1021] text-slate-500">
                      -- SELECT SQUAD PLAYER --
                    </option>
                    {cardPlayers.map((p) => (
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

                {/* Card Type Toggle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Card Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("cardType", "yellow")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.cardType === "yellow"
                          ? "bg-amber-400 text-slate-950 border-amber-500 shadow-md shadow-amber-500/10"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      🟨 Yellow Card
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("cardType", "red")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.cardType === "red"
                          ? "bg-red-500 text-slate-955 border-red-600 shadow-md shadow-red-500/10"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      🟥 Red Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB TAB: VAR Check Settings */}
            {activeTab === "var" && (
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  VAR Check Settings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="VAR Bumper Title"
                    name="varTitle"
                    type="text"
                    placeholder="e.g. VAR CHECK"
                    value={form.varTitle}
                    onChange={(e) => handleChange("varTitle", e.target.value)}
                  />
                  <FormInput
                    label="VAR Detailed Check Description"
                    name="varDetail"
                    type="text"
                    placeholder="e.g. POSSIBLE PENALTY"
                    value={form.varDetail}
                    onChange={(e) => handleChange("varDetail", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* SUB TAB: Offside Settings */}
            {activeTab === "offside" && (
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  Offside Settings
                </h4>

                {/* Team Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Offending Team
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("offsideTeam", "home")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.offsideTeam === "home"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      🏠 {homeTeam.name || "Home Team"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("offsideTeam", "away")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.offsideTeam === "away"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      ✈ {awayTeam.name || "Away Team"}
                    </button>
                  </div>
                </div>

                {/* Player Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                    Offside Player
                  </label>
                  <select
                    value={form.offsidePlayerId}
                    onChange={(e) =>
                      handleChange("offsidePlayerId", e.target.value)
                    }
                    className="w-full bg-slate-955 border border-slate-850 focus:border-violet-500/50 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-200 outline-none focus:ring-1 focus:ring-violet-500/20 transition cursor-pointer appearance-none uppercase"
                  >
                    <option value="" className="bg-[#0b1021] text-slate-500">
                      -- SELECT SQUAD PLAYER --
                    </option>
                    {offsidePlayers.map((p) => (
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
              </div>
            )}

            {/* SUB TAB: Penalty Shootout Settings */}
            {activeTab === "penalty" && (
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  Penalty Kick Settings
                </h4>

                {/* Team Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Shooting Team
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("penaltyTeam", "home")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.penaltyTeam === "home"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      🏠 {homeTeam.name || "Home Team"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("penaltyTeam", "away")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.penaltyTeam === "away"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      ✈ {awayTeam.name || "Away Team"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Kick Display Title"
                    name="penaltyText"
                    type="text"
                    placeholder="e.g. PENALTY KICK"
                    value={form.penaltyText}
                    onChange={(e) =>
                      handleChange("penaltyText", e.target.value)
                    }
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                      Taker Player Name
                    </label>
                    <select
                      value={form.penaltyPlayerName}
                      onChange={(e) =>
                        handleChange("penaltyPlayerName", e.target.value)
                      }
                      className="w-full bg-slate-955 border border-slate-850 focus:border-violet-500/50 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-200 outline-none focus:ring-1 focus:ring-violet-500/20 transition cursor-pointer appearance-none uppercase"
                    >
                      <option value="" className="bg-[#0b1021] text-slate-500">
                        -- SELECT PLAYER --
                      </option>
                      {getCardPlayers(form.penaltyTeam).map((p) => (
                        <option
                          key={p.id}
                          value={p.name}
                          className="bg-[#0b1021] text-slate-200"
                        >
                          #{p.number} - {p.name} ({p.position})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interactive net clicker */}
                <div className="border-t border-slate-900/60 pt-5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black text-slate-455 uppercase tracking-widest block font-mono">
                        Penalty Shot Board
                      </span>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        Click inside the goal net below to place shot records
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearShots}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 hover:border-rose-500/25 rounded-xl text-[10px] font-black uppercase tracking-widest font-outfit transition duration-150 active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear Board
                    </button>
                  </div>

                  {/* Goal Net interactive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Goal SVG grid (8 cols) */}
                    <div className="sm:col-span-8">
                      <div
                        onClick={handleGoalClick}
                        className="relative w-full h-32 sm:h-36 bg-[#03060f] border-2 border-slate-700/80 rounded-2xl cursor-crosshair overflow-hidden shadow-inner group hover:border-slate-500/50 transition-colors"
                      >
                        {/* Goal inner lines grid net mockup */}
                        <div className="absolute inset-x-3 top-3 bottom-0 border-t border-x border-dashed border-slate-800/80 z-0" />
                        <div className="absolute inset-x-6 top-6 bottom-0 border-t border-x border-slate-800/30 z-0" />
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-25 z-0" />

                        {/* Placed shot pins */}
                        {(form.penaltyShots || []).map((s, idx) => (
                          <span
                            key={idx}
                            className={`absolute w-3 h-3 rounded-full border border-white z-20 flex items-center justify-center text-[7px] font-bold shadow-lg ${
                              s.status === "goal"
                                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30"
                                : "bg-red-500 text-slate-100 shadow-red-500/30"
                            }`}
                            style={{
                              left: `${s.x}%`,
                              top: `${s.y}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {s.status === "goal" ? "⚽" : "✕"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Shot Status Selector (4 cols) */}
                    <div className="sm:col-span-4 flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                        Shot Result
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveShotStatus("goal")}
                        className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                          activeShotStatus === "goal"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10"
                            : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        ⚽ Mark as Goal
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveShotStatus("miss")}
                        className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                          activeShotStatus === "miss"
                            ? "bg-red-500/10 border-red-500 text-red-400 shadow-md shadow-red-500/10"
                            : "bg-slate-955 border-slate-855 text-slate-500 hover:text-slate-355"
                        }`}
                      >
                        ❌ Mark as Missed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* SUB TAB: Custom Profile Notification Settings */}
            {activeTab === "custom" && (
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  Custom Profile Notification Settings
                </h4>

                {/* Team Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Select Player Team
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("customTeam", "home")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.customTeam === "home"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      🏠 {homeTeam.name || "Home Team"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("customTeam", "away")}
                      className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all font-outfit active:scale-95 ${
                        form.customTeam === "away"
                          ? "bg-violet-600/10 border-violet-500 text-violet-400"
                          : "bg-slate-955 border-slate-850 text-slate-500"
                      }`}
                    >
                      ✈ {awayTeam.name || "Away Team"}
                    </button>
                  </div>
                </div>

                {/* Badge Title Input */}
                <FormInput
                  label="Badge Header Title"
                  type="text"
                  placeholder="e.g. PLAYER PROFILE"
                  value={form.customBadgeTitle || ""}
                  onChange={(e) =>
                    handleChange("customBadgeTitle", e.target.value)
                  }
                />

                {/* Player Name Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest font-mono">
                    Select Player
                  </label>
                  <select
                    value={form.customPlayerName || ""}
                    onChange={(e) =>
                      handleChange("customPlayerName", e.target.value)
                    }
                    className="w-full bg-slate-955 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-200 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-outfit appearance-none"
                  >
                    <option value="" disabled>
                      -- Select a player --
                    </option>
                    {(form.customTeam === "away"
                      ? awayTeam.players
                      : homeTeam.players
                    )?.map((player, idx) => (
                      <option key={idx} value={player.name}>
                        {player.number} - {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Text Input */}
                <FormInput
                  label="Custom Notification Details Text"
                  type="text"
                  placeholder="e.g. Scored 9 goals in 3 matches"
                  value={form.customText || ""}
                  onChange={(e) => handleChange("customText", e.target.value)}
                />
              </div>
            )}

            {/* SUB TAB: Hydration Break Settings */}
            {activeTab === "hydration" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit flex items-center gap-2">
                    <span className="text-cyan-400">💧</span> World Cup Hydration / Cooling Break
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-cyan-400/90 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-lg">
                    Dynamic Timing
                  </span>
                </div>

                {/* Match Minute Input & Quick Chips */}
                <div className="space-y-2 bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <span className="text-cyan-400">⏱️</span> Match Minute
                    </label>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Type any minute or pick a quick preset
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        placeholder="e.g. 30' or 33' or 75'"
                        value={form.hydrationMinute || ""}
                        onChange={(e) =>
                          handleChange("hydrationMinute", e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-2.5 text-sm font-black text-cyan-300 placeholder:text-slate-600 outline-none transition font-outfit"
                      />
                    </div>
                    <div className="sm:col-span-6 flex flex-wrap gap-1.5">
                      {["25'", "30'", "35'", "70'", "75'", "105'"].map(
                        (min) => (
                          <button
                            key={min}
                            type="button"
                            onClick={() => handleChange("hydrationMinute", min)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition active:scale-95 cursor-pointer ${
                              form.hydrationMinute === min
                                ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/20 font-black"
                                : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            {min}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Badge Tag */}
                  <FormInput
                    label="Badge Header"
                    type="text"
                    placeholder="e.g. HYDRATION BREAK"
                    value={form.hydrationBadgeTitle || "HYDRATION BREAK"}
                    onChange={(e) =>
                      handleChange("hydrationBadgeTitle", e.target.value)
                    }
                  />

                  {/* Temperature / Stat Pill */}
                  <FormInput
                    label="Temperature / Stat Pill"
                    type="text"
                    placeholder="e.g. 32°C"
                    value={form.hydrationTemp || "32°C"}
                    onChange={(e) =>
                      handleChange("hydrationTemp", e.target.value)
                    }
                  />
                </div>

                {/* Main Title */}
                <FormInput
                  label="Alert Headline"
                  type="text"
                  placeholder="e.g. OFFICIAL COOLING BREAK"
                  value={form.hydrationTitle || ""}
                  onChange={(e) =>
                    handleChange("hydrationTitle", e.target.value)
                  }
                />

                {/* Detail Description */}
                <FormInput
                  label="Custom Subtitle Override (Optional)"
                  type="text"
                  placeholder={`Auto if blank: TEMPERATURE ${form.hydrationTemp || "32°C"} • ${form.hydrationMinute || "30'"} MINUTE`}
                  value={form.hydrationDetail || ""}
                  onChange={(e) =>
                    handleChange("hydrationDetail", e.target.value)
                  }
                />
              </div>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Notifications to Database
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
            yOffset={form.yOffset || 50}
            setYOffset={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.yOffset || 50)
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
