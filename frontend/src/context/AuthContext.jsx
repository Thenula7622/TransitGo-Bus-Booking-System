import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('transitgo_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('transitgo_user');
      }
    }
  }, []);

  const login = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem('transitgo_user', JSON.stringify(userData));
    if (token) localStorage.setItem('transitgo_token', token);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('transitgo_user');
    localStorage.removeItem('transitgo_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);