import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { API } from "../../config";
import { toast } from "react-toastify";
import { formatDisplayDate } from "../../utils/formateDate";
import "../../css/consultant/supportListConsultant.css";


const SupportListConsultant = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [supports, setSupports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSupport, setSelectedSupport] = useState(null);
    const [editingStatus, setEditingStatus] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const fetchSupports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API}consultant-support/byUser`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            
            if (!response.ok) {
                const data = await response.json()
                if (response.status === 401 && data.message === "Token invalido ou expirado") {
                    toast.error("Sessão expirada. Por favor, faça login novamente.");
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        navigate('/consultor/login');
                    }, 3000);
                }
                throw new Error("Erro ao buscar dados");
            }
            const data = await response.json(); 
            setSupports(data);
            console.log(data)
        } catch (err) {
            setError("Erro ao carregar solicitações de suporte.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchSupports();
        }
    }, [token, fetchSupports]);

    const fetchSupportById = async (id) => {
        try {
            const response = await fetch(`${API}consultant-support/record/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const data = await response.json()
                if (response.status === 401 && data.message === "Token invalido ou expirado") {
                    toast.error("Sessão expirada. Por favor, faça login novamente.");
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        navigate('/consultor/login');
                    }, 3000);
                }
                throw new Error("Erro ao buscar dados");
            }
            const data = await response.json(); 
            setSelectedSupport(data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Error fetching support details:", err);
            setError("Erro ao carregar detalhes da solicitação.");
        }
    };

    const handleViewClick = (id) => {
        fetchSupportById(id);
    };

    const handleEditClick = (support) => {
        setSelectedSupport(support);
        setEditingStatus(support.status.toLowerCase());
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setSelectedSupport(null);
        setEditingStatus("");
    };

    const handleStatusChange = (e) => {
        setEditingStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        console.log(editingStatus)
        if (!selectedSupport || !editingStatus || editingStatus === "") return toast.error("Selecione um novo status para atualizar.");
        setIsUpdatingStatus(true);
        try {
            const response = await fetch(
                `${API}consultant-support/record/${selectedSupport.id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingStatus),
                }
            );
            if (!response.ok) {
                const data = await response.json()
                if (response.status === 401 && data.message === "Token invalido ou expirado") {
                    toast.error("Sessão expirada. Por favor, faça login novamente.");
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        navigate('/consultor/login');
                    }, 3000);
                }
                throw new Error("Erro ao buscar dados");
            }
            toast.success("Status atualizado com sucesso!");
            handleCloseModal();
            fetchSupports();
        } catch (err) {
            console.error("Error updating support status:", err);
            toast.error("Erro ao atualizar o status da solicitação.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const filteredSupports = supports.filter((support) => {
        const matchesSearch = support.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              support.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              support.phone.includes(searchTerm);

        const matchesDate = filterDate ?
            (new Date(support.createdAt).toLocaleDateString("pt-BR") === new Date(filterDate).toLocaleDateString("pt-BR")) :
            true;

        const matchesStatus = filterStatus ?
            (support.status.toLowerCase() === filterStatus.toLowerCase()) :
            true;

        return matchesSearch && matchesDate && matchesStatus;
    });

    return (
        <div className="container-support-list-consultant">
            <div className="subcontainer-support-list-consultant">
                <div className="content-filter-support-consultant">
                    <div className="box-search-filters">
                        <div className="filter-item consultant-search-text-input">
                            <div className="subbox-consultant-search-text-input">
                                <span className="material-symbols-outlined" translate="no">search</span>
                                <input
                                    type="search"
                                    placeholder="Buscar por título, email ou telefone..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="filter-item consultant-date-input-wrapper">
                            <input
                                type="date"
                                value={filterDate}
                                onChange={handleDateChange}
                                className="consultant-date-input"
                            />
                        </div>
                        <div className="filter-item consultant-status-select-wrapper">
                            <select
                                name="filter-status-support-consultant"
                                value={filterStatus}
                                onChange={handleStatusFilterChange}
                                className="consultant-status-select"
                            >
                                <option value="">Todos os Status</option>
                                <option value="pendente">Pendente</option>
                                <option value="resolvido">Resolvido</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="content-support-consultant">
                    {loading ? (
                        <div className="message-container">
                            <p>Carregando solicitações de suporte...</p>
                        </div>
                    ) : error ? (
                        <div className="message-container">
                            <p className="error-message-text">{error}</p>
                        </div>
                    ) : (
                        filteredSupports.length > 0 ? (
                            <div className="supports-list">
                                {filteredSupports.map((support) => {
                                    const statusLower = support.status.toLowerCase();
                                    const isEditDisabled = statusLower === 'resolvido';

                                    return (
                                        <div key={support.id} className="support-card">
                                            <div className="card-header">
                                                <div className="card-title-support">
                                                    {support.title}
                                                </div>
                                                <div className={`card-status status-${statusLower}`}>
                                                    {support.status}
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <p className="card-email">
                                                    Email: <strong>{support.email}</strong>
                                                </p>
                                                <p className="card-phone">
                                                    Telefone: <strong>{support.phone}</strong>
                                                </p>
                                                <div className="card-datetime">
                                                    <span className="material-symbols-outlined date-icon" translate="no">calendar_month</span>
                                                    <span className="date-text">{formatDisplayDate(support.createdAt)}</span>
                                                    <span className="material-symbols-outlined time-icon" translate="no">schedule</span>
                                                    <span className="time-text">{new Date(support.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="card-actions">
                                                <button
                                                    className="action-button view-button"
                                                    title="Ver Detalhes"
                                                    onClick={() => handleViewClick(support.id)}
                                                >
                                                    <span className="material-symbols-outlined" translate="no">visibility</span>
                                                </button>
                                                <button
                                                    className="action-button edit-button"
                                                    title={isEditDisabled ? "Suporte resolvido" : "Editar Suporte"}
                                                    onClick={() => handleEditClick(support)}
                                                    disabled={isEditDisabled}
                                                >
                                                    <span className="material-symbols-outlined" translate="no">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="message-container">
                                <p>Nenhuma solicitação de suporte encontrada com os filtros aplicados.</p>
                            </div>
                        )
                    )}
                </div>
                {showViewModal && selectedSupport && (
                    <div className="modal-overlay">
                        <div className="modal-content-view">
                            <div className="modal-header-view">
                                <h2>Detalhes do Suporte #{selectedSupport.id}</h2>
                                <button className="modal-close-button" onClick={handleCloseModal}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="modal-body-view">
                                <p>
                                    Título: <strong>{selectedSupport.title}</strong>
                                </p>
                                <p>
                                    Email: <strong>{selectedSupport.email}</strong>
                                </p>
                                <p>
                                    Telefone: <strong>{selectedSupport.phone}</strong>
                                </p>
                                <p>
                                    Conteúdo: <strong>{selectedSupport.content}</strong>
                                </p>
                                <p>
                                    Status: <strong className={`card-status status-${selectedSupport.status.toLowerCase()}`}>{selectedSupport.status}</strong>
                                </p>
                                <p>
                                    Criado em: <strong>{formatDisplayDate(selectedSupport.createdAt)} às {new Date(selectedSupport.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</strong>
                                </p>
                                {selectedSupport.updatedAt !== selectedSupport.createdAt && (
                                    <p>
                                        Última atualização: <strong>{formatDisplayDate(selectedSupport.updatedAt)} às {new Date(selectedSupport.updatedAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</strong>
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer-view">
                                <button className="modal-action-button cancel-button" onClick={handleCloseModal}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedSupport && (
                    <div className="modal-overlay">
                        <div className="modal-content-edit">
                            <div className="modal-header-edit">
                                <h2>Editar Suporte #{selectedSupport.id}</h2>
                                <button className="modal-close-button" onClick={handleCloseModal}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="modal-body-edit">
                                <p>
                                    Título: <strong>{selectedSupport.title}</strong>
                                </p>
                                <p>
                                    Email: <strong>{selectedSupport.email}</strong>
                                </p>
                                <p>
                                    Status Atual: <strong className={`card-status status-${selectedSupport.status.toLowerCase()}`}>{selectedSupport.status}</strong>
                                </p>

                                <div className="form-group">
                                    <label htmlFor="newStatus">Alterar Status para:</label>
                                    <select
                                        id="newStatus"
                                        value={editingStatus}
                                        onChange={handleStatusChange}
                                        className="modal-select-status"
                                        disabled={selectedSupport.status.toLowerCase() === 'resolvido' || isUpdatingStatus}
                                    >
                                        <option value="" >Selecione um novo status</option>
                                        {selectedSupport.status.toLowerCase() === 'pendente' && (
                                            <option value="resolvido" data-placeholder="true">Resolvido</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer-edit">
                                <button
                                    className="modal-action-button update-button"
                                    onClick={handleUpdateStatus}
                                    disabled={editingStatus === selectedSupport.status.toLowerCase() || isUpdatingStatus}
                                >
                                    {isUpdatingStatus ? "Atualizando..." : "Atualizar Status"}
                                </button>
                                <button className="modal-action-button cancel-button" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportListConsultant;