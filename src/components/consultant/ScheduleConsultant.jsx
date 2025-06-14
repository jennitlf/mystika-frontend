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

const normalizeDateToUTC = (date) => { // eslint-disable-next-line
    if (!date instanceof Date) {
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
            const dates = data.map((schedule) => createUTCDateFromYYYYMMDD(schedule.date));
            setHighlightedDates(dates);

        } catch (error) {
            console.error("Erro ao buscar consultas:", error);
        } finally {
            setLoading(false);
        }
    };
    const selectedDateLocal = selectedDate ? normalizeDateToUTC(selectedDate) : null;

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
            id_consultant_specialty: data.specialtyId,
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
                toast.success("Agenda cadastrada!");
                reset({
                    specialtyId: "",
                    dateInitial: "",
                    dateFinal: "",
                    hourInitial: "",
                    hourFinal: "",
                    status: "ativo",
                });
                trigger();
                if (selectedSpecialty) {
                    fetchSchedule(selectedSpecialty);
                }
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
            <div className="subcontainer-scheduleConsultant-consultant">
                <div className="content-filter-schedule-consultant">
                    <div className="box-filter-specilaty-schedule-consultant">
                        <div className="filter-specialty-consultation-consultant">
                            <select
                                id="filter-specialty-consultation-consultant"
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
                        <button className="button-add-schedule-consultant" onClick={() => setShowModalAdd(!showModalAdd)}>
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
                                value={selectedDateLocal}
                                tileClassName={({ date, view }) => {
                                    if (view === 'month') {
                                        const normalizedTileDate = normalizeDateToUTC(date);
                                        return highlightedDates.some(
                                            (d) => d?.getTime() === normalizedTileDate?.getTime()
                                        )
                                            ? "highlight"
                                            : "";
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

                                        return hasHighlightInMonth ? "highlight" : "";
                                    }
                                    return "";
                                }}
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
                        <h3>Horários disponíveis para {selectedDate?.toLocaleDateString()}</h3>
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
                        <form onSubmit={handleSubmit(onSubmit)} className="add-form-schedule-consultant">
                            <div className="container-content-add-specialty-schedule-consultant">
                                <Controller
                                    name="specialtyId"
                                    control={control}
                                    rules={{
                                        required: "Especialidade é obrigatório",
                                        validate: (value) =>
                                            value !== "" || "Por favor, selecione uma especialidade válida",
                                    }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div className="content-add-specialty-schedule-consultant">
                                            <select
                                                id="specialtyId"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className={`add-select-schedule-consultant ${
                                                    errors.specialtyId ? "input-error-form-add-schedule-consultant" : ""
                                                }`}
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
                                            {errors.specialtyId && (
                                                <span className="error-message">{errors.specialtyId.message}</span>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="content-add-field-schedule-consultant">
                                <div className="content-add-fild-label">
                                    <label htmlFor="dateInitial">Data Inicial:</label>
                                </div>
                                <Controller
                                    name="dateInitial"
                                    control={control}
                                    rules={{ required: "Data inicial é obrigatório" }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="dateInitial"
                                            {...field}
                                            type="date"
                                            className="dateInitial-add-date-schedule-consultant"
                                        />
                                    )}
                                />
                            </div>
                            <div className="content-add-field-schedule-consultant">
                                <div className="content-add-fild-label">
                                    <label htmlFor="dateFinal">Data Final:</label>
                                </div>
                                <Controller
                                    name="dateFinal"
                                    control={control}
                                    rules={{
                                        required: "Data final é obrigatório",
                                        validate: (value) =>
                                            new Date(value) >= new Date(watch("dateInitial")) ||
                                            "Data final não pode ser anterior à data inicial",
                                    }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="dateFinal"
                                            {...field}
                                            type="date"
                                            className={`dateFinal-add-date-schedule-consultant ${
                                                errors.dateFinal ? "input-error-form-add-schedule-consultant" : ""
                                            }`}
                                        />
                                    )}
                                />
                                {errors.dateFinal && <span>{errors.dateFinal.message}</span>}
                            </div>
                            <div className="content-add-field-schedule-consultant">
                                <div className="content-add-fild-label">
                                    <label htmlFor="hourInitial">Hora Inicial:</label>
                                </div>
                                <Controller
                                    name="hourInitial"
                                    control={control}
                                    rules={{ required: "Hora inicial é obrigatório" }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="hourInitial"
                                            {...field}
                                            type="time"
                                            className="hourInitial-add-hour-schedule-consultant"
                                        />
                                    )}
                                />
                            </div>
                            <div className="content-add-field-schedule-consultant">
                                <div className="content-add-fild-label">
                                    <label htmlFor="hourFinal">Hora Final:</label>
                                </div>
                                <Controller
                                    name="hourFinal"
                                    control={control}
                                    rules={{
                                        required: "Hora final é obrigatório",
                                        validate: (value) => {
                                            const specialtyId = watch("specialtyId");
                                            const selectedSpecialty = specialties.find(
                                                (specialty) => specialty.id === Number(specialtyId)
                                            );
                                            const duration = selectedSpecialty?.duration || 0;

                                            const hourInitial = watch("hourInitial");
                                            const [initialHours, initialMinutes] = hourInitial?.split(":").map(Number);
                                            const [finalHours, finalMinutes] = value.split(":").map(Number);

                                            const initialTime = initialHours * 60 + initialMinutes;
                                            const finalTime = finalHours * 60 + finalMinutes;

                                            return (
                                                finalTime - initialTime >= duration ||
                                                `Hora final deve ter um intervalo mínimo de ${duration} minutos`
                                            );
                                        },
                                    }}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <input
                                            id="hourFinal"
                                            {...field}
                                            type="time"
                                            className={`hourFinal-add-hour-schedule-consultant ${
                                                errors.hourFinal ? "input-error-form-add-schedule-consultant" : ""
                                            }`}
                                        />
                                    )}
                                />
                                {errors.hourFinal && <span>{errors.hourFinal.message}</span>}
                            </div>
                            <div>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: "Status é obrigatório" }}
                                    defaultValue={"ativo"}
                                    render={({ field }) => (
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
                                <button type="submit" className="add-button-submit-schedule-consultant">
                                    Salvar
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