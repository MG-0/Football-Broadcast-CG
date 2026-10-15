import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // track authenticated user state
  const [user, setUser] = useState(null);
  // track loading state during authentication check
  const [loading, setLoading] = useState(true);

  // CHECK AUTH
  // check user authentication status against the backend
  const checkAuth = async () => {
    try {
      const response = await api.get("users/me");

      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  // authenticate user with login details and update state
  const login = async (data) => {
    const response = await api.post("users/login", data);

    await checkAuth();

    return response.data;
  };

  // LOGOUT
  // sign out the current user and reset auth state
  const logout = async () => {
    await api.post("users/logout");

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
