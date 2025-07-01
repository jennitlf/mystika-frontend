import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { API } from "../../config";
import { toast } from "react-toastify";
import "../../css/consultant/newSupportConsultant.css";

const NewSupportConsultant = () => {
    const { token } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
    } = useForm({
        mode: "onChange",
    });

    const [isLoading, setIsLoading] = useState(false);

    const watchAllFields = watch();

    const onSubmit = async (data) => {
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API}consultant-support`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                throw new Error("Erro ao enviar solicitação");
            }
            toast.success("Solicitação enviada com sucesso!");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            reset(); 
        } catch (error) {
            console.error("Error submitting form:", error);
           
        } finally {
            setIsLoading(false);
    
        }
    };



    return (
        <div className="container-support-form">
            <div className="subcontainer-support-form">
                <div className="header-support-form">
                    <h2>Nova Solicitação de Suporte</h2>
                </div>
                <div className="content-support-form">
                    <form onSubmit={handleSubmit(onSubmit)} className="support-form">
                        <div className="form-group">
                            <label htmlFor="phone">Telefone:</label>
                            <input
                                id="phone"
                                type="text"
                                {...register("phone", {
                                    required: "Telefone é obrigatório",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Telefone deve conter apenas números"
                                    }
                                })}
                                className={errors.phone ? "input-error" : ""}
                            />
                            {errors.phone && (
                                <span className="error-message">{errors.phone.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email é obrigatório",
                                    maxLength: {
                                        value: 30,
                                        message: "Email não pode ter mais de 30 caracteres",
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email inválido",
                                    },
                                })}
                                className={errors.email ? "input-error" : ""}
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Assunto:</label>
                            <input
                                id="title"
                                type="text"
                                {...register("title", {
                                    required: "Assunto é obrigatório",
                                    maxLength: {
                                        value: 100,
                                        message: "Assunto não pode ter mais de 100 caracteres",
                                    },
                                })}
                                className={errors.title ? "input-error" : ""}
                            />
                            {errors.title && (
                                <span className="error-message">{errors.title.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Conteúdo:</label>
                            <textarea
                                id="content"
                                rows="5"
                                {...register("content", {
                                    required: "Conteúdo é obrigatório",
                                    maxLength: {
                                        value: 300,
                                        message: "Conteúdo não pode ter mais de 300 caracteres",
                                    },
                                })}
                                className={errors.content ? "input-error" : ""}
                            ></textarea>
                            {errors.content && (
                                <span className="error-message">{errors.content.message}</span>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="modal-action-button add-button"
                                disabled={!isValid || isLoading}
                            >
                                {isLoading ? "Enviando..." : "Enviar Solicitação"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewSupportConsultant;