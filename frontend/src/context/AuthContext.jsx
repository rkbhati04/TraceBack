import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('traceback_token'));
  const [loading, setLoading] = useState(true);

  // Decode JWT to extract basic user info (username, role)
  const decodeToken = useCallback((jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return {
        username: payload.sub,
        role: payload.role || null,
        exp: payload.exp,
      };
    } catch {
      return null;
    }
  }, []);

  // Try to load user info from token on mount
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        // Try to fetch full user info from /auth/me endpoint
        authAPI.me()
          .then((res) => {
            setUser(res.data);
          })
          .catch(() => {
            // Fallback to decoded token info
            setUser(decoded);
          })
          .finally(() => setLoading(false));
      } else {
        // Token expired — clean up
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const jwt = response.data.token;
    localStorage.setItem('traceback_token', jwt);
    setToken(jwt);

    // Fetch full user info
    try {
      const meRes = await authAPI.me();
      setUser(meRes.data);
    } catch {
      // Fallback to decoded JWT
      const decoded = decodeToken(jwt);
      setUser(decoded);
    }

    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('traceback_token');
    localStorage.removeItem('traceback_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
