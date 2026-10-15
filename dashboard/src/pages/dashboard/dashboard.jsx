import { Link, NavLink } from "react-router-dom";
import useDashboard from "./useDashboard";
import ConfirmModal from "../../components/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import {
  MonitorPlay,
  Users,
  Trophy,
  Handshake,
  PlusCircle,
  Pencil,
  Trash2,
  CalendarX,
  ArrowRight,
} from "lucide-react";

// main dashboard page component
export default function Dashboard() {
  // dashboard states and api calls
  const {
    matches,
    isLoading,
    deleteModalOpen,
    triggerDeleteMatch,
    closeDeleteModal,
    confirmDeleteMatch,
    updateMatchStatus,
  } = useDashboard();

  // authentication logout trigger
  const { logout } = useAuth();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#12183d] via-[#090b1a] to-[#0b2f3d] text-slate-100 flex flex-col md:flex-row overflow-hidden select-none font-inter relative">
      {/* Dynamic Ambient Glow Blobs - Premium Bright Mesh Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-75">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-indigo-500/30 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full bg-cyan-400/25 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-[130px] pointer-events-none" />
        <div className="absolute top-2/3 left-10 w-[500px] h-[500px] rounded-full bg-purple-500/25 blur-[120px] pointer-events-none" />
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteMatch}
        title="Delete Match Workspace"
        message="Are you sure you want to delete this match? This will clear all its scores, configurations, and custom overlay setups permanently."
      />

      <div className="w-full md:w-72 bg-slate-900/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-850 flex flex-col shrink-0 relative z-20 shadow-xl overflow-y-auto">
        <div className="p-6.5 flex flex-col h-full justify-between m-4">
          <div>
            <div className="flex items-center gap-3.5 border-b border-slate-850 pb-5">
              <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/10">
                <MonitorPlay className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-black tracking-widest font-outfit text-slate-100">
                  FOOTBALL BROADCAST
                </h2>
                <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">
                  CG Live Control
                </span>
              </div>
            </div>

            <nav className="mt-8 space-y-2.5 flex-grow">
              <NavLink
                to="/teams"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all duration-150 font-outfit border ${
                    isActive
                      ? "text-emerald-400 border-emerald-500/30 bg-[#0e1629] shadow-lg shadow-emerald-500/5"
                      : "text-slate-400 bg-[#070c19]/70 border-slate-900/80 hover:bg-[#0e1629]/50 hover:text-slate-200 hover:border-slate-800"
                  }`
                }
              >
                <Users className="w-5 h-5 shrink-0" />
                <span className="flex-grow"> Create Teams</span>
              </NavLink>

              <NavLink
                to="/tournaments"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all duration-150 font-outfit border ${
                    isActive
                      ? "text-emerald-400 border-emerald-500/30 bg-[#0e1629] shadow-lg shadow-emerald-500/5"
                      : "text-slate-400 bg-[#070c19]/70 border-slate-900/80 hover:bg-[#0e1629]/50 hover:text-slate-200 hover:border-slate-800"
                  }`
                }
              >
                <Trophy className="w-5 h-5 shrink-0" />
                <span className="flex-grow">Tournaments</span>
              </NavLink>

              <NavLink
                to="/sponsors"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all duration-150 font-outfit border ${
                    isActive
                      ? "text-emerald-400 border-emerald-500/30 bg-[#0e1629] shadow-lg shadow-emerald-500/5"
                      : "text-slate-400 bg-[#070c19]/70 border-slate-900/80 hover:bg-[#0e1629]/50 hover:text-slate-200 hover:border-slate-800"
                  }`
                }
              >
                <Handshake className="w-5 h-5 shrink-0" />
                <span className="flex-grow">Create Sponsors</span>
              </NavLink>
            </nav>
          </div>

          <div className="hidden md:block pt-6 border-t border-slate-850">
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-inter">
              Designed for live football broadcast character generator control
              rooms.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow min-w-0 p-6 md:p-10 overflow-y-auto relative flex flex-col z-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-[100px]" />
        </div>

        <div className="flex flex-col xl:flex-row justify-between xl:items-center mb-8 relative z-10 gap-4">
          <div className="w-full xl:w-auto">
            <h1 className="text-2xl md:text-3xl font-black tracking-wide font-outfit text-slate-100 uppercase">
              Workspace Matches
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Initialize and manage active match broadcast graphics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
            <Link
              to="/create-match"
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl text-[10px] transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 font-outfit shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Match
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="
                          flex items-center justify-center gap-2
                          px-4 py-3.5
                          bg-red-500/10
                          hover:bg-red-500
                          text-red-400
                          hover:text-white
                          border border-red-500/20
                          hover:border-red-500
                          rounded-2xl
                          text-[10px]
                          font-black
                          uppercase
                          tracking-widest
                          transition-all
                          duration-300
                          shadow-lg
                          hover:shadow-red-500/30
                          hover:-translate-y-0.5
                          active:scale-95
                          font-outfit
                          shrink-0
                          "
            >
              <LogOut className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-950/20 border border-slate-800/50 rounded-3xl p-6 relative z-10 flex flex-col justify-start backdrop-blur-sm shadow-2xl">
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
              Loading Match Workspaces...
            </div>
          ) : matches.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                <CalendarX className="w-8 h-8 text-slate-600" />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-extrabold text-slate-300 font-outfit uppercase">
                  No Active Match Workspaces
                </p>
                <p className="text-xs text-slate-500 max-w-sm font-inter leading-relaxed">
                  Setup and initialize a match workspace to start broadcasting
                  live scoreboard and graphic overlays.
                </p>
              </div>
              <Link
                to="/create-match"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs transition duration-150 font-outfit uppercase tracking-wider shadow-md"
              >
                Setup First Match
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {matches.map((match) => {
                const formattedDate = new Date(match.matchDate).toLocaleString(
                  "en-US",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  },
                );

                return (
                  <div
                    key={match.id}
                    className="bg-[#0b1021]/80 backdrop-blur border border-slate-850 hover:border-slate-700/80 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl group hover:shadow-cyan-500/5 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        {match.tournament?.logoUrl ? (
                          <img
                            src={`/uploads/misc/${match.tournament.logoUrl}`}
                            alt={match.tournament.name}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[9px] font-black text-amber-400 font-mono">
                            T
                          </div>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate font-outfit">
                          {match.tournament?.name || "Friendly Match"}
                        </span>
                      </div>

                      <select
                        value={match.status || "pending"}
                        onChange={(e) =>
                          updateMatchStatus(match.id, e.target.value)
                        }
                        className={`text-[8px] font-mono font-black uppercase px-2.5 py-1 rounded-lg tracking-widest cursor-pointer outline-none transition-all duration-200 border bg-transparent ${
                          match.status === "live"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-extrabold shadow-sm animate-pulse"
                            : match.status === "pending"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                              : "bg-slate-900/60 text-slate-400 border-slate-850"
                        }`}
                      >
                        <option
                          value="pending"
                          className="bg-[#0b1021] text-amber-400 font-bold"
                        >
                          Pending
                        </option>
                        <option
                          value="live"
                          className="bg-[#0b1021] text-emerald-400 font-bold"
                        >
                          Live
                        </option>
                        <option
                          value="finished"
                          className="bg-[#0b1021] text-slate-400"
                        >
                          Finished
                        </option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center bg-[#050915] rounded-2xl p-4.5 border border-slate-950 shadow-inner mb-5">
                      <div className="flex flex-col items-center flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/85 flex items-center justify-center overflow-hidden mb-2 shadow-md">
                          {match.homeTeam?.imageUrl ? (
                            <img
                              src={`/uploads/misc/${match.homeTeam.imageUrl}`}
                              alt={match.homeTeam.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-black text-emerald-400 font-mono">
                              {match.homeTeam?.shortName || "H"}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-black text-slate-200 truncate w-full text-center font-outfit uppercase tracking-wide">
                          {match.homeTeam?.name || "Home"}
                        </span>
                      </div>

                      <div className="px-4 text-center">
                        <span className="text-xl font-black font-mono tracking-widest text-slate-100 bg-slate-950 border border-slate-900 px-3.5 py-1 rounded-xl shadow-md">
                          {match.score?.home ?? 0} - {match.score?.away ?? 0}
                        </span>
                        <p className="text-[7px] font-black font-mono text-slate-500 mt-2 uppercase tracking-widest">
                          Score
                        </p>
                      </div>

                      <div className="flex flex-col items-center flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/85 flex items-center justify-center overflow-hidden mb-2 shadow-md">
                          {match.awayTeam?.imageUrl ? (
                            <img
                              src={`/uploads/misc/${match.awayTeam.imageUrl}`}
                              alt={match.awayTeam.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-black text-emerald-400 font-mono">
                              {match.awayTeam?.shortName || "A"}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-black text-slate-200 truncate w-full text-center font-outfit uppercase tracking-wide">
                          {match.awayTeam?.name || "Away"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap justify-between items-center pt-3 border-t border-slate-900 gap-3">
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {formattedDate}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/create-match?edit=${match.id}`}
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-400 bg-slate-900 border border-slate-850 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition duration-150"
                          title="Edit Match Setup"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            triggerDeleteMatch(match.id);
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 bg-slate-900 border border-slate-850 hover:bg-rose-500/10 hover:border-rose-500/20 transition duration-150"
                          title="Delete Match Workspace"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          to={`/match/${match.id}`}
                          className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-black uppercase tracking-widest rounded-xl text-[9px] transition-all duration-200 font-outfit shadow-sm shadow-emerald-500/5"
                        >
                          Console
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
