import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/api';
import { parseApiError } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // Initialize the CSRF token on application load
      await authService.init();
      // Fetch the current user session
      const data = await authService.getMe();
      setUser(data.user);
    } catch (error) {
      // Expect 401 errors if the user is not logged in.
      // Reset user state to null in such cases.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    return authService.register(formData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isEmployer: user?.role === 'employer',
      isJobSeeker: user?.role === 'jobseeker',
      login,
      register,
      logout,
      refreshUser,
      parseApiError,
    }),
    [user, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
