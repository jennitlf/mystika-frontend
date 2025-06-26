import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/user/Consultant.css";
import { API } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Consultant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [consultantData, setConsultantData] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [currentConsultantSpecialtyId, setCurrentConsultantSpecialtyId] = useState(null);
  const { token, user } = useContext(AuthContext);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [calendarDate, setCalendarDate] = useState(new Date());

  const getYYYYMMDD = (isoString) => isoString.split('T')[0];

  const groupScheduleByDate = useCallback((fetchedSchedule) => {
    const grouped = {};
    fetchedSchedule.forEach(slot => {
      const originalIsoDateString = slot.date;
      const dateKey = getYYYYMMDD(originalIsoDateString);

      const uniqueKey = `${dateKey}-${slot.schedule_id}`;

      if (!grouped[uniqueKey]) {
        grouped[uniqueKey] = {
          originalIsoDateString: originalIsoDateString,
          displayDate: new Date(originalIsoDateString),
          schedule_id: slot.schedule_id,
          available_times: [...slot.available_times]
        };
      } else {
        const newTimes = slot.available_times.filter(time => !grouped[uniqueKey].available_times.includes(time));
        grouped[uniqueKey].available_times = [...grouped[uniqueKey].available_times, ...newTimes];
      }
      grouped[uniqueKey].available_times.sort((a, b) => a.localeCompare(b));
    });
    return Object.values(grouped);
  }, []);

  const fetchScheduleForSpecialty = useCallback(async (idConsultantSpecialty) => {
    try {
      setAvailableTimes([]);
      setSelectedDateTime(null);
      const response = await fetch(
        `${API}schedule-consultant/${idConsultantSpecialty}/timeslots/${encodeURIComponent(userTimeZone)}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error fetching schedule: ${response.status} - ${errorText}`);
        throw new Error("Erro ao buscar horários de agendamento.");
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        toast.error("Formato de dados de agendamento inesperado.");
        setSchedule([]);
        setShowModal(false);
        return;
      }

      const groupedSchedule = groupScheduleByDate(data);
      
      groupedSchedule.sort((a, b) => a.displayDate.getTime() - b.displayDate.getTime());
      
      setSchedule(groupedSchedule);
      setShowModal(true);
      if (groupedSchedule.length > 0) {
        setCalendarDate(groupedSchedule[0].displayDate);
      } else {
        setCalendarDate(new Date());
      }

    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Erro ao carregar horários disponíveis.");
      setShowModal(false);
    }
  }, [userTimeZone, groupScheduleByDate]);

  useEffect(() => {
    const fetchConsultant = async () => {
      const numericId = parseInt(id);

      if (!id || isNaN(numericId) || id === "solicitacoes-de-supote") {
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

  const handleSpecialtyClick = (idConsultantSpecialty) => {
    setCurrentConsultantSpecialtyId(idConsultantSpecialty);
    fetchScheduleForSpecialty(idConsultantSpecialty);
  };

  const handleDateChange = (date) => {
    const dateKey = getYYYYMMDD(date.toISOString());
    const slotsForSelectedDate = schedule.filter(slot => getYYYYMMDD(slot.originalIsoDateString) === dateKey);
    
    if (slotsForSelectedDate.length > 0) {
      let allAvailableTimes = [];
      slotsForSelectedDate.forEach(slot => {
        allAvailableTimes = [...allAvailableTimes, ...slot.available_times.map(time => ({ time, schedule_id: slot.schedule_id }))];
      });
      allAvailableTimes.sort((a, b) => a.time.localeCompare(b.time));

      setAvailableTimes(allAvailableTimes);
      
      setSelectedDateTime({ 
        date: date.toISOString(),
        time: null,
        schedule_id: null
      });
    } else {
      setAvailableTimes([]);
      setSelectedDateTime(null);
      toast.info("Nenhum horário disponível para esta data.");
    }
    setCalendarDate(date);
  };

  const handleTimeClick = (timeSlot) => {
    setSelectedDateTime((prev) => ({ 
      ...prev, 
      time: timeSlot.time,
      schedule_id: timeSlot.schedule_id
    }));
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
    setButtonLoading(true);
    if (!user) {
      toast.info("Por favor, faça login para marcar uma consulta.");
      navigate('/usuario/login');
      setButtonLoading(false);
      return;
    }
    if (!selectedDateTime?.date || !selectedDateTime?.time || !selectedDateTime?.schedule_id) {
      toast.error("Por favor, selecione uma data e horário para a consulta.");
      setButtonLoading(false);
      return;
    }
    
    const baseDateForTimeSlot = new Date(selectedDateTime.date);
    const [hours, minutes] = selectedDateTime.time.split(':').map(Number);

    const appointmentDateTimeLocal = new Date(
      baseDateForTimeSlot.getFullYear(),
      baseDateForTimeSlot.getMonth(),
      baseDateForTimeSlot.getDate(),
      hours,
      minutes,
      0,
      0
    );

    const appoinment_dateTime_utc = appointmentDateTimeLocal.toISOString();

    const data = {
      id_schedule_consultant: selectedDateTime.schedule_id,
      appoinment_date_time: appoinment_dateTime_utc.toString(),
      appoinment_time: selectedDateTime.time,
      appoinment_date: getYYYYMMDD(selectedDateTime.date),
    };

    try {
      const response = await fetch(`${API}consultation/${encodeURIComponent(userTimeZone)}`, {
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

      if (currentConsultantSpecialtyId) {
        await fetchScheduleForSpecialty(currentConsultantSpecialtyId);
      }
      setShowModal(false);
      setAvailableTimes([]);
      setSelectedDateTime(null);

    } catch (error) {
      console.error("Erro ao marcar consulta:", error);
      toast.error(error.message || "Erro ao marcar consulta.");
    } finally {
      setButtonLoading(false);
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
                <span className="material-symbols-outlined ocurred">forum</span>
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
            <div className="calendar-container">
              {schedule && schedule.length > 0 ? (
                <Calendar
                  onChange={handleDateChange}
                  value={calendarDate}
                  minDate={new Date()}
                  tileDisabled={({ date, view }) =>
                    view === 'month' &&
                    !schedule.some(slot =>
                      getYYYYMMDD(slot.originalIsoDateString) === getYYYYMMDD(date.toISOString()) &&
                      slot.available_times.length > 0
                    )
                  }
                  tileClassName={({ date, view }) =>
                    view === 'month' &&
                    selectedDateTime?.date && getYYYYMMDD(selectedDateTime.date) === getYYYYMMDD(date.toISOString())
                      ? 'selected-date'
                      : null
                  }
                  locale="pt-BR"
                />
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
                  {availableTimes.map((timeSlot) => (
                    <button
                      key={`${timeSlot.time}-${timeSlot.schedule_id}`}
                      className={`time-button ${
                        selectedDateTime?.time === timeSlot.time ? "selected" : ""
                      }`}
                      onClick={() => handleTimeClick(timeSlot)}
                    >
                      {timeSlot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={postConsultation}
              className="schedule-button"
              disabled={!selectedDateTime?.date || !selectedDateTime?.time || !selectedDateTime?.schedule_id || buttonLoading}
            >
              {buttonLoading ? "Carregando..." : "Marcar Consulta"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultant;