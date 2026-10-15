import React from "react";
import { Link } from "react-router-dom";
import useTournaments from "./useTournaments";
import ConfirmModal from "../../components/ConfirmModal";

// Import Lucide Icons
import {
  ChevronLeft,
  Pencil,
  Trash2,
  UploadCloud,
  Trophy,
  Database,
  ShieldAlert,
  Settings,
} from "lucide-react";

// Import Custom Component
import FormInput from "../../components/FormInput";

export default function Tournaments() {
  const {
    form,
    tournaments,
    editTournamentId,
    handleSubmit,
    handleChange,
    handleFileChange,
    handleEditSelect,
    handleCancelEdit,
    deleteModalOpen,
    triggerDelete,
    closeDeleteModal,
    confirmDelete,
  } = useTournaments();

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-6 md:p-10 relative overflow-hidden select-none font-inter">
      {/* Confirm Delete Popup Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Tournament"
        message="Are you sure you want to remove this tournament competition? This action is permanent and will delete its match graphic templates."
      />

      {/* Cyber Glow background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-yellow-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f26_1px,transparent_1px),linear-gradient(to_bottom,#080f26_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-12 h-12 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 rounded-2xl border border-slate-800 hover:border-amber-400 text-slate-300 transition-all duration-300 shadow-lg shadow-black/40 group active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-wide font-outfit text-slate-100 uppercase">
              Tournaments Console
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-inter">
              Configure leagues, cups, and live broadcast match branding assets.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 font-outfit shadow-md shadow-amber-500/5">
          <Database className="w-3.5 h-3.5" />
          League Mode
        </span>
      </header>

      {/* Main Workspace Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Left Side: Registered Tournaments Grid List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 font-outfit">
              <Trophy className="w-5 h-5 text-amber-400" />
              Active Competitions
            </h2>
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-mono font-bold">
              {tournaments.length} Tournaments Loaded
            </span>
          </div>

          {tournaments.length === 0 ? (
            // Empty State Layout
            <div className="bg-[#0b1021]/80 backdrop-blur border border-slate-800/80 rounded-3xl p-20 text-center flex flex-col items-center justify-center shadow-2xl">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-500 mb-6 shadow-inner relative">
                <Trophy className="w-10 h-10 text-amber-500/40" />
              </div>
              <p className="text-lg font-black text-slate-200 font-outfit uppercase tracking-wider">
                No Tournaments Registered Yet
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm font-inter leading-relaxed">
                Fill out the registration console on the right to register your
                first broadcast tournament emblem.
              </p>
            </div>
          ) : (
            // Dynamic Tournaments Grid List
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className={`bg-[#0b1021]/90 backdrop-blur border rounded-3xl p-5 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${
                    editTournamentId === tournament.id
                      ? "border-amber-400 shadow-xl shadow-amber-500/10"
                      : "border-slate-800/80 hover:border-slate-700/80 shadow-lg hover:shadow-amber-500/5"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Tournament Logo Emblem */}
                    <div className="w-16 h-16 rounded-2xl bg-[#050915] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-amber-500/30 transition-colors duration-300 p-1.5">
                      {tournament.logoUrl ? (
                        <img
                          src={`/uploads/misc/${tournament.logoUrl}`}
                          alt={tournament.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Trophy className="w-8 h-8 text-slate-750 group-hover:text-amber-500/40 transition-colors" />
                      )}
                    </div>

                    {/* Tournament Metadata */}
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-black text-slate-100 text-base font-outfit uppercase tracking-wide truncate max-w-full">
                        {tournament.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        ID: {tournament.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditSelect(tournament)}
                      className={`p-3 rounded-2xl transition duration-200 border ${
                        editTournamentId === tournament.id
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                          : "text-slate-400 bg-slate-900 border-slate-800 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700"
                      }`}
                      title="Edit Tournament"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerDelete(tournament.id)}
                      className="text-slate-400 bg-slate-900 border border-slate-800 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 p-3 rounded-2xl transition duration-200"
                      title="Remove Tournament"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Side: Register/Edit Tournament Form */}
        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest font-outfit flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Create Tournament
          </h2>

          <div className="bg-[#0b1021]/90 backdrop-blur border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tournament Name Input */}
              <FormInput
                label="Tournament Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Champions League"
              />

              {/* Upload Drop Zone Emblem */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter">
                  Tournament Logo {editTournamentId && "(Optional)"}
                </label>
                <label className="w-full flex flex-col items-center px-4 py-6 bg-slate-950 border border-slate-800 hover:border-amber-500/50 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group">
                  <UploadCloud className="w-8 h-8 text-slate-500 mb-2 group-hover:text-amber-400 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 font-outfit uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                    Choose logo file
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Selected filename preview */}
                {form.logo && (
                  <div className="mt-4 flex flex-col items-center gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] font-bold text-amber-400 truncate w-full text-center">
                      Selected: {form.logo.name}
                    </p>
                    <img
                      src={URL.createObjectURL(form.logo)}
                      alt="Upload Preview"
                      className="w-16 h-16 object-contain rounded-xl border border-slate-800 shadow-lg bg-slate-900/60 p-1"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3 font-outfit">
                {editTournamentId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-grow py-3.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 font-extrabold uppercase tracking-widest rounded-xl text-xs transition duration-150"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-grow py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black uppercase tracking-widest rounded-xl text-xs transition-all duration-300 hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95"
                >
                  {editTournamentId ? "Update League" : "Register League"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
