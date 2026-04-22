import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('giftbloom_token');
    const savedUser = localStorage.getItem('giftbloom_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('giftbloom_token', userToken);
    localStorage.setItem('giftbloom_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('giftbloom_token');
    localStorage.removeItem('giftbloom_user');
    localStorage.removeItem('giftbloom_cart');
  };

  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);