import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { API } from "../../config";
import "../../css/consultant/scheduleConsultant.css";


const ScheduleConsultant = () => {
    const [schedules, setSchedules] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSpecialties, setLoadingSpecialties] = useState(true);
    const { token, user } = useContext(AuthContext);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [ showModalAdd, setShowModalAdd] = useState(true)
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await fetch(`${API}consultant-specialty?idConsultant=${user.id}&page=1&limit=9`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Não foi possível buscar suas especialidades.");
                }
                const data = await response.json();
                setSpecialties(data.data);
            } catch (error) {
                console.error("Erro ao buscar especialidades:", error);
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, [token, user.id]);

    const fetchSchedule = async (specialtyId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API}schedule-consultant/${specialtyId}/timeslots`, {
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
            setSchedules(data);
            const dates = data.map((schedule) => new Date(schedule.date));
            setHighlightedDates(dates);
        } catch (error) {
            console.error("Erro ao buscar consultas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSpecialtyChange = (event) => {
        const specialtyId = event.target.value;
        setSelectedSpecialty(specialtyId);
        setSchedules([]);
        setHighlightedDates([]);
        setSelectedDate(null);
        setAvailableTimes([]);
        if (specialtyId) {
            fetchSchedule(specialtyId);
        }
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const selectedSchedule = schedules.find(
            (schedule) => new Date(schedule.date).toDateString() === date.toDateString()
        );
        setAvailableTimes(selectedSchedule ? selectedSchedule.available_times : []);
        setShowModal(true); 
    };

    const onSubmit = async (data) => {
      try {
          const response = await fetch(`${API}schedule-consultant/recurring`, {
              method: "PUT",
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });
  
          if (response.ok) {
              toast.success("Agenda cadastrada!");
          } else {
              const errorData = await response.json();
              console.error("Erro no backend:", errorData);
              throw new Error("Erro ao atualizar dados");
          }
      } catch (error) {
          console.error("Erro ao salvar agenda", error);
          toast.error("Erro ao salvar agenda");
      }
  };

    return (
        <div className="container-scheduleConsultant-consultant">
            <div className="subcontainer-consultation-consultant">
                <div className="content-filter-schedule-consultant">
                    <div className="box-filter-specilaty-schedule-consultant">
                        <div className="filter-specialty-consultation-consultant">
                            <select
                                name="filter-specialty-consultation-consultant"
                                value={selectedSpecialty}
                                onChange={handleSpecialtyChange}
                            >
                                <option value="">Selecione a especialidade</option>
                                {loadingSpecialties ? (
                                    <option>Carregando...</option>
                                ) : specialties.length > 0 ? (
                                    specialties.map((specialty) => (
                                        <option
                                            key={specialty.id}
                                            value={specialty.id}
                                        >
                                            {specialty.specialty.name_specialty}
                                        </option>
                                    ))
                                ) : (
                                    <option>Você ainda não possui especialidades cadastradas!</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="container-button-add-schedule-consultant">
                      <button className="button-add-schedule-consultant" onClick={()=>setShowModalAdd(!showModalAdd)}>
                        <span className="material-symbols-outlined">add</span>Add
                      </button>
                    </div>
                </div>

                <div className="content-schedule-consultant">
                    {selectedSpecialty === "" ? (
                        <p>Selecione uma especialidade</p>
                    ) : loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            <Calendar
                                onChange={handleDateClick}
                                value={selectedDate}
                                tileClassName={({ date }) =>
                                    highlightedDates.some(
                                        (d) => d.toDateString() === date.toDateString()
                                    )
                                        ? "highlight"
                                        : ""
                                }
                            />
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-schedule-consultant">
                    <div className="modal-content-schedule-consultant">
                        <button className="close-modal-schedule-consultant" onClick={() => setShowModal(false)}>
                            &times;
                        </button>
                        <h3>Horários disponíveis para {selectedDate.toLocaleDateString()}</h3>
                        <div className="container-time-timeslot-schedule-consultant">
                            {availableTimes.length > 0 ? (
                                availableTimes.map((time, index) => (
                                    <div key={index} className="timeslot-schedule-consultant">
                                        {time}
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum horário disponível para esta data.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showModalAdd && (
              <div className="modal-container-add-schedule-consultant" >
                <div className="sub-container-add-schedule-consultant" >
                  <button className="close-modal-schedule-consultant" onClick={() => setShowModalAdd(false)}>
                  &times;
                  </button>
                  <form onSubmit={handleSubmit(onSubmit)} className="add-form-schedule-consultant">
                    <div className="content-add-specialty-schedule-consultant">
                      <Controller
                      name="specialtyId"
                      control={control}
                      rules={{ required: "Especialidade é obrigatório" }}
                      defaultValue={""}
                      render={({ field }) => (
                          <select
                              {...field}
                              className={`add-select-schedule-consultant ${errors.specialtyId ? "input-error" : ""}`}
                          >
                              <option value="">Selecione a especialidade</option>
                              {loadingSpecialties ? (
                                  <option>Carregando...</option>
                              ) : specialties.length > 0 ? (
                                  specialties.map((specialty) => (
                                      <option key={specialty.id} value={specialty.id}>
                                          {specialty.specialty.name_specialty}
                                      </option>
                                  ))
                              ) : (
                                  <option>Você ainda não possui especialidades cadastradas!</option>
                              )}
                          </select>
                      )}
                      />
                    </div>
                    <div className="content-add-field-schedule-consultant">
                      <Controller
                      name="dateInitial"
                      control={control}
                      rules={{ required: "Data inicial é obrigatório"}}
                      defaultValue={"dateInitial-add-date-schedule-consultant"}
                      render={({ field })=> (
                        <input
                        {...field}
                        type="date"
                        className="dateInitial-add-date-schedule-consultant"
                        />
                      )}
                      />
                    </div>
                    <div className="content-add-field-schedule-consultant">
                      <Controller
                      name="dateFinal"
                      control={control}
                      rules={{ required: "Data final é obrigatório"}}
                      defaultValue={""}
                      render={({ field })=>(
                        <input
                        {...field}
                        type="date"
                        className="dateFinal-add-hour-schedule-consultant"
                        />
                      )}
                      />
                    </div>
                    <div className="content-add-field-schedule-consultant">
                      <Controller
                      name="hourInitial"
                      control={control}
                      rules={{ required: "Hora inicial é obrigatório"}}
                      defaultValue={""}
                      render={({ field })=>(
                        <input
                        {...field}
                        type="time"
                        className="hourInitial-add-hour-schedule-consultant"
                        />
                      )}
                      />
                    </div>
                    <div className="content-add-field-schedule-consultant">
                      <Controller
                      name="hourFinal"
                      control={control}
                      rules={{ required: "Hora final é obrigatório"}}
                      defaultValue={""}
                      render={({ field })=>(
                        <input
                        {...field}
                        type="time"
                        className="hourFinal-add-hour-schedule-consultant"
                        />
                      )}
                      />
                    </div>
                    <div >
                      <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Hora final é obrigatório"}}
                      defaultValue={"ativo"}
                      render={({ field })=>(
                        <input
                        {...field}
                        type="text"
                        className="add-status-schedule-consultant"
                        disabled
                        />
                      )}
                      />
                    </div>
                    <div className="content-add-button-submit-schedule-consultant">
                     <button type="submit" className="add-button-submit-schedule-consultant">salvar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>
    );
};

export default ScheduleConsultant;
