import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { API } from "../../config";
import "../../css/consultant/consultationsConsultant.css";

const ConsultationsConsultant = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch(`${API}consultation/byConsultorId`, {
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
        console.log("Consultas:", data.data);
        setConsultations(data.data);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [])
  return (
    <div className="container-consultation-consultant">
      <div className="subcontainer-consultation-consultant">
        <div className="content-filter-consultation-consultant">
          <div className="box-search-filters">
            <div className="box-search-text-consultation-consultant">
              <div className="subbox-search-text-consultation-consultant">
                <span className="material-symbols-outlined" translate="no">search</span>
                <input type="search" />
              </div>
            </div>
            <div className="filter-date-consultation-consultant">
              <input type="date" />
            </div>
            <div className="filter-specialty-consultation-consultant">
              <select name="filter-specialty-consultation-consultant" id="">
                <option value="" disabled>Buscar por especialidade</option>
                <option value="specialty-1">specialty-1</option>
                <option value="specialty-2">specialty-2</option>
                <option value="specialty-3">specialty-3</option>
              </select>
            </div>
          </div>
        </div>
        <div className="content-consultation-consultant">
          {loading ? (
            <div className="content-loading-consultation-consultant">
              <p>Carregando...</p>
            </div>
          ) : consultations.length > 0 ? (
            consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="consultation-item-consultation-consultant"
              >
                <div className="box-specialty-status-consultation-consultant">
                  <div className="box-specialty-consultation-consultant">
                    {consultation.schedule_consultant.consultant_specialty.specialty.name_specialty}
                  </div>
                  <div className="box-status-consultation-consultant">
                    {consultation.status}
                  </div>
                </div>
                <div className="box-appoiment-date-time-consultation-consultant">
                  <div className="box-appoinment-date-consultation-consultant">
                    {consultation.appoinment_date}
                  </div>
                  <div className="box-appoinment-time-consultation-consultant">
                    {consultation.appoinment_time}
                  </div>
                </div>
                <div className="box-button-action-consultation-consultant">
                  <span className="material-symbols-outlined" translate="no">edit</span>
                </div>
              </div>
            ))
          ) : (
            <div className="content-loading-consultation-consultant">
              <p>Você ainda não possui consultas agendadas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationsConsultant;
