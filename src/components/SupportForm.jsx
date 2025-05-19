import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "../css/SupportForm.css";
import { AuthContext } from "../context/AuthContext";

const SupportForm = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
      const response = await fetch(`http://localhost:3001/customer-support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Corrigido de FormData para formData
      });

      if (response.ok) {
        setFormData({
          title: "",
          email: "",
          content: "", // Corrigido de 'message' para 'content'
        });
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

  return (
    <form onSubmit={handleSubmit} className="form-support">
      <div className="field-form-support">
        <label className="label-form-support label-form-support-title" htmlFor="title">
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
      <div className="field-form-support">
        <label className="label-form-support label-form-support-email" htmlFor="email">
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
      <div className="field-form-support">
        <label className="label-form-support label-form-support-text" htmlFor="content">
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
      <div className="content-button-submit">
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
};

export default SupportForm;
