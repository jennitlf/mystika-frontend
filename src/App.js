import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './components/routes/PrivateRoute.js';
import Register from './components/user/Register.jsx';
import Login from './components/user/Login.jsx';
import Consultant from './components/user/Consultant.jsx';
import DataUser from './components/user/DataUser.jsx';
import ScheduledAppointments from './components/user/ScheduledAppointments.jsx';
import HeaderMobile from './components/user/HeaderMobile.jsx';
import Home from './components/user/Home.jsx';
import SupportForm from './components/user/SupportForm.jsx';
import SupportList from './components/user/SupportList.jsx';
import SupportDetails from './components/user/SupportDetails.jsx';
import RegisterConsultant from './components/consultant/RegisterConsultant.jsx';
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
  const location = useLocation();

  const noHeaderRoutes = ['/usuario/login', '/usuario/register', '/consultor/register', '/consultor/login'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);
  return (
    <div className="App">
      {showHeader &&  <HeaderMobile />}
      <Routes>
        <Route path="/" element={<Navigate to="/consultores" />} />
        <Route path="/consultores" element={<Home />} />
        <Route
          path="/meus-dados"
          element={
            <PrivateRoute>
              <DataUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/consultas-agendadas"
          element={
            <PrivateRoute>
              <ScheduledAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/solicitacoes-de-supote"
          element={
            <PrivateRoute>
              <SupportList />
            </PrivateRoute>
          }
        />
        <Route
          path="/formulario-de-ajuda"
          element={
            <PrivateRoute>
              <SupportForm />
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
        <Route path="usuario/login" element={<Login />} />
        <Route path="usuario/register" element={<Register />} />
        {/* <Route path="consultor/login" element={<Login />} /> */}
        <Route path="consultor/register" element={<RegisterConsultant />} />
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
