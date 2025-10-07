import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  const login = (email, token) => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);