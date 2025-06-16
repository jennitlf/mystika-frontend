import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { API } from "../../config";
import "../../css/consultant/scheduleConsultant.css"; 

const createUTCDateFromYYYYMMDD = (dateString) => {
    if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        console.error("createUTCDateFromYYYYMMDD: Entrada inválida. Esperava string YYYY-MM-DD, mas recebeu:", dateString);
        return null;
    }
    const [year, month, day] = dateString.split("-");
    
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
};

const normalizeDateToUTC = (date) => {
    if (!(date instanceof Date)) { 
        console.error("normalizeDateToUTC: Entrada inválida. Esperava objeto Date, mas recebeu:", date);
        return null;
    }
    
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

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
    const [showModalAdd, setShowModalAdd] = useState(false);
    const { control, handleSubmit, reset, watch, trigger, formState: { errors } } = useForm();

   
    useEffect(() => {
        const fetchSpecialties = async () => {
            setLoadingSpecialties(true);
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
                toast.error("Erro ao carregar especialidades.");
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, [token, user.id]);

    
    const fetchSchedule = async (specialtyId) => {
        if (!specialtyId) {
            setSchedules([]);
            setHighlightedDates([]);
            return;
        }
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
            
            const dates = data.map((schedule) => createUTCDateFromYYYYMMDD(schedule.date)).filter(Boolean); 
            setHighlightedDates(dates);

        } catch (error) {
            console.error("Erro ao buscar consultas:", error);
            toast.error("Erro ao carregar agenda.");
        } finally {
            setLoading(false);
        }
    };

    
    // const selectedDateLocal = selectedDate ? normalizeDateToUTC(selectedDate) : null;

    
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
        const normalizedClickedDate = normalizeDateToUTC(date);
        setSelectedDate(date); 
        const selectedSchedule = schedules.find((schedule) => {
            const scheduleDateObj = createUTCDateFromYYYYMMDD(schedule.date);
            return scheduleDateObj?.getTime() === normalizedClickedDate?.getTime();
        });

        setAvailableTimes(selectedSchedule ? selectedSchedule.available_times : []);
        setShowModal(true);
    };

    
    const onSubmit = async (data) => {
        const formattedData = {
            id_consultant_specialty: Number(data.specialtyId), 
            start_date: data.dateInitial,
            end_date: data.dateFinal,
            hour_initial: data.hourInitial,
            hour_end: data.hourFinal,
            status: data.status,
        };

        try {
            const response = await fetch(`${API}schedule-consultant/recurring`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                toast.success("Agenda cadastrada com sucesso!");
                reset({
                    specialtyId: "",
                    dateInitial: "",
                    dateFinal: "",
                    hourInitial: "",
                    hourFinal: "",
                    status: "ativo",
                });
                trigger();
                setShowModalAdd(false);
                if (selectedSpecialty) {
                    fetchSchedule(selectedSpecialty);
                }
            } else {
                const errorData = await response.json();
                console.error("Erro no backend:", errorData);
                toast.error(errorData.message || "Erro ao salvar agenda. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao salvar agenda", error);
            toast.error("Erro ao salvar agenda. Verifique sua conexão.");
        }
    };

    return (
        <div className="container-scheduleConsultant-consultant">
            <div className="subcontainer-scheduleConsultant-consultant">
                <div className="content-filter-schedule-consultant">
                    <div className="box-filter-specialty-schedule-consultant">
                        <select
                            id="filter-specialty-consultation-consultant"
                            name="filter-specialty-consultation-consultant"
                            value={selectedSpecialty}
                            onChange={handleSpecialtyChange}
                            className="select-filter-specialty-schedule"
                        >
                            <option value="">Selecione a especialidade</option>
                            {loadingSpecialties ? (
                                <option disabled>Carregando especialidades...</option>
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
                                <option disabled>Você ainda não possui especialidades cadastradas!</option>
                            )}
                        </select>
                    </div>
                    <div className="container-button-add-schedule-consultant">
                        <button className="button-add-schedule-consultant" onClick={() => setShowModalAdd(!showModalAdd)}>
                            <span className="material-symbols-outlined">add</span>Adicionar
                        </button>
                    </div>
                </div>

                <div className="content-schedule-consultant">
                    {selectedSpecialty === "" ? (
                        <p className="message-select-specialty">Por favor, selecione uma especialidade para visualizar a agenda.</p>
                    ) : loading ? (
                        <p className="message-loading-schedule">Carregando agenda...</p>
                    ) : (
                        <Calendar
                            onChange={handleDateClick}
                            value={selectedDate}
                            locale="pt-BR"
                            className="custom-react-calendar"
                            tileClassName={({ date, view }) => {
                                if (view === 'month') {
                                    const normalizedTileDate = normalizeDateToUTC(date);
                                    return highlightedDates.some(
                                        (d) => d?.getTime() === normalizedTileDate?.getTime()
                                    )
                                        ? "highlight-date" 
                                        : null;
                                }
                                if (view === 'year') {
                                    const tileMonth = date.getMonth();
                                    const tileYear = date.getFullYear();
                                    const hasHighlightInMonth = highlightedDates.some((highlightedDate) => {
                                        return (
                                            highlightedDate.getMonth() === tileMonth &&
                                            highlightedDate.getFullYear() === tileYear
                                        );
                                    });
                                    return hasHighlightInMonth ? "highlight-month" : null;
                                }
                                return null;
                            }}
                        />
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-schedule-consultant">
                    <div className="modal-content-schedule-consultant">
                        <button className="close-modal-schedule-consultant" onClick={() => setShowModal(false)}>
                            &times;
                        </button>
                        <h3>Horários disponíveis para {selectedDate?.toLocaleDateString('pt-BR')}</h3>
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
                <div className="modal-container-add-schedule-consultant">
                    <div className="sub-container-add-schedule-consultant">
                        <button
                            className="close-modal-schedule-consultant"
                            onClick={() => setShowModalAdd(false)}
                        >
                            &times;
                        </button>
                        <h3 className="modal-add-title">Adicionar Nova Agenda Recorrente</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="add-form-schedule-consultant">
                            <div className="form-group-schedule">
                                <label htmlFor="specialtyId">Especialidade:</label>
                                <Controller
                                    name="specialtyId"
                                    control={control}
                                    rules={{
                                        required: "Especialidade é obrigatória.",
                                        validate: (value) =>
                                            value !== "" || "Por favor, selecione uma especialidade válida.",
                                    }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <>
                                            <select
                                                id="specialtyId"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className={`input-schedule ${
                                                    errors.specialtyId ? "input-error" : ""
                                                }`}
                                            >
                                                <option value="">Selecione a especialidade</option>
                                                {loadingSpecialties ? (
                                                    <option disabled>Carregando especialidades...</option>
                                                ) : specialties.length > 0 ? (
                                                    specialties.map((specialty) => (
                                                        <option key={specialty.id} value={specialty.id}>
                                                            {specialty.specialty.name_specialty}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Você ainda não possui especialidades cadastradas!</option>
                                                )}
                                            </select>
                                            {errors.specialtyId && (
                                                <span className="error-message-schedule">{errors.specialtyId.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            <div className="form-group-schedule">
                                <label htmlFor="dateInitial">Data Inicial:</label>
                                <Controller
                                    name="dateInitial"
                                    control={control}
                                    rules={{ required: "Data inicial é obrigatória." }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="dateInitial"
                                            {...field}
                                            type="date"
                                            className={`input-schedule ${
                                                errors.dateInitial ? "input-error" : ""
                                            }`}
                                        />
                                    )}
                                />
                                {errors.dateInitial && <span className="error-message-schedule">{errors.dateInitial.message}</span>}
                            </div>

                            <div className="form-group-schedule">
                                <label htmlFor="dateFinal">Data Final:</label>
                                <Controller
                                    name="dateFinal"
                                    control={control}
                                    rules={{
                                        required: "Data final é obrigatória.",
                                        validate: (value) =>
                                            new Date(value) >= new Date(watch("dateInitial")) ||
                                            "Data final não pode ser anterior à data inicial.",
                                    }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="dateFinal"
                                            {...field}
                                            type="date"
                                            className={`input-schedule ${
                                                errors.dateFinal ? "input-error" : ""
                                            }`}
                                        />
                                    )}
                                />
                                {errors.dateFinal && <span className="error-message-schedule">{errors.dateFinal.message}</span>}
                            </div>

                            <div className="form-group-schedule">
                                <label htmlFor="hourInitial">Hora Inicial:</label>
                                <Controller
                                    name="hourInitial"
                                    control={control}
                                    rules={{ required: "Hora inicial é obrigatória." }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="hourInitial"
                                            {...field}
                                            type="time"
                                            className={`input-schedule ${
                                                errors.hourInitial ? "input-error" : ""
                                            }`}
                                        />
                                    )}
                                />
                                {errors.hourInitial && <span className="error-message-schedule">{errors.hourInitial.message}</span>}
                            </div>

                            <div className="form-group-schedule">
                                <label htmlFor="hourFinal">Hora Final:</label>
                                <Controller
                                    name="hourFinal"
                                    control={control}
                                    rules={{
                                        required: "Hora final é obrigatória.",
                                        validate: (value) => {
                                            const specialtyId = watch("specialtyId");
                                            const selectedSpecialtyObj = specialties.find(
                                                (specialty) => specialty.id === Number(specialtyId)
                                            );
                                            const duration = selectedSpecialtyObj?.duration || 0;

                                            if (!duration) return "Selecione uma especialidade válida para calcular a duração.";

                                            const hourInitial = watch("hourInitial");
                                            if (!hourInitial) return "Informe a hora inicial primeiro.";

                                            const [initialHours, initialMinutes] = hourInitial.split(":").map(Number);
                                            const [finalHours, finalMinutes] = value.split(":").map(Number);

                                            const initialTimeInMinutes = initialHours * 60 + initialMinutes;
                                            const finalTimeInMinutes = finalHours * 60 + finalMinutes;
                                            if (finalTimeInMinutes <= initialTimeInMinutes) {
                                                return "Hora final deve ser posterior à hora inicial.";
                                            }
                                            return (
                                                finalTimeInMinutes - initialTimeInMinutes >= duration ||
                                                `O intervalo deve ser de no mínimo ${duration} minutos (duração da consulta).`
                                            );
                                        },
                                    }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="hourFinal"
                                            {...field}
                                            type="time"
                                            className={`input-schedule ${
                                                errors.hourFinal ? "input-error" : ""
                                            }`}
                                        />
                                    )}
                                />
                                {errors.hourFinal && <span className="error-message-schedule">{errors.hourFinal.message}</span>}
                            </div>

                            <div className="form-group-schedule status-field-hidden">
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: "Status é obrigatório." }}
                                    defaultValue={"ativo"}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className="input-schedule" 
                                            disabled 
                                            readOnly
                                            hidden
                                        />
                                    )}
                                />
                            </div>

                            <div className="content-add-button-submit-schedule-consultant">
                                <button type="submit" className="button-submit-schedule-consultant">
                                    Salvar Agenda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleConsultant;