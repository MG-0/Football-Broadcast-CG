import React from "react";
import { AlignLeft, Save } from "lucide-react";
import useLowerThird from "./useLowerThird";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";
import FormInput from "../../../../components/FormInput";

// lower third overlay control component
export default function LowerThirdMatch() {
  // values from custom lower third hook
  const {
    isLive,
    form,
    setForm,
    handleChange,
    handleSave,
    handleToggleLive,
    currentPayload,
    matchData,
  } = useLowerThird();

  if (!matchData) {
    return (
      <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Match Details...
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Lower Third Graphic"
        description="Configure, save, and broadcast a live ticker bar graphic for long scrolling news, announcements, or custom stats strap."
        Icon={AlignLeft}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow ml-4">
        {/* Left Column: Preview and controls */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          {/* Simulated Broadcast Output */}
          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-end p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none" />
            <div className="absolute top-4 left-4 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-violet-450 uppercase z-10">
              1080p Stream Output
            </div>

            {/* Lower Third Ticker Mockup */}
            <div
              className="w-full bg-[#0b1021]/95 border border-slate-855 flex items-center gap-3.5 px-4 py-2.5 relative overflow-hidden transition-all duration-75 rounded-2xl z-10 animate-fade-in"
              style={{
                borderLeft: `4px solid ${currentPayload.resolvedColor}`,
                bottom: `${(form.yOffset || 50) / 7}px`,
                left: `${(form.xOffset || 0) / 7}px`,
                transform: `scale(${form.scale || 1})`,
                boxShadow: `0 12px 40px rgba(0,0,0,0.65), 0 0 24px ${currentPayload.resolvedColor}15`,
              }}
            >
              {/* Badge */}
              {form.badge && (
                <span
                  className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shrink-0 font-mono"
                  style={{
                    color: currentPayload.resolvedColor,
                    background: `${currentPayload.resolvedColor}15`,
                    border: `1px solid ${currentPayload.resolvedColor}30`,
                  }}
                >
                  {form.badge}
                </span>
              )}

              {/* Title */}
              <h4 className="text-[9px] sm:text-[10px] font-black text-slate-100 tracking-wide uppercase shrink-0 whitespace-nowrap font-outfit">
                {form.title || "TITLE"}
              </h4>

              {/* Ticker separator */}
              <span
                id="lowerthird-mock-sep"
                className="h-3 w-[1.5px] rounded shrink-0"
                style={{
                  background: `linear-gradient(180deg, ${currentPayload.resolvedColor} 0%, transparent 100%)`,
                }}
              />

              {/* Subtitle / Scroller content */}
              <div className="flex-grow overflow-hidden relative">
                <span className="text-[8.5px] sm:text-[9.5px] font-medium text-slate-300 block truncate font-inter">
                  {form.subtitle || "News ticker scroller message goes here..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration Forms and Controls */}
        <div className="space-y-6">
          {/* Live Switch Board */}
          <div className="space-y-4">
            <LiveToggle isLive={isLive} onToggle={handleToggleLive} />

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Lower Third to Database
            </button>
          </div>

          {/* Strap Configurations */}
          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl flex flex-col space-y-5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Strap Configurations
            </h3>

            {/* Topic and Title row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Topic Tag / Badge"
                name="badge"
                type="text"
                placeholder="e.g. STATISTICS"
                value={form.badge || ""}
                onChange={(e) => handleChange("badge", e.target.value)}
              />
              <FormInput
                label="Main strap Title"
                name="title"
                type="text"
                placeholder="e.g. BARCELONA:"
                value={form.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            {/* Subtitle textarea */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                Scrolling Ticker Text
              </label>
              <textarea
                rows={3}
                value={form.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter details here. It will marquee horizontally on the stream overlay."
                className="w-full bg-slate-955 border border-slate-855 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-200 outline-none transition placeholder-slate-650 resize-none font-inter leading-relaxed"
              />
            </div>

            {/* Ticker Scroll Speed Slider */}
            <div className="space-y-2.5 border-t border-slate-900/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit">
                  Ticker Scroll Speed
                </span>
                <span className="text-[10px] font-black font-mono text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded">
                  {(form.speed || 1.0).toFixed(1)}x Speed
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Slow
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={form.speed || 1.0}
                  onChange={(e) =>
                    handleChange("speed", parseFloat(e.target.value))
                  }
                  className="flex-grow h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-500 border border-slate-800"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Fast
                </span>
              </div>
            </div>

            {/* Strap Styling Theme selector */}
            <div className="space-y-3.5 border-t border-slate-900/60 pt-5">
              <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block font-mono">
                Branding Accent Color Mode
              </span>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("themeMode", "home")}
                  className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all font-outfit flex flex-col items-center gap-0.5 active:scale-95 ${
                    form.themeMode === "home"
                      ? "bg-violet-600/10 border-violet-500 text-violet-400 shadow-md"
                      : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-outfit">🏠 Home</span>
                  <span className="text-[7px] font-mono opacity-60 tracking-wider">
                    Team Primary
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("themeMode", "away")}
                  className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all font-outfit flex flex-col items-center gap-0.5 active:scale-95 ${
                    form.themeMode === "away"
                      ? "bg-violet-600/10 border-violet-500 text-violet-400 shadow-md"
                      : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-outfit">✈ Away</span>
                  <span className="text-[7px] font-mono opacity-60 tracking-wider">
                    Team Primary
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("themeMode", "custom")}
                  className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all font-outfit flex flex-col items-center gap-0.5 active:scale-95 ${
                    form.themeMode === "custom"
                      ? "bg-violet-600/10 border-violet-500 text-violet-400 shadow-md"
                      : "bg-slate-955 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-outfit">🎨 Custom</span>
                  <span className="text-[7px] font-mono opacity-60 tracking-wider">
                    Custom Hex
                  </span>
                </button>
              </div>

              {/* Custom Color Picker input */}
              {form.themeMode === "custom" && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-slate-955 border border-slate-850 rounded-2xl">
                  <input
                    type="color"
                    value={form.customColor || "#6366f1"}
                    onChange={(e) =>
                      handleChange("customColor", e.target.value)
                    }
                    className="w-9 h-9 rounded-xl border border-slate-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.customColor || "#6366f1"}
                    onChange={(e) =>
                      handleChange("customColor", e.target.value)
                    }
                    className="flex-grow bg-transparent text-xs font-mono font-bold text-slate-200 outline-none px-2"
                  />
                </div>
              )}
            </div>
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
