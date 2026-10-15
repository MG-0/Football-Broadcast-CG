import { Link } from "react-router-dom";
import useLogin from "./useLogin";

// main login screen component
export default function Login() {
  // state and handlers from login hook
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    authSuccess,
    togglePasswordVisibility,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b12] text-slate-100 font-sans px-4 py-12 relative overflow-hidden select-none">
      {/* Subtle sports pitch lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/20 rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-20" />

        <div className="relative bg-[#0d1527]/95 border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-3 flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-xl">
              <svg
                className="w-7 h-7 text-slate-950"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2v20M2 12h20"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-widest">
              FOOTBALL BROADCAST CG
            </h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-widest mt-1 uppercase">
              Login To Control Panel Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Success notification */}
            {authSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>Login successful!</span>
              </div>
            )}

            {/* Error notifications */}
            {errors.submit && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01"
                  />
                </svg>
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                UserName
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@ftbroadcast.com"
                className={`w-full px-4 py-2.5 bg-[#080d19] border ${
                  errors.email
                    ? "border-rose-500/50 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                } rounded-lg text-slate-100 focus:outline-none focus:ring-4 transition duration-200`}
              />
              {errors.email && (
                <p className="text-xs text-rose-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-4 pr-10 py-2.5 bg-[#080d19] border ${
                    errors.password
                      ? "border-rose-500/50 focus:ring-rose-500/20"
                      : "border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                  } rounded-lg text-slate-100 focus:outline-none focus:ring-4 transition duration-200`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || authSuccess}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold uppercase tracking-wider rounded-lg shadow-lg hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 transition duration-200"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            {/* Register link */}
            <div className="pt-3 text-center border-t border-slate-800/80">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition duration-150"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
