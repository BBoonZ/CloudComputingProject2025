import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: JSON.parse(localStorage.getItem('userData')) || null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const email = localStorage.getItem('userEmail');
      const cachedUser = localStorage.getItem('userData');

      if (!token || !email) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Only fetch if we don't have cached user data
      if (!cachedUser) {
        try {
          const response = await userService.getUserByEmail(email);
          if (response.status === 'success') {
            localStorage.setItem('userData', JSON.stringify(response.data));
            setAuthState({
              isAuthenticated: true,
              user: response.data,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.clear();
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Authentication failed'
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []); // Run only once on mount

  const login = async (email, token) => {
    try {
      const response = await userService.getUserByEmail(email);
      if (response.status === 'success') {
        const userData = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setAuthState({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Login failed',
        isLoading: false
      }));
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
  };

  const refreshUserData = async () => {
    if (!authState.isAuthenticated) return;

    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      const response = await userService.getUserByEmail(email);
      if (response.status === 'success') {
        const userData = response.data;
        localStorage.setItem('userData', JSON.stringify(userData));
        setAuthState(prev => ({
          ...prev,
          user: userData,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  };

  const updateUserDataImmediately = useCallback((newData) => {
    setAuthState(prev => ({
      ...prev,
      user: newData
    }));
    localStorage.setItem('userData', JSON.stringify(newData));
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      refreshUserData,
      updateUserDataImmediately
    }}>
      {!authState.isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
