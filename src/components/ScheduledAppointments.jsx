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
            <div className="subcontainer-scheduledAppointments">
                <h3 className="title-scheduledAppointments">Lista de consultas agendadas</h3>
                <div className="header-scheduledAppointments">
                    <h4>Especialidade</h4>
                    <h4>Dia</h4>
                    <h4>Hora</h4>
                    <h4>Duração</h4>
                    <h4>Valor</h4>
                    <h4>Status</h4>
                </div>
                <div className="content-main-scheduledAppointments">
                {consultations.map((consultation) => {
                return (
                    <div key={consultation.id} className="content-scheduledAppointments">
                        <p>{consultation.schedule_consultant?.consultant_specialty?.specialty?.name_specialty || "N/A"}</p>
                        <p>{formatDate(consultation.appoinment_date) || "Data não disponível"}</p>
                        <p>{consultation.appoinment_time || "Hora não disponível"}</p>
                        <p>{consultation.schedule_consultant?.consultant_specialty?.duration || "0"} min</p>
                        <p>R${consultation.schedule_consultant?.consultant_specialty?.value_per_duration || "0"},00</p>
                        <p>{translateStatus(consultation.status) || "Desconhecido"}</p>
                    </div>
                );
                })
                }
                {consultations.map((consultation) => {
                return (
                    <div key={consultation.id} className="faixa-principal">
                        <div className="conteudo-esquerda">
                            <div className="data-horario">
                                <p>{formatDate(consultation.appoinment_date) || "Data não disponível"}</p>
                                <p>{consultation.appoinment_time || "Hora não disponível"}</p>
                            </div>
                            <p className="especialidade"> {consultation.schedule_consultant?.consultant_specialty?.specialty?.name_specialty || "N/A"}</p>
                            <div className="conteudo-baixo">
                                <div className="duracao">
                                    {consultation.schedule_consultant?.consultant_specialty?.duration || "0"} min
                                </div>
                                <div className="status">
                                    {translateStatus(consultation.status) || "Desconhecido"}
                                </div>
                            </div>
                        </div>

                        <div className="conteudo-direita">
                            <p className="valor">R${consultation.schedule_consultant?.consultant_specialty?.value_per_duration || "0"},00</p>
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
