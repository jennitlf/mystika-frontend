import React, { useContext, useEffect, useState, useCallback } from "react";
import "../../css/user/ScheduledAppointments.css";
import { AuthContext } from "../../context/AuthContext.js";
import { toast } from "react-toastify";
import { API } from "../../config.js";

const ITEMS_PER_PAGE = 5;

const ScheduledAppointments = () => {
    const { token } = useContext(AuthContext);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API}consultation/byUserId/paginated?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 404) {
                toast.info("Não há consultas agendadas.");
                setConsultations([]);
                setTotalPages(1);
                setTotalCount(0);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Erro ao acessar consultas.");
            }

            const data = await response.json();
            setConsultations(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalCount(data.totalCount || 0);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao acessar consultas:", error);
            toast.error("Ocorreu um erro ao carregar suas consultas.");
            setLoading(false);
            setConsultations([]);
            setTotalPages(1);
            setTotalCount(0);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);
    console.log(consultations)
    const handleCancelConsultation = async (consultationId) => {
        if (!window.confirm("Você tem certeza que deseja cancelar esta consulta?")) {
            return;
        }

        setCancellingId(consultationId);
        try {
            const response = await fetch(`${API}consultation/customer/cancel/${consultationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao cancelar consulta.");
            }
  
            toast.success("Consulta cancelada com sucesso!");
            fetchSchedules();
        } catch (error) {
            console.error("Erro ao cancelar consulta:", error);
            toast.error(error.message || "Não foi possível cancelar a consulta.");
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Data não disponível";
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendente':
                return 'status-pendente';
            case 'realizada':
                return 'status-realizada';
            case 'cancelada':
                return 'status-cancelada';
            default:
                return '';
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="container-scheduledAppointments container-padding-top">
                <div className="container-scheduledAppointments-noItmes">
                    <p>Carregando consultas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-scheduledAppointments container-padding-top">
            <div className="content-scheduledAppointments">
                <div className="content-main-scheduledAppointments">
                    <h4 className="title-schedule-appoiment">Consultas agendadas</h4>

                    {totalCount === 0 ? (
                        <div className="container-scheduledAppointments-noItmes no-consultations-message">
                            <p>Nenhuma consulta agendada.</p>
                        </div>
                    ) : (
                        <>
                            {consultations.map((consultation) => {
                                const canCancel = consultation.status?.toLowerCase() === 'pendente';
                                return (
                                    <div key={consultation.id} className="container-schedule-item">
                                        <div className="content-left">
                                            <div className="date-time">
                                                <p>Data: {formatDate(consultation.appoinment_date)}</p>
                                                <p>Hora: {consultation.appoinment_time || "Hora não disponível"}</p>
                                            </div>
                                            <p className="specialty-item-scheduleAppoiment">
                                                {consultation.scheduleConsultant?.consultantSpecialty?.specialty?.name_specialty || "N/A"}
                                            </p>
                                            <div className="content-time-status">
                                                <div className="duracao">
                                                    {consultation.scheduleConsultant?.consultantSpecialty?.duration || "0"} min
                                                </div>
                                                <div className={`status-schedule-item ${getStatusClass(consultation.status)}`}>
                                                    {consultation.status || "Desconhecido"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="content-right">
                                            <p className="value-consultation">
                                                R${consultation.scheduleConsultant?.consultantSpecialty?.value_per_duration || "0"},00
                                            </p>
                                            {canCancel && (
                                                <button
                                                    className="btn-cancel-consultation-user"
                                                    onClick={() => handleCancelConsultation(consultation.id)}
                                                    disabled={cancellingId === consultation.id}
                                                >
                                                    {cancellingId === consultation.id ? "Cancelando..." : "Cancelar"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                    {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            Anterior
                        </button>
                        <span className="pagination-info">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            Próxima
                        </button>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default ScheduledAppointments;