import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
                const response = await fetch(`http://localhost:3001/customer-support/byUser`, {
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
            <div className="header-supportList">
                <h4 className="box-header">Titulo</h4>
                <h4 className="box-header">Data de registro</h4>
                <h4 className="box-header">Status</h4>
            </div>
            {loading && <p>Carregando...</p>}
            {!loading && supports && supports.length > 0 ? (
                <div>
                    {supports.map((support) => (
                    <Link to={`/customer-support/record/${support.id}`} key={support.id} className="support-items" >
                        <p className="support-item">{support.title}</p>
                        <p className="support-item">{formatDateTime(support.createdAt)}</p>
                        <p className="support-item">{support.status}</p>
                    </Link>
                    ))}
                </div>
            ) : (
                !loading && <p>Não há suportes registrados.</p>
            )}
        </div>
    );
};

export default SupportList;
