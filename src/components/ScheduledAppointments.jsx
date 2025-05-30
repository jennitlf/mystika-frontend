import React, { useContext, useEffect, useState } from "react";
import '../css/ScheduledAppointments.css';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from "react-toastify";
import { API } from "../config.js";

const ScheduledAppointments = () => {

    const { token } = useContext(AuthContext)
    const [ consultations, setConsultations ] = useState("")
    const [ loading, setLoading ] = useState(true)

    useEffect(()=>{
        const schedules = async () =>{
            try {
                const response = await fetch(`${API}consultation/byUserId`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });
                if (response.status === 404) {
                  toast.info("Não há consultas agendadas.");
                  setLoading(false);
                  throw new Error("Não há consultas agendadas.");
              }
                if (!response.ok) {
                  throw new Error("Erro ao acessar consultas.");
                }
                const data = await response.json()
                setConsultations(data.data)
                setLoading(false)
              } catch (error) {
                console.error("Erro ao acessar consultas:", error);
              }
        }
        schedules()
    }, [token])
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
      };
    
      const translateStatus = (status) => {
        const statusMap = {
          pending: "Pendente",
          completed: "Concluída",
          canceled: "Cancelada",
        };
        return statusMap[status] || "Desconhecido";
      };
    if(loading) {
        return (
          <div className="container-scheduledAppointments-noItmes">
            <p>Carregando consultas...</p>
          </div>
        )
        
    }
    if(consultations.length < 1){
      return (
        <div className="container-scheduledAppointments-noItmes">
            <p>Nenhum registro</p>
        </div>
      )
    }
    return(
        <div className="container-scheduledAppointments">
            <h3 className="title-scheduledAppointments">Lista de consultas agendadas</h3>
            <div className="header-scheduledAppointments">
                <h4>Especialidade</h4>
                <h4>Dia</h4>
                <h4>Hora</h4>
                <h4>Duração</h4>
                <h4>Valor</h4>
                <h4>status</h4>
            </div>
            <div className="subcontainer-scheduledAppointments" >
              {consultations.map((consultation)=>
              <div key={consultation.id} className="content-scheduledAppointments">
                  <p>{consultation.schedule_consultant.consultant_specialty.specialty.name_specialty}</p>
                  <p>{formatDate(consultation.appoinment_date)}</p>
                  <p>{consultation.appoinment_time}</p>
                  <p>{consultation.schedule_consultant.consultant_specialty.duration} min</p>
                  <p>R${consultation.schedule_consultant.consultant_specialty.value_per_duration},00</p>
                  <p>{translateStatus(consultation.status)}</p>
              </div>    
              )}
            </div>
        </div>
    )
};

export default ScheduledAppointments;