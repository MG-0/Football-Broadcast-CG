import { CloudSun, Save } from "lucide-react";
import useWeather from "./useWeather";

// Import configurations
import {
  weatherConditions,
  windDirections,
  pitchConditions,
} from "../../config/layersConfig";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

export default function WeatherMatch() {
  const {
    matchData,
    isLive,
    location,
    setLocation,
    temperature,
    setTemperature,
    condition,
    setCondition,
    humidity,
    setHumidity,
    windSpeed,
    setWindSpeed,
    windDirection,
    setWindDirection,
    rainProbability,
    setRainProbability,
    pitchCondition,
    setPitchCondition,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    getConditionIcon,
    handleSaveWeather,
    handleToggleLive,
  } = useWeather();

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
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="Weather Conditions"
        description="Configure, save, and trigger the weather report graphic card on the live broadcast."
        Icon={CloudSun}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow ml-4">
        {/* Left Column: Visual Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex items-end justify-start p-4 sm:p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-mono font-bold text-sky-450 uppercase z-10 tracking-wider">
              1080p Stream Output
            </div>

            {/* Broadcast Weather Card Preview */}
            <div
              className="relative w-[90%] sm:w-[70%] md:w-[60%] origin-bottom-left bg-[#050915]/95 border border-slate-800/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col space-y-3 z-10 transition-all duration-75"
              style={{
                bottom: `${(yOffset || 0) / 7}px`,
                left: `${(xOffset || 0) / 7}px`,
                transform: `scale(${scale || 1})`,
              }}
            >
              {/* Card Header (Location & Emojis) */}
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-emerald-400 font-bold uppercase tracking-widest block font-mono">
                    Weather Report
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider truncate font-outfit">
                    {location || "Cairo Stadium"}
                  </h4>
                </div>
                <span className="text-2xl sm:text-3xl filter drop-shadow-md select-none shrink-0">
                  {getConditionIcon(condition)}
                </span>
              </div>

              {/* Temperature display */}
              <div className="flex items-baseline gap-1 py-1.5 border-y border-slate-900/60">
                <span className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tighter font-outfit">
                  {temperature ?? 25}
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-outfit">
                  °C
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-550 font-black uppercase ml-auto tracking-widest font-mono">
                  {condition}
                </span>
              </div>

              {/* Weather Stats Table */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] sm:text-[10px] font-medium text-slate-455">
                <div className="flex justify-between border-b border-slate-900/40 pb-1 font-mono">
                  <span>Humidity:</span>
                  <span className="text-slate-200 font-bold">{humidity}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/40 pb-1 font-mono">
                  <span>Wind Speed:</span>
                  <span className="text-slate-200 font-bold">
                    {windSpeed} km/h
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-900/40 pb-1 font-mono">
                  <span>Wind Dir:</span>
                  <span className="text-slate-200 font-bold">
                    {windDirection}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-900/40 pb-1 font-mono">
                  <span>Rain Prob:</span>
                  <span className="text-slate-200 font-bold">
                    {rainProbability}%
                  </span>
                </div>
                <div className="flex justify-between col-span-2 pt-0.5 font-mono">
                  <span>Pitch State:</span>
                  <span className="text-emerald-400 font-black uppercase tracking-wider font-outfit">
                    {pitchCondition}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Toggle */}
          <LiveToggle isLive={isLive} onToggle={handleToggleLive} />
        </div>

        {/* Right Column: Console Action Controls */}
        <div className="space-y-6">
          <form onSubmit={handleSaveWeather} className="space-y-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Weather Information Form
            </h3>

            <div className="bg-[#0b1021]/80 border border-slate-850 p-6 rounded-3xl space-y-5 shadow-xl">
              {/* Location Detail */}
              <FormInput
                label="Stadium / Location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Cairo International Stadium"
              />

              {/* Grid for Meteorological Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Temperature (°C)"
                  name="temperature"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                />
                <FormSelect
                  label="Condition"
                  name="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  options={weatherConditions}
                />
                <FormInput
                  label="Humidity (%)"
                  name="humidity"
                  type="number"
                  min="0"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                />
                <FormInput
                  label="Rain Prob. (%)"
                  name="rainProbability"
                  type="number"
                  min="0"
                  max="100"
                  value={rainProbability}
                  onChange={(e) => setRainProbability(Number(e.target.value))}
                />
                <FormInput
                  label="Wind Speed (km/h)"
                  name="windSpeed"
                  type="number"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                />
                <FormSelect
                  label="Wind Dir."
                  name="windDirection"
                  value={windDirection}
                  onChange={(e) => setWindDirection(e.target.value)}
                  options={windDirections}
                />
                <div className="sm:col-span-2">
                  <FormSelect
                    label="Pitch Surface State"
                    name="pitchCondition"
                    value={pitchCondition}
                    onChange={(e) => setPitchCondition(e.target.value)}
                    options={pitchConditions}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save Weather to Database
            </button>
          </form>

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
