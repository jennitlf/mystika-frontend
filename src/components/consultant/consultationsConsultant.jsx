import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { API } from "../../config";
import "../../css/consultant/consultationsConsultant.css";
import { toast } from 'react-toastify'; 

const ConsultationsConsultant = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newStatus, setNewStatus] = useState(""); 

  
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-");
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Erro ao formatar data:", dateString, e);
      return dateString;
    }
  };

  
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoadingSpecialties(true);
      try {
        const response = await fetch(
          `${API}consultant-specialty?idConsultant=${user.id}&page=1&limit=99`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
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

    if (user && user.id && token) {
      fetchSpecialties();
    }
  }, [token, user]);

  
  // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${API}consultation/byConsultorId`; 

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Não foi possível buscar suas consultas.");
      }
      const apiResponse = await response.json(); 
      console.log("Dados recebidos da API:", apiResponse); 

     
      let consultationsArray = apiResponse.data; 
       
      
      let filteredData = consultationsArray; 

      if (searchTerm) {
        filteredData = filteredData.filter(consultation =>
          consultation.customer && consultation.customer.name &&
          consultation.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterDate) {
        filteredData = filteredData.filter(consultation =>
          consultation.appoinment_date === filterDate
        );
      }
      if (filterSpecialty) {
        
        filteredData = filteredData.filter(consultation =>
          consultation.schedule_consultant?.consultant_specialty?.specialty?.id === parseInt(filterSpecialty) 
        );
      }

      setConsultations(filteredData);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      toast.error("Erro ao carregar consultas.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (token) {
      fetchConsultations();
    }
  }, [token, searchTerm, filterDate, filterSpecialty, fetchConsultations]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setFilterSpecialty(e.target.value);
  };

  

  const handleEditClick = (consultation) => {
    setSelectedConsultation(consultation);
    setNewStatus(consultation.status.toLowerCase()); 
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedConsultation(null);
    setNewStatus("");
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateConsultation = async () => {
    if (!selectedConsultation || !newStatus) {
      toast.error("Por favor, selecione um status.");
      return;
    }

    const currentStatus = selectedConsultation.status.toLowerCase();

    if (currentStatus !== 'pendente' && currentStatus !== 'agendada') {
      toast.error(`Não é possível alterar o status de uma consulta "${currentStatus}".`);
      return;
    }

    if (currentStatus === 'pendente') {
      if (newStatus !== 'realizada' && newStatus !== 'cancelada') {
        toast.error("O status só pode ser alterado de 'pendente' para 'realizada' ou 'cancelada'.");
        return;
      }
    } else if (currentStatus === 'agendada') {
      if (newStatus !== 'cancelada') {
        toast.error("O status 'agendada' só pode ser alterado para 'cancelada'.");
        return;
      }
    }

    try {
      const response = await fetch(
        `${API}consultation/consultor/${selectedConsultation.id}`, 
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar status da consulta.");
      }

      toast.success("Status da consulta atualizado com sucesso!");
      handleCloseModal();
      fetchConsultations(); 
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      toast.error(error.message || "Erro ao atualizar consulta.");
    }
  };

  return (
    <div className="container-consultation-consultant">
      <div className="subcontainer-consultation-consultant">
        <div className="content-filter-consultation-consultant">
          <div className="box-search-filters">
            <div className="filter-item consultant-search-text-input">
              <div className="subbox-consultant-search-text-input">
                <span className="material-symbols-outlined" translate="no">search</span>
                <input
                  type="search"
                  placeholder="Buscar por cliente..."
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
            <div className="filter-item consultant-specialty-select-wrapper">
              <select
                name="filter-specialty-consultation-consultant"
                value={filterSpecialty}
                onChange={handleSpecialtyChange}
                className="consultant-specialty-select"
              >
                <option value="">Todas as especialidades</option>
                {loadingSpecialties ? (
                  <option disabled>Carregando especialidades...</option>
                ) : specialties.length > 0 ? (
                  specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.specialty.name_specialty}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhuma especialidade cadastrada</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="content-consultation-consultant">
          {loading ? (
            <div className="message-container">
              <p>Carregando suas consultas...</p>
            </div>
          ) : consultations.length > 0 ? (
            <div className="consultations-list">
              {consultations.map((consultation) => {
                const statusLower = consultation.status.toLowerCase();
                const isEditDisabled = statusLower === 'realizada' || statusLower === 'cancelada';

                return (
                  <div key={consultation.id} className="consultation-card">
                    <div className="card-header">
                      <div className="card-specialty">
                        {consultation.schedule_consultant.consultant_specialty.specialty.name_specialty}
                      </div>
                      <div className={`card-status status-${statusLower}`}>
                        {consultation.status}
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="card-client-name">
                        Cliente: {consultation.customer && consultation.customer.name ? consultation.customer.name : "N/A"}
                      </p>
                      <div className="card-datetime">
                        <span className="material-symbols-outlined date-icon" translate="no">calendar_month</span>
                        <span className="date-text">{formatDisplayDate(consultation.appoinment_date)}</span>
                        <span className="material-symbols-outlined time-icon" translate="no">schedule</span>
                        <span className="time-text">{consultation.appoinment_time}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="action-button view-button" title="Ver Detalhes">
                        <span className="material-symbols-outlined" translate="no">visibility</span>
                      </button>
                      <button
                        className="action-button edit-button"
                        title={isEditDisabled ? "Consulta finalizada ou cancelada" : "Editar Consulta"}
                        onClick={() => handleEditClick(consultation)}
                        disabled={isEditDisabled}
                      >
                        <span className="material-symbols-outlined" translate="no">edit</span>
                      </button>
                      <button className="action-button cancel-button" title="Cancelar Consulta">
                        <span className="material-symbols-outlined" translate="no">cancel</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="message-container">
              <p>Você ainda não possui consultas agendadas!</p>
            </div>
          )}
        </div>

        
        {showEditModal && selectedConsultation && (
          <div className="modal-overlay">
            <div className="modal-content-edit">
              <div className="modal-header-edit">
                <h2>Editar Consulta</h2>
                <button className="modal-close-button" onClick={handleCloseModal}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body-edit">
                <p>
                  Cliente: <strong>{selectedConsultation.customer.name}</strong>
                </p>
                <p>
                  Especialidade: <strong>{selectedConsultation.schedule_consultant.consultant_specialty.specialty.name_specialty}</strong>
                </p>
                <p>
                  Data: <strong>{formatDisplayDate(selectedConsultation.appoinment_date)}</strong>
                </p>
                <p>
                  Hora: <strong>{selectedConsultation.appoinment_time}</strong>
                </p>
                <p>
                  Status Atual: <strong className={`status-${selectedConsultation.status.toLowerCase()}`}>{selectedConsultation.status}</strong>
                </p>

                <div className="form-group">
                  <label htmlFor="newStatus">Alterar Status para:</label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={handleStatusChange}
                    className="modal-select-status"
                  >
                    <option value="" disabled>Selecione um novo status</option>
                    {selectedConsultation.status.toLowerCase() === 'pendente' && (
                      <>
                        <option value="realizada">Realizada</option>
                        <option value="cancelada">Cancelada</option>
                      </>
                    )}
                    {selectedConsultation.status.toLowerCase() === 'agendada' && (
                      <>
                        <option value="cancelada">Cancelada</option>
                      </>
                    )}
                    {(selectedConsultation.status.toLowerCase() === 'realizada' || selectedConsultation.status.toLowerCase() === 'cancelada') && (
                      <option value={selectedConsultation.status.toLowerCase()} disabled>
                         {selectedConsultation.status} (Finalizado)
                      </option>
                    )}
                  </select>
                </div>
              </div>
              <div className="modal-footer-edit">
                <button
                  className="modal-action-button update-button"
                  onClick={handleUpdateConsultation}
                  disabled={!newStatus || newStatus === selectedConsultation.status.toLowerCase()}
                >
                  Atualizar Status
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

export default ConsultationsConsultant;