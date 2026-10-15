import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoaderCircle } from "lucide-react";

// router guard component to restrict access to authenticated users
export default function ProtectRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b12]">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="w-10 h-10 text-emerald-400 animate-spin" />

          <div className="text-center">
            <h2 className="text-lg font-bold tracking-wider text-white">
              Loading Dashboard
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
