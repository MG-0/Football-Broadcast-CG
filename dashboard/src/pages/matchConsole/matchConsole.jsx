import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import useMatchConsole from "./useMatchConsole";
import { useAuth } from "../../context/AuthContext";

// Import Lucide Icons (removed XCircle since button is moved)
import { ChevronLeft, Menu, Monitor, LogOut } from "lucide-react";

// Import menuItems configuration
import { menuItems } from "./config/layersConfig";

export default function MatchConsole() {
  const {
    id,
    matchData,
    isLoading,
    overLayStates,
    toggleOverlay,
    refreshMatchData,
    clearAllGraphics,
  } = useMatchConsole();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { logout } = useAuth();

  // Auto-close sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#12183d] via-[#090b1a] to-[#0b2f3d] text-slate-100 flex flex-col overflow-hidden select-none font-inter font-sans relative">
      {/* Dynamic Ambient Glow Blobs - Premium Bright Mesh Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-75">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-indigo-500/30 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full bg-cyan-400/25 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-[130px] pointer-events-none" />
        <div className="absolute top-2/3 left-10 w-[500px] h-[500px] rounded-full bg-purple-500/25 blur-[120px] pointer-events-none" />
      </div>

      {/* Top Navigation Bar (Header) */}
      <header className="h-16 bg-[#080d1a] border-b border-slate-850 px-4 md:px-6 flex justify-between items-center shrink-0 z-40 shadow-lg relative">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 transition-all duration-200 shadow-md active:scale-95 group shrink-0"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border transition-all duration-200 shadow-md active:scale-95 group shrink-0 ${
              isSidebarOpen
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            }`}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Brand Tagline & Dynamic Match Title */}
          <div className="flex items-center gap-3 ml-1.5 min-w-0">
            <span className="text-[10px] font-black text-emerald-400 font-mono tracking-widest uppercase bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10 hidden xl:inline-block shrink-0">
              National Football Network CG
            </span>
            <span className="text-slate-650 hidden xl:inline-block select-none">
              |
            </span>
            <h1 className="text-xs md:text-sm font-black tracking-wider uppercase text-slate-200 font-outfit truncate max-w-[110px] sm:max-w-[200px] md:max-w-xs lg:max-w-md">
              {matchData
                ? `${matchData.homeTeam?.name} vs ${matchData.awayTeam?.name}`
                : "Loading..."}
            </h1>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Logout Button */}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-red-500/30 hover:scale-[1.03] active:scale-95 font-outfit group cursor-pointer"
          >
            <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          {/* Monitor Overlay Button */}
          <button
            type="button"
            onClick={() =>
              window.open(
                `/overlay-live/index.html?id=${id}`,
              )
            }
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 font-outfit group cursor-pointer"
          >
            <Monitor className="w-4 h-4 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6" />
            <span className="hidden sm:inline">Open CG</span>
          </button>

          {/* Socket Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-1.5 bg-slate-950 border border-slate-850 rounded-xl">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest hidden sm:inline">
              Socket
            </span>
          </div>
        </div>
      </header>

      {/* Panel Workspace Area */}
      <div className="flex-grow flex min-h-0 overflow-hidden relative">
        {/* Clickable Backdrop Overlay (Mobile/Tablet only) */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 top-16 bg-black/50 backdrop-blur-xs z-25 transition-opacity duration-300"
          />
        )}

        {/* Left Sidebar Menu */}
        <aside
          className={`bg-slate-900/50 backdrop-blur-md flex flex-col shrink-0 z-30 shadow-xl overflow-y-auto transition-all duration-300 ease-in-out lg:relative absolute top-0 bottom-0 left-0 ${
            isSidebarOpen
              ? "w-64 xl:w-72 opacity-100 border-r border-slate-850"
              : "w-0 opacity-0 border-r-0 pointer-events-none"
          }`}
        >
          <nav className="p-3 space-y-1.5 flex-grow">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const targetPath = item.path
                ? `/match/${id}/${item.path}`
                : `/match/${id}`;

              return (
                <NavLink
                  key={item.path}
                  to={targetPath}
                  end={item.end}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all duration-150 font-outfit border ${
                      isActive
                        ? "text-emerald-400 border-emerald-500/30 bg-[#0e1629] shadow-md shadow-emerald-500/5"
                        : "text-slate-400 bg-[#070c19]/70 border-slate-900/80 hover:bg-[#0e1629]/50 hover:text-slate-200 hover:border-slate-800"
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  <span className="flex-grow truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Right Main Viewport */}
        <main className="flex-grow bg-slate-950/10 p-4 md:p-5 lg:p-6 overflow-y-auto relative flex flex-col min-w-0 z-10">
          <div className="relative z-10 flex-grow flex flex-col">
            {isLoading ? (
              <div className="flex-grow flex items-center justify-center text-xs text-slate-500 font-mono">
                Synchronizing Console Workspace Details...
              </div>
            ) : (
              <Outlet
                context={{
                  id,
                  matchData,
                  isLoading,
                  overLayStates,
                  toggleOverlay,
                  refreshMatchData,
                  clearAllGraphics, // Pass down clearAllGraphics to children pages
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
