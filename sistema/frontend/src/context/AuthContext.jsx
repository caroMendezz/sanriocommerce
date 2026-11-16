import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken, removeToken, setToken } from '../api/client';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return undefined;

    let active = true;

    authService
      .me()
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        removeToken();
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      async login(credentials) {
        const data = await authService.login(credentials);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      async register(data) {
        const result = await authService.register(data);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      logout() {
        removeToken();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
