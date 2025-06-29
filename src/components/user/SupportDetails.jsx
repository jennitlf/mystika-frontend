import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext.js";
import { API } from "../../config.js";
import "../../css/user/supportDetails.css"

const SupportDetail = () => {
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        status: "",
        title: "",
        email: "",
        content: "",
      });
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const response = await fetch(`${API}customer-support/record/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });
          if (response.ok) {
            toast.success("Registro enviado com sucesso");
          } else {
            const errorData = await response.json();
            toast.error(`Erro: ${errorData.message || "Falha ao enviar o registro"}`);
          }
        } catch (error) {
          toast.error(`Erro: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
    useEffect(() => {
        const fetchSupportDetail = async () => {
            try {
                const response = await fetch(`${API}customer-support/record/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Erro ao acessar os detalhes do suporte.");
                }
                const data = await response.json();
                setFormData({
                    status: data.status,
                    title: data.title,
                    email: data.email,
                    content: data.content,
                })
            } catch (error) {
                toast.error(`Erro: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSupportDetail();
    }, [id, token]);

    if (loading) {
        return <p>Carregando...</p>;
    }
    if (!formData) {
        return <p>Detalhes não encontrados.</p>;
    }

    return (
        <div className="container-support-details">
            <form onSubmit={handleSubmit} className="form-support-details-edit">

                <div className="field-form-support-details">
                    <label className="label-form-support-details label-form-support-status" htmlFor="status">
                        Status
                    </label>
                    <select
                        className="input-form-support"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione o status</option>
                        <option value="pending">Pendente</option>
                        <option value="concluído">Concluído</option>
                    </select>
                </div>
                <div className="field-form-support-details">
                    <label className="label-form-support-details label-form-support-title-details" htmlFor="title">
                    Título
                    </label>
                    <input
                    className="input-form-support"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="field-form-support-details">
                    <label className="label-form-support-details label-form-support-email-details" htmlFor="email">
                    Digite seu email:
                    </label>
                    <input
                    className="input-form-support"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="field-form-support-details">
                    <label className="label-form-support-details label-form-support-text-details" htmlFor="content">
                    Qual sua dúvida ou reclamação?
                    </label>
                    <textarea
                    className="input-form-support textarea-form-support"
                    name="content"
                    placeholder="Escreva sua mensagem"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    ></textarea>
                </div>
                <div className="content-button-submit-details">
                    <Link className="content-button-return" to="/solicitacoes-de-supote">
                        <button>
                            voltar
                        </button>
                    </Link>
                    <button className="button-submit-details" type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupportDetail;
