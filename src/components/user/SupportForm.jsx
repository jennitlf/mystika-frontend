import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { API } from "../../config.js";
import "../../css/user/SupportForm.css";
import { AuthContext } from "../../context/AuthContext.js";

const SupportForm = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    phone: "",
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
      const response = await fetch(`${API}customer-support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: "",
          email: "",
          phone: "",
          content: "",
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
    <div className="container-form-support">
      <form onSubmit={handleSubmit} className="form-support">
        <div className="field-form-support">
          <label className="label-form-support label-form-support-title" htmlFor="title">
            Título
          </label>
          <input
            maxLength={100}
            className="input-form-support-solicitation"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-form-support field-form-support-phone-email">
          <div>
            <label className="label-form-support label-form-support-email" htmlFor="email">
              Digite seu email:
            </label>
            <input
            maxLength={60}
              className="input-form-support-solicitation"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label-form-support label-form-support-phone" htmlFor="email">
              Digite seu Telefone:
            </label>
            <input
              maxLength={15}
              className="input-form-support-solicitation"
              name="phone"
              type="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field-form-support">
          <label className="label-form-support label-form-support-text" htmlFor="content">
            Qual sua dúvida ou reclamação?
          </label>
          <textarea
          maxLength={600}
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
    </div>
  );
};

export default SupportForm;
