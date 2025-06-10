import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../config.js";
import "react-toastify/dist/ReactToastify.css";
import "../../css/user/SupportList.css";
import { AuthContext } from "../../context/AuthContext.js";

const SupportList = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [supports, setSupports] = useState(null);

    useEffect(() => {
        const fetchSupports = async () => {
            try {
                const response = await fetch(`${API}customer-support/byUser`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 404) {
                    throw new Error("Não há suportes registrados.");
                }

                if (!response.ok) {
                    throw new Error("Erro ao acessar registros.");
                }

                const data = await response.json();
                setSupports(data);
            } catch (error) {
                toast.error(`Erro: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSupports();
    }, [token]);
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
    
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const year = date.getFullYear();
    
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return (
        <div className="container-support-list">
            <div className="subcontainer-support-list">
                <div className="box-title-supports-header">
                    <h4 className="title-supports-header" translate="no">Lista de suportes</h4>
                </div>
                {loading && <div className='loading-dataUser'><p>Carregando...</p></div>}
                {!loading && supports && supports.length > 0 ? (
                    supports.map((support) => (
                        <div className="support-items" key={support.id}>
                            <div className="info-support-left">
                                <p className="support-item support-item-date">{formatDateTime(support.createdAt)}</p>
                                <div className="support-item support-item-title">{support.title}</div>
                                <p className="support-item support-item-status">{support.status}</p>
                            </div>
                            <div className="info-support-right">
                                <Link to={`/ajuda/detalhes/${support.id}`} key={support.id} className="link-container-button-action-supportList" >
                                    <button className="button-action-supportList">
                                        <span className="material-symbols-outlined" translate="no">edit</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <p>Não há suportes registrados.</p>
                )}
            </div>
        </div>
    );
};

export default SupportList;
