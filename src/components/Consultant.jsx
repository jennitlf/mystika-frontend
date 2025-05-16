import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Consultant.css";
import { API } from "../config";
import { AuthContext } from "../context/AuthContext";
import { toast } from 'react-toastify';

const Consultant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const { token, user } = useContext(AuthContext);
 
  // Função para converter a string de data para um objeto Date local
  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Função para agrupar os horários disponíveis por data
  const groupScheduleByDate = (schedule) => {
    return schedule.reduce((acc, slot) => {
      const dateKey = slot.date;
      if (!acc[dateKey]) {
        acc[dateKey] = { 
          date: slot.date,
          schedule_id: slot.schedule_id,
          available_times: [...slot.available_times] 
        };
      } else {
        // Apenas agrupa os horários, sem alterar o schedule_id já definido
        acc[dateKey].available_times = Array.from(
          new Set([...acc[dateKey].available_times, ...slot.available_times])
        );
      }
      // Ordena os horários em ordem crescente
      acc[dateKey].available_times.sort((a, b) => a.localeCompare(b));
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        const response = await fetch(
          `${API}/consultant-specialty?idConsultant=${id}&page=1&limit=9`
        );
        const data = await response.json();
        setConsultant(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultant();

  }, [id]);

  const handleSpecialtyClick = async (idConsultantSpecialty) => {
    try {
      setAvailableTimes([]);
      setSelectedDateTime(null);
      const response = await fetch(
        `${API}/schedule-consultant/${idConsultantSpecialty}/timeslots`
      );
      const data = await response.json();
      // Agrupar os horários por data e ordenar as datas em ordem crescente
      const grouped = groupScheduleByDate(data);
      const groupedSchedule = Object.values(grouped);
      groupedSchedule.sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordena as datas
      setSchedule(groupedSchedule);
      setSelectedSpecialty(idConsultantSpecialty);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const handleDateClick = (date) => {
    const times =
      schedule.find((slot) => slot.date === date)?.available_times || [];
    setAvailableTimes(times);
    setSelectedDateTime({ date, time: null });
  };
  const handleTimeClick = (time) => {
    setSelectedDateTime((prev) => ({ ...prev, time }));
  };
  if (loading) {
    return <p>Carregando consultores...</p>;
  }

  const postConsultation = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedSpecialty || !selectedDateTime?.date || !selectedDateTime?.time) {
      toast.error("Por favor, selecione uma especialidade, data e horário.");
      return;
    }
    const selectedSchedule = schedule.find((slot) => slot.date === selectedDateTime.date);
    if (!selectedSchedule) {
      toast.error("Horário inválido ou indisponível.");
      return;
    }
    const data = {
      id_consultant_specialty: selectedSpecialty,
      id_schedule_consultant: selectedSchedule.schedule_id, 
      appoinment_time: selectedDateTime.time, 
      appoinment_date: selectedDateTime.date, 
    };
    try {
      const response = await fetch(`${API}/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao marcar consulta.");
      }
  
      toast.success("Consulta marcada com sucesso!");
      navigate(`/consultor/${id}`);
    } catch (error) {
      console.error("Erro ao marcar consulta:", error);
      toast.error("Erro ao marcar consulta.");
    }
  };
  return (
    <div className="content-consultant">
      <div className="container-1">
        <div className="image">
          <img
            src={consultant[0].consultant.image_consultant}
            alt="foto do consultor"
          />
        </div>
        <div className="name-assessment-status">
          <div className="name-assessment">
            <div className="name-assessment-sub">
              <p className="name-consultant">
                {consultant[0].consultant.name}
              </p>{" "}
              <div className="status">Online</div>
            </div>
            <div className="assessment">
              <i className="material-icons star">star</i>
              <i className="material-icons star">star</i>
              <i className="material-icons star">star</i>
              <i className="material-icons star">star</i>
              <i className="material-icons star">star</i>
            </div>
            <div className="content-occurred">
              <p>Consultas Realizadas</p>
              <div className="content-occurred-sub">
                <i className="material-icons occurred">question_answer</i>
                <p>{consultant[0].consultant.consultations_carried_out}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-2">
        <div className="data-profile">
          <h3>Sobre o especialista</h3>
          <p>{consultant[0].consultant.profile_data}</p>
          <h3>Sobre suas especialidades</h3>
          <p>{consultant[0].consultant.about_specialties}</p>
          <h3>História</h3>
          <p>{consultant[0].consultant.consultants_story}</p>
        </div>
        <div className="c-specialties">
          <h3>Selecione uma especialidade:</h3>
          {consultant.map((specialty) => (
            <div
              id={specialty.id}
              key={specialty.specialty.name_specialty}
              className="c-specialties-unit"
              onClick={() => handleSpecialtyClick(specialty.id)}
            >
              <h2>{specialty.specialty.name_specialty}</h2>
              <div>
                <p>Duração: {specialty.duration} minutos</p>
                <p>Valor: R${specialty.value_per_duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="container-close-button">
              <button className="close-button" onClick={() => setShowModal(false)}>
                x
              </button>
            </div>
            <h3>Selecione uma data</h3>
            <div className="calendar">
              {schedule && schedule.length > 0 ? (
                schedule.map((slot) => (
                  <div
                    key={slot.date}
                    className="calendar-day"
                    onClick={() => handleDateClick(slot.date)}
                    style={{ opacity: slot.available_times.length ? 1 : 0.3 }}
                  >
                    {parseLocalDate(slot.date).toLocaleDateString("pt-BR")}
                  </div>
                ))
              ) : (
                <p>
                  Sem horários disponíveis para essa especialidade. Tente mais
                  tarde!
                </p>
              )}
            </div>
            {availableTimes.length > 0 && (
              <div className="times">
                <h4>Horários disponíveis:</h4>
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    className={`time-button ${
                      selectedDateTime?.time === time ? "selected" : ""
                    }`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
            <button
            onClick={postConsultation}
              className="schedule-button"
              disabled={!selectedDateTime?.date || !selectedDateTime?.time}
            >
              Marcar Consulta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultant;
