import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // track authenticated user state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  // track loading state during authentication check
  const [loading, setLoading] = useState(true);

  // CHECK AUTH
  // check user authentication status against the backend
  const checkAuth = async () => {
    try {
      const response = await api.get("users/me");
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  // authenticate user with login details and update state
  const login = async (data) => {
    const response = await api.post("users/login", data);
    const userData = response.data?.user;
    const token = response.data?.token;

    if (token) {
      localStorage.setItem("token", token);
    }
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    try {
      await checkAuth();
    } catch (e) {
      console.warn("checkAuth error after login:", e);
    }

    return response.data;
  };

  // LOGOUT
  // sign out the current user and reset auth state
  const logout = async () => {
    try {
      await api.post("users/logout");
    } catch {}

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook to access user authentication context
export function useAuth() {
  return useContext(AuthContext);
}
