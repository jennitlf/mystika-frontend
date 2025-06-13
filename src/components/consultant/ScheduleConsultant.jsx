import React, {useState, useEffect, useContext} from "react";
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext'
import { API } from "../../config";
import '../../css/consultant/scheduleConsultant.css'

const ScheduleConsultant = () => {
    const [ schedules, setSchedule ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const { token } = useContext(AuthContext);
    // buscar especialidades do consultor: exibir no array.
    // buscar agenda com id do consultor especialidade
    // exibir as datas e horários
    useEffect(() => {
        const fetchSchedule = async () => {
          try {
            const response = await fetch(`${API}{idConsultantSpecialty}/timeslots`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
              throw new Error("Não foi possível buscar suas consultas.");
            }
            const data = await response.json();
            console.log("Consultas:", data.data);
            setSchedule(data.data);
          } catch (error) {
            console.error("Erro ao buscar consultas:", error);
            
          } finally {
            setLoading(false);
          }
        };
    
        // fetchSchedule();
      }, [token])
    return(
        <div className="container-scheduleConsultant-consultant">

        </div>
    )
}

export default ScheduleConsultant;