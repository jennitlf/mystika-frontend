import React, { createContext, useState, useEffect, useCallback } from 'react';
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
        tokenExp: decoded.exp,
      };
    }
    return null;
  } catch (error) {
    console.error("Token inválido ou malformado:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiresAt, setTokenExpiresAt] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTokenExpiresAt(null); 
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresAt'); 
    window.location.reload(); 
  }, []);

  const checkTokenValidity = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    const storedExpiresAt = localStorage.getItem('tokenExpiresAt');

    if (!storedToken || !storedExpiresAt) {
      if (user || token) { 
        console.log("Token ou expiração ausentes. Forçando logout.");
        logout();
      }
      return false;
    }

    const userData = getUserFromToken(storedToken);
    const expiresAtNum = parseInt(storedExpiresAt, 10);
    const now = Date.now();

    if (!userData || now >= expiresAtNum) {
      console.log("Token expirado ou inválido (verificação manual). Forçando logout.");
      logout();
      return false;
    }

    if (!user || user.id !== userData.id) {
      setUser(userData);
      setToken(storedToken);
      setTokenExpiresAt(expiresAtNum);
    }

    return true;
  }, [user, token, logout]);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedExpiresAt = localStorage.getItem('tokenExpiresAt');

    if (storedToken && storedExpiresAt) {
      const userData = getUserFromToken(storedToken);
      const expiresAtNum = parseInt(storedExpiresAt, 10);

      if (userData && Date.now() < expiresAtNum) {
        setUser(userData);
        setToken(storedToken);
        setTokenExpiresAt(expiresAtNum);
      } else {
        console.log("Token expirado ou inválido ao carregar. Realizando logout.");
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    let timer;
    if (token && tokenExpiresAt) {
      const currentTime = Date.now();
      const timeToExpiration = tokenExpiresAt - currentTime;

      if (timeToExpiration <= 0) {
        console.log("Token expirou agora. Realizando logout.");
        logout();
      } else {
        timer = setTimeout(() => {
          console.log("Token expirou (timeout). Realizando logout.");
          logout();
        }, timeToExpiration);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [token, tokenExpiresAt, logout]);

  const login = useCallback((newToken, newExpiresAt) => {
    const userData = getUserFromToken(newToken);
    if (userData) {
      const expiresAtMillis = newExpiresAt; 

      setUser(userData);
      setToken(newToken);
      setTokenExpiresAt(expiresAtMillis);
      localStorage.setItem('token', newToken);
      localStorage.setItem('tokenExpiresAt', expiresAtMillis.toString());
    } else {
      console.error("Token inválido fornecido no login.");
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, tokenExpiresAt, login, logout, loading, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  );
};