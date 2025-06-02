import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../config.js";
import "react-toastify/dist/ReactToastify.css";
import "../css/SupportList.css";
import { AuthContext } from "../context/AuthContext";

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
                <div className="header-supportList">
                    <h4 className="box-header">Titulo</h4>
                    <h4 className="box-header">Data de registro</h4>
                    <h4 className="box-header">Status</h4>
                    <h4 className="box-header">ações</h4>
                </div>
                {loading && <div className='loading-dataUser'><p>Carregando...</p></div>}
                {!loading && supports && supports.length > 0 ? (
                    <div className="body-support">
                        {supports.map((support) => (
                            <div className="support-items" key={support.id}>
                                <p className="support-item">{support.title}</p>
                                <p className="support-item">{formatDateTime(support.createdAt)}</p>
                                <p className="support-item">{support.status}</p>
                                <div className="support-item">
                                    <Link to={`/ajuda/detalhes/${support.id}`} key={support.id} className="link-container-button-action-supportList" >
                                        <button className="button-action-supportList">
                                            <span className="material-symbols-outlined" translate="no">edit</span>
                                        </button>
                                    </Link>
                                    <button className="button-action-supportList">
                                        <span className="material-symbols-outlined" translate="no">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p>Não há suportes registrados.</p>
                )}
            </div>
        </div>
    );
};

export default SupportList;
