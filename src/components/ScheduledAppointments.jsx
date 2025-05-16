import React, { useContext, useEffect, useState } from "react";
import '../css/ScheduledAppointments.css';
import { AuthContext } from '../context/AuthContext.js';
import { API } from "../config.js";

const ScheduledAppointments = () => {

    const { user, token } = useContext(AuthContext)
    const [ consultations, setConsultations ] = useState("")
    const [ loading, setLoading ] = useState(true)

    useEffect(()=>{
        const schedules = async () =>{
            try {
                const response = await fetch(`${API}/consultation?idCustomer=${user.id}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });
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
    }, [])
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
        return <p>Carregando consultas</p>
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
            {consultations.map((consultation)=>
        <div key={consultation.id} className="content-scheduledAppointments">
            <p>{consultation.consultantSpecialty.specialty.name_specialty}</p>
            <p>{formatDate(consultation.appoinment_date)}</p>
            <p>{consultation.appoinment_time}</p>
            <p>{consultation.consultantSpecialty.duration} min</p>
            <p>R${consultation.consultantSpecialty.value_per_duration},00</p>
            <p>{translateStatus(consultation.status)}</p>
        </div>    
        )}
        </div>
    )
};

export default ScheduledAppointments;