import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; 
    if (decoded.exp && decoded.exp > now) {
      return {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
      };
    }
    return null;
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); 
    if (storedToken) {
      const userData = getUserFromToken(storedToken);
      if (userData) {
        setUser(userData);
        setToken(storedToken);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    const userData = getUserFromToken(token);
    if (userData) {
      setUser(userData);
      setToken(token);
      localStorage.setItem('token', token);
    } else {
      console.error("Token inválido fornecido no login.");
      logout();
    }
  };
  

  const logout = () => {
    setUser(null);
    setToken(null);  
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};