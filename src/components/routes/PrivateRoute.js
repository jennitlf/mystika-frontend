import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, checkTokenValidity } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    checkTokenValidity(); 
  }, [location, checkTokenValidity]); 

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    if (location.pathname.startsWith('/consultor')) {
      return <Navigate to="/consultor/login" />;
    }
    return <Navigate to="/usuario/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;