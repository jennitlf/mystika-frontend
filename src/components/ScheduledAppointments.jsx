import React, { useContext, useEffect, useState } from "react";
import "../css/ScheduledAppointments.css";
import { AuthContext } from "../context/AuthContext.js";
import { toast } from "react-toastify";
import { API } from "../config.js";

const ScheduledAppointments = () => {
    const { token } = useContext(AuthContext);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const schedules = async () => {
            try {
                const response = await fetch(`${API}consultation/byUserId`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 404) {
                    toast.info("Não há consultas agendadas.");
                    setLoading(false);
                    return;
                }
                if (!response.ok) {
                    throw new Error("Erro ao acessar consultas.");
                }
                const data = await response.json();
                setConsultations(data.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao acessar consultas:", error);
                setLoading(false);
            }
        };
        schedules();
    }, [token]);

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

    if (loading) {
        return (
            <div className="container-scheduledAppointments-noItmes">
                <p>Carregando consultas...</p>
            </div>
        );
    }

    if (!Array.isArray(consultations) || consultations.length < 1) {
        return (
            <div className="container-scheduledAppointments-noItmes">
                <p>Nenhum registro</p>
            </div>
        );
    }

    return (
    <div className="container-scheduledAppointments">
        <div className="content-scheduledAppointments">
            <div className="content-main-scheduledAppointments">
                <h4 className="title-schedule-appoiment">Consultas agendadas</h4>
                {consultations.map((consultation) => {
                return (
                    <div key={consultation.id} className="container-schedule-item">
                        <div className="content-left">
                            <div className="date-time">
                                <p>Data: {formatDate(consultation.appoinment_date) || "Data não disponível"}</p>
                                <p>Hora: {consultation.appoinment_time || "Hora não disponível"}</p>
                            </div>
                            <p className="specialty-item-scheduleAppoiment"> {consultation.schedule_consultant?.consultant_specialty?.specialty?.name_specialty || "N/A"}</p>
                            <div className="content-time-status">
                                <div className="duracao">
                                    {consultation.schedule_consultant?.consultant_specialty?.duration || "0"} min
                                </div>
                                <div className="status-schedule-item">
                                    {translateStatus(consultation.status) || "Desconhecido"}
                                </div>
                            </div>
                        </div>

                        <div className="content-right">
                            <p className="value-consultation">R${consultation.schedule_consultant?.consultant_specialty?.value_per_duration || "0"},00</p>
                        </div>
                    </div>
                );
                })
                }
                </div>
            </div>
        </div>
    );
};

export default ScheduledAppointments;
