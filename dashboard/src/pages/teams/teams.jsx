import { Link } from "react-router-dom";
import useTeam from "./useTeam";
import ConfirmModal from "../../components/ConfirmModal";

import {
  ChevronLeft,
  Pencil,
  Trash2,
  UploadCloud,
  Shield,
  Users,
  ShieldHalf,
  Settings,
} from "lucide-react";

import FormInput from "../../components/FormInput";

export default function Teams() {
  const {
    handleSubmit,
    handleChange,
    form,
    handleFileChange,
    teams,
    editTeamId,
    handleEditSelect,
    handleCancelEdit,
    deleteModalOpen,
    triggerDelete,
    closeDeleteModal,
    confirmDelete,
  } = useTeam();

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-6 md:p-10 relative overflow-hidden select-none font-inter">
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Team"
        message="Are you sure you want to remove this team? This action is permanent and will delete all its media links."
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f26_1px,transparent_1px),linear-gradient(to_bottom,#080f26_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-12 h-12 bg-slate-900/90 hover:bg-emerald-500 hover:text-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-400 text-slate-300 transition-all duration-300 shadow-lg shadow-black/40 group active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-wide font-outfit text-slate-100 uppercase">
              Create Teams Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-inter">
              Manage football clubs, logos, and broadcast branding assets.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 font-outfit shadow-md shadow-emerald-500/5">
          <ShieldHalf className="w-3.5 h-3.5" />
          Teams Mode
        </span>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 font-outfit">
              <Users className="w-5 h-5 text-emerald-400" />
              Registered Clubs
            </h2>
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-mono font-bold">
              {teams.length} Teams Available
            </span>
          </div>

          {teams.length === 0 ? (
            <div className="bg-[#0b1021]/80 backdrop-blur border border-slate-800/80 rounded-3xl p-20 text-center flex flex-col items-center justify-center shadow-2xl">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-500 mb-6 shadow-inner relative">
                <Shield className="w-10 h-10 text-emerald-500/40" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-lg font-black text-slate-200 font-outfit uppercase tracking-wider">
                No Registered Teams Found
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm font-inter leading-relaxed">
                Fill out the registration console on the right to register your
                first broadcast team asset.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`bg-[#0b1021]/90 backdrop-blur border rounded-3xl p-5 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${
                    editTeamId === team.id
                      ? "border-emerald-400 shadow-xl shadow-emerald-500/10"
                      : "border-slate-800/80 hover:border-slate-700/80 shadow-lg hover:shadow-cyan-500/5"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-[#050915] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-emerald-500/30 transition-colors duration-300">
                      {team.imageUrl ? (
                        <img
                          src={`/uploads/misc/${team.imageUrl}`}
                          alt={team.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Shield className="w-8 h-8 text-slate-700 group-hover:text-emerald-500/40 transition-colors" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-100 text-base font-outfit uppercase tracking-wide truncate max-w-full">
                          {team.name}
                        </h3>
                        <span className="text-[10px] bg-slate-950 text-cyan-400 px-2 py-0.5 rounded-lg font-mono font-black border border-slate-800">
                          {team.shortName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-inter">
                        Coach:{" "}
                        <span className="text-slate-300 font-semibold">
                          {team.coachName}
                        </span>
                      </p>

                      <div className="flex gap-2 pt-1">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-950 shadow-md"
                          style={{ backgroundColor: team.primaryColor }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-slate-950 shadow-md"
                          style={{ backgroundColor: team.secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditSelect(team)}
                      className={`p-3 rounded-2xl transition duration-200 border ${
                        editTeamId === team.id
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                          : "text-slate-400 bg-slate-900 border-slate-800 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700"
                      }`}
                      title="Edit Team"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerDelete(team.id)}
                      className="text-slate-400 bg-slate-900 border border-slate-800 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 p-3 rounded-2xl transition duration-200"
                      title="Remove Team"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest font-outfit flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            Create Team
          </h2>

          <div className="bg-[#0b1021]/90 backdrop-blur border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Club Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Barcelona"
              />

              <FormInput
                label="Short Tag (3 characters max)"
                name="shortName"
                value={form.shortName}
                onChange={handleChange}
                placeholder="e.g. FCB"
                max={3}
                className="uppercase"
              />

              <FormInput
                label="Coach Name"
                name="coachName"
                value={form.coachName}
                onChange={handleChange}
                placeholder="e.g. Hansi Flick"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter">
                    Primary Color
                  </label>
                  <div className="flex gap-3 items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <input
                      name="primaryColor"
                      type="color"
                      value={form.primaryColor}
                      onChange={handleChange}
                      className="h-8 w-12 bg-transparent border-0 cursor-pointer rounded-lg shrink-0"
                    />
                    <span className="text-xs font-mono text-slate-300 font-bold">
                      {form.primaryColor}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter">
                    Secondary Color
                  </label>
                  <div className="flex gap-3 items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <input
                      name="secondaryColor"
                      type="color"
                      value={form.secondaryColor}
                      onChange={handleChange}
                      className="h-8 w-12 bg-transparent border-0 cursor-pointer rounded-lg shrink-0"
                    />
                    <span className="text-xs font-mono text-slate-300 font-bold">
                      {form.secondaryColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter">
                  Club Emblem / Logo File {editTeamId && "(Optional)"}
                </label>
                <label className="w-full flex flex-col items-center px-4 py-6 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group">
                  <UploadCloud className="w-8 h-8 text-slate-500 mb-2 group-hover:text-emerald-400 transition-colors" />
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

                {form.image && (
                  <div className="mt-4 flex flex-col items-center gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] font-bold text-emerald-400 truncate w-full text-center">
                      Selected: {form.image.name}
                    </p>
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="Upload Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-800 shadow-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-3 font-outfit">
                {editTeamId && (
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
                  className="flex-grow py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black uppercase tracking-widest rounded-xl text-xs transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
                >
                  {editTeamId ? "Update Team" : "Register Team"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
