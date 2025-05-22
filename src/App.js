import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './components/routes/PrivateRoute.js';
import Header from './components/Header.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Consultant from './components/Consultant.jsx';
import MyData from './components/MyData.jsx';
import HeaderMobile from './components/HeaderMobile.jsx';
import Home from './components/Home.jsx';
import Support from './components/Support.jsx';
import SupportDetails from './components/SupportDetails.jsx'; // Importe o novo componente
import { ToastContainer } from 'react-toastify';
import './toastfy.css';

export default function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

function App() {
  const isDesktop = useMediaQuery({ query: '(max-width: 670px)' });
  const location = useLocation();

  const noHeaderRoutes = ['/login', '/register'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showHeader && (isDesktop ? <HeaderMobile /> : <Header />)}
      <Routes>
        <Route path="/" element={<Navigate to="/consultores" />} />
        <Route path="/consultores" element={<Home />} />
        <Route
          path="/meus-dados"
          element={
            <PrivateRoute>
              <MyData />
            </PrivateRoute>
          }
        />
        <Route
          path="/ajuda"
          element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          }
        />
        <Route
          path="/ajuda/detalhes/:id"
          element={
            <PrivateRoute>
              <SupportDetails />
            </PrivateRoute>
          }
        />
        <Route path="/consultor/:id" element={<Consultant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose="1000"
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
      />
    </div>
  );
}
