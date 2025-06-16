import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/user/Consultant.css";
import { API } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';

const Consultant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [consultantData, setConsultantData] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const { token, user } = useContext(AuthContext);
 
  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

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
        const newTimes = slot.available_times.filter(time => !acc[dateKey].available_times.includes(time));
        acc[dateKey].available_times = [...acc[dateKey].available_times, ...newTimes];
      }
      acc[dateKey].available_times.sort((a, b) => a.localeCompare(b));
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchConsultant = async () => {
      console.log("ID from useParams:", id); 
      
      if (!id || typeof id !== 'string' || id === "solicitacoes-de-supote" || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
        console.error("Invalid consultant ID from URL parameters:", id);
        toast.error("ID do consultor inválido na URL.");
        setLoading(false);
        navigate('/');
        return;
      }

      try {
        const response = await fetch(
          `${API}consultant-specialty?idConsultant=${id}&page=1&limit=9`
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error: ${response.status} - ${errorText}`);
          throw new Error("Erro ao buscar dados do consultor.");
        }
        const data = await response.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          setConsultantData(data.data);
        } else {
          console.warn("Consultant data not found or empty:", data);
          toast.info("Dados do consultor não encontrados.");
          setConsultantData([]);
          navigate('/');
        }
      } catch (error) {
        console.error("Erro ao buscar consultor:", error);
        toast.error("Erro ao carregar perfil do consultor.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultant();

  }, [id, navigate]);

  const handleSpecialtyClick = async (idConsultantSpecialty) => {
    try {
      setAvailableTimes([]);
      setSelectedDateTime(null);
      const response = await fetch(
        `${API}schedule-consultant/${idConsultantSpecialty}/timeslots`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error fetching schedule: ${response.status} - ${errorText}`);
        throw new Error("Erro ao buscar horários de agendamento.");
      }
      const data = await response.json();
      const grouped = groupScheduleByDate(data);
      const groupedSchedule = Object.values(grouped);
      groupedSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSchedule(groupedSchedule);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Erro ao carregar horários disponíveis.");
    }
  };

  const handleDateClick = (date) => {
    const times =
      schedule.find((slot) => slot.date === date)?.available_times || [];
    setAvailableTimes(times);
    setSelectedDateTime((prev) => ({ ...prev, time: null }));
  };

  const handleTimeClick = (time) => {
    setSelectedDateTime((prev) => ({ ...prev, time }));
  };

  if (loading) {
    return <p>Carregando consultor...</p>;
  }

  if (!consultantData || consultantData.length === 0) {
    return (
      <div className="content-consultant-not-found">
        <p>Consultor não encontrado ou dados indisponíveis.</p>
        <button onClick={() => navigate('/')} className="back-home-button">Voltar para a Página Inicial</button>
      </div>
    );
  }

  const consultantDetails = consultantData[0].consultant; 
  if (!consultantDetails) {
    return (
      <div className="content-consultant-not-found">
        <p>Detalhes do consultor indisponíveis.</p>
        <button onClick={() => navigate('/')} className="back-home-button">Voltar para a Página Inicial</button>
      </div>
    );
  }

  const postConsultation = async () => {
    if (!user) {
      toast.info("Por favor, faça login para marcar uma consulta.");
      navigate('/usuario/login');
      return;
    }
    if ( !selectedDateTime?.date || !selectedDateTime?.time) {
      toast.error("Por favor, selecione uma data e horário para a consulta.");
      return;
    }
    const selectedSchedule = schedule.find((slot) => slot.date === selectedDateTime.date);
    if (!selectedSchedule) {
      toast.error("Horário inválido ou indisponível.");
      return;
    }
    const data = {
      id_schedule_consultant: selectedSchedule.schedule_id, 
      appoinment_time: selectedDateTime.time, 
      appoinment_date: selectedDateTime.date, 
    };
    try {
      const response = await fetch(`${API}consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro do servidor ao marcar consulta:", errorData);
        throw new Error(errorData.message || "Erro ao marcar consulta.");
      }
      toast.success("Consulta marcada com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    } catch (error) {
      console.error("Erro ao marcar consulta:", error);
      toast.error(error.message || "Erro ao marcar consulta.");
    }
  };

  return (
    <div className="content-consultant">
      <div className="container-1">
        <div className="image">
          <img
            src={consultantDetails.image_consultant}
            alt="foto do consultor"
          />
        </div>
        <div className="name-assessment-status">
          <div className="name-assessment">
            <div className="name-assessment-sub">
              <p className="name-consultant">
                {consultantDetails.name}
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
                <i className="material-icons occurred">Youtube</i>
                <p>{consultantDetails.consultations_carried_out}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-2">
        <div className="data-profile">
          <h3>Sobre o especialista</h3>
          <p>{consultantDetails.profile_data}</p>
          <h3>Sobre suas especialidades</h3>
          <p>{consultantDetails.about_specialties}</p>
          <h3>História</h3>
          <p>{consultantDetails.consultants_story}</p>
        </div>
        <div className="c-specialties">
          <h3>Selecione uma especialidade:</h3>
          {consultantData.map((specialty) => ( 
            <div
              id={specialty.id}
              key={specialty.id}
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
            <div className="calendar-schedule-consultant">
              {schedule && schedule.length > 0 ? (
                schedule.map((slot) => (
                  <div
                    key={slot.date}
                    className={`calendar-day ${selectedDateTime?.date === slot.date ? 'selected-date' : ''}`}
                    onClick={() => handleDateClick(slot.date)}
                    style={{ opacity: slot.available_times.length ? 1 : 0.6, cursor: slot.available_times.length ? 'pointer' : 'not-allowed' }}
                  >
                    {parseLocalDate(slot.date).toLocaleDateString("pt-BR")}
                  </div>
                ))
              ) : (
                <p className="no-availability-message">
                  Sem horários disponíveis para essa especialidade. Tente mais
                  tarde!
                </p>
              )}
            </div>
            {availableTimes.length > 0 && selectedDateTime?.date && (
              <div className="times">
                <h4>Horários disponíveis:</h4>
                <div className="container-times">
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