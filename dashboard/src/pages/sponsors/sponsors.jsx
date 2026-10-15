import { Link } from "react-router-dom";
import useSponsors from "./useSponsors";
import ConfirmModal from "../../components/ConfirmModal";

// Import Lucide Icons
import {
  ChevronLeft,
  Pencil,
  Trash2,
  UploadCloud,
  Handshake,
  Database,
  ShieldAlert,
  Settings,
} from "lucide-react";

// Import Custom Component
import FormInput from "../../components/FormInput";

export default function Sponsors() {
  const {
    form,
    sponsors,
    editSponsorId,
    handleSubmit,
    handleChange,
    handleFileChange,
    handleEditSelect,
    handleCancelEdit,
    deleteModalOpen,
    triggerDelete,
    closeDeleteModal,
    confirmDelete,
  } = useSponsors();

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-6 md:p-10 relative overflow-hidden select-none font-inter">
      {/* Confirm Delete Popup Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Sponsor"
        message="Are you sure you want to remove this sponsor brand? This action is permanent and will delete its match graphic overlays."
      />

      {/* Cyber Glow background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f26_1px,transparent_1px),linear-gradient(to_bottom,#080f26_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-12 h-12 bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-400 text-slate-300 transition-all duration-300 shadow-lg shadow-black/40 group active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-wide font-outfit text-slate-100 uppercase">
              Sponsors Console
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-inter">
              Manage tournament sponsors and broadcast branding assets.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 font-outfit shadow-md shadow-cyan-500/5">
          <Database className="w-3.5 h-3.5" />
          Sponsor Mode
        </span>
      </header>

      {/* Main Workspace Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Left Side: Registered Sponsors Grid List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 font-outfit">
              <Handshake className="w-5 h-5 text-cyan-400" />
              Active Sponsors
            </h2>
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-mono font-bold">
              {sponsors.length} Sponsors Loaded
            </span>
          </div>

          {sponsors.length === 0 ? (
            // Empty State Layout
            <div className="bg-[#0b1021]/80 backdrop-blur border border-slate-800/80 rounded-3xl p-20 text-center flex flex-col items-center justify-center shadow-2xl">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-500 mb-6 shadow-inner relative">
                <ShieldAlert className="w-10 h-10 text-cyan-500/40" />
              </div>
              <p className="text-lg font-black text-slate-200 font-outfit uppercase tracking-wider">
                No Sponsors Registered
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm font-inter leading-relaxed">
                Fill out the registration form on the right to register your
                first broadcast branding sponsor.
              </p>
            </div>
          ) : (
            // Dynamic Sponsors Grid List
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className={`bg-[#0b1021]/90 backdrop-blur border rounded-3xl p-5 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${
                    editSponsorId === sponsor.id
                      ? "border-cyan-400 shadow-xl shadow-cyan-500/10"
                      : "border-slate-800/80 hover:border-slate-700/80 shadow-lg hover:shadow-cyan-500/5"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sponsor Logo Emblem */}
                    <div className="w-20 h-14 rounded-2xl bg-[#050915] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-cyan-500/30 transition-colors duration-300 p-2">
                      {sponsor.logoUrl ? (
                        <img
                          src={`/uploads/misc/${sponsor.logoUrl}`}
                          alt={sponsor.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-xs font-black text-cyan-400 font-mono uppercase">
                          {sponsor.name.slice(0, 3)}
                        </span>
                      )}
                    </div>

                    {/* Sponsor Metadata */}
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-black text-slate-100 text-base font-outfit uppercase tracking-wide truncate max-w-full">
                        {sponsor.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        ID: {sponsor.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditSelect(sponsor)}
                      className={`p-3 rounded-2xl transition duration-200 border ${
                        editSponsorId === sponsor.id
                          ? "text-cyan-400 bg-cyan-500/10 border-cyan-400/30"
                          : "text-slate-400 bg-slate-900 border-slate-800 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700"
                      }`}
                      title="Edit Sponsor"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerDelete(sponsor.id)}
                      className="text-slate-400 bg-slate-900 border border-slate-800 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 p-3 rounded-2xl transition duration-200"
                      title="Remove Sponsor"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Side: Register/Edit Sponsor Form */}
        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest font-outfit flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Create Sponsor
          </h2>

          <div className="bg-[#0b1021]/90 backdrop-blur border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sponsor Name Input */}
              <FormInput
                label="Sponsor Brand Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Adidas"
              />

              {/* Upload Drop Zone Logo */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter">
                  Sponsor Brand Logo {editSponsorId && "(Optional)"}
                </label>
                <label className="w-full flex flex-col items-center px-4 py-6 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group">
                  <UploadCloud className="w-8 h-8 text-slate-500 mb-2 group-hover:text-cyan-400 transition-colors" />
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
                    <p className="text-[10px] font-bold text-cyan-400 truncate w-full text-center">
                      Selected: {form.logo.name}
                    </p>
                    <img
                      src={URL.createObjectURL(form.logo)}
                      alt="Upload Preview"
                      className="w-20 h-14 object-contain rounded-xl border border-slate-800 shadow-lg bg-slate-900/60 p-1"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3 font-outfit">
                {editSponsorId && (
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
                  className="flex-grow py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black uppercase tracking-widest rounded-xl text-xs transition-all duration-300 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95"
                >
                  {editSponsorId ? "Update Sponsor" : "Register Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
