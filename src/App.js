import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './components/routes/PrivateRoute.js';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Consultant from './components/Consultant.jsx';
import DataUser from './components/DataUser.jsx';
import ScheduledAppointments from './components/ScheduledAppointments.jsx';
import HeaderMobile from './components/HeaderMobile.jsx';
import Home from './components/Home.jsx';
import SupportForm from './components/SupportForm.jsx';
import SupportList from './components/SupportList.jsx';
import SupportDetails from './components/SupportDetails.jsx';
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

  return (
    <div className="App">
      <HeaderMobile />
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
