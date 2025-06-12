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
import LoginConsultant from './components/consultant/LoginConsultant.jsx';
import DataUserConsultant from './components/consultant/DataUserConsultant.jsx';
import MySpecialties from './components/consultant/MySpecialties.jsx';
import ScheduleConsultant from './components/consultant/ScheduleConsultant.jsx';
import FinanceConsultant from './components/consultant/FinanceConsultant.jsx';
import NewSupportConsultant from './components/consultant/NewSupportConsultant.jsx';
import SupportListConsultant from './components/consultant/SupportListConsultant.jsx';
import RegisterConsultant from './components/consultant/RegisterConsultant.jsx';
import ConsultationsConsultant from './components/consultant/consultationsConsultant.jsx'
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
            <PrivateRoute allowedRoles={['user']}>
              <DataUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/consultas-agendadas"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <ScheduledAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/solicitacoes-de-supote"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <SupportList />
            </PrivateRoute>
          }
        />
        <Route
          path="/formulario-de-ajuda"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <SupportForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/ajuda/detalhes/:id"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <SupportDetails />
            </PrivateRoute>
          }
        />
        {/* rotas consultant */}
        <Route
        path="/consultor/consultas-agendadas"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <ConsultationsConsultant />
          </PrivateRoute>
        }
        />
        <Route
        path="/consultor/dados-do-perfil"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <DataUserConsultant />
          </PrivateRoute>
        }
        />
        <Route
        path="/consultor/especialidades"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <MySpecialties />
          </PrivateRoute>
        }
        />
        <Route
        path="/consultor/agenda"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <ScheduleConsultant />
          </PrivateRoute>
        }
        />
        <Route
        path="/consultor/financeiro"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <FinanceConsultant />
          </PrivateRoute>
        }
        />
        <Route
        path="/consultor/suportes"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <SupportListConsultant />
          </PrivateRoute>
        }
        />
        <Route
        path="/consultor/novo-suporte"
        element={
          <PrivateRoute allowedRoles={['consultant']}>
            <NewSupportConsultant />
          </PrivateRoute>
        }
        />

        {/* rotas publicas */}
        <Route path="/consultor/:id" element={<Consultant />} />
        <Route path="usuario/login" element={<Login />} />
        <Route path="usuario/register" element={<Register />} />
        <Route path="consultor/login" element={<LoginConsultant />} />
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
