import React from "react";
import { Link } from "react-router-dom";
import useCreateMatch from "./useCreateMatch";

// main component for creating or editing matches
export default function CreateMatch() {
  // hook containing all form state and event handlers
  const {
    form,
    teams,
    tournaments,
    sponsors,
    isLoading,
    editMatchId,
    handleChange,
    handleSponsorToggle,
    handleSubmit,
  } = useCreateMatch();

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans p-6 md:p-8 relative overflow-hidden select-none">
      {/* Background decorative pitch overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/10 rounded-full" />
      </div>

      {/* Top Header Bar */}
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-10 h-10 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/50 transition duration-150"
          >
            <svg
              className="w-5 h-5 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-wide">
              {editMatchId ? "Modify Match Setup" : "Create Live Match"}
            </h1>
            <p className="text-slate-400 text-xs">
              {editMatchId
                ? "Update the details and broadcast settings for this match."
                : "Set up a new broadcast match workspace with teams, tournament, and sponsors."}
            </p>
          </div>
        </div>
      </header>

      {/* Form Workspace */}
      <main className="max-w-4xl mx-auto relative z-10">
        <div className="bg-[#0d1527]/90 backdrop-blur border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Date and Time */}
            <div className="space-y-2">
              <label
                htmlFor="matchDate"
                className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Match Date & Time
              </label>
              <input
                id="matchDate"
                name="matchDate"
                type="datetime-local"
                value={form.matchDate}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2.5 bg-[#080d19] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition duration-150"
              />
            </div>

            {/* Row 2: Tournament & Teams Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tournament Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="tournamentId"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Select Tournament
                </label>
                <select
                  id="tournamentId"
                  name="tournamentId"
                  value={form.tournamentId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#080d19] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 transition duration-150"
                >
                  <option value="">-- Choose Tournament --</option>
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Home Team Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="homeTeamId"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Home Team (Host)
                </label>
                <select
                  id="homeTeamId"
                  name="homeTeamId"
                  value={form.homeTeamId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#080d19] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 transition duration-150"
                >
                  <option value="">-- Choose Home Team --</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Away Team Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="awayTeamId"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  Away Team (Visitor)
                </label>
                <select
                  id="awayTeamId"
                  name="awayTeamId"
                  value={form.awayTeamId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#080d19] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 transition duration-150"
                >
                  <option value="">-- Choose Away Team --</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Sponsors Multi-Select Grid Layout */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Sponsors (Optional - Select multiple)
                </label>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Toggle sponsor assets that will rotate on your graphics
                  overlays.
                </p>
              </div>

              {sponsors.length === 0 ? (
                <div className="p-4 bg-[#080d19] border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                  No registered sponsors found. Go to Sponsors Directory to add
                  them.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {sponsors.map((sponsor) => {
                    const isSelected = form.sponsorIds.includes(sponsor.id);

                    return (
                      <div
                        key={sponsor.id}
                        onClick={() => handleSponsorToggle(sponsor.id)}
                        className={`cursor-pointer rounded-xl p-3 border text-center flex flex-col items-center justify-center gap-2 transition duration-200 ${
                          isSelected
                            ? "bg-cyan-500/5 border-cyan-500/60 shadow-lg shadow-cyan-500/5"
                            : "bg-[#080d19] border-slate-800 hover:border-slate-700/80"
                        }`}
                      >
                        {/* Sponsor Logo Icon */}
                        <div className="w-12 h-10 flex items-center justify-center overflow-hidden bg-slate-950/40 p-1 rounded-md">
                          {sponsor.logoUrl ? (
                            <img
                              src={`/uploads/misc/${sponsor.logoUrl}`}
                              alt={sponsor.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-[9px] font-mono text-slate-500">
                              {sponsor.name.slice(0, 3)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300 truncate w-full">
                          {sponsor.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Bottom Section */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
              <Link
                to="/dashboard"
                className="px-6 py-2.5 bg-slate-800 text-slate-300 font-bold uppercase tracking-wider rounded-xl text-xs hover:bg-slate-700 transition duration-150"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold uppercase tracking-wider rounded-xl text-xs hover:from-emerald-400 hover:to-teal-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Saving..."
                  : editMatchId
                    ? "Update Match"
                    : "Initialize Match"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
