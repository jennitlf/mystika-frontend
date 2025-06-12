import React, { useState, useEffect, useContext } from "react";
import "../../css/consultant/dataUserConsultant.css";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../config";

const DataUserConsultant = () => {
    const [consultantData, setConsultantData] = useState(null);
    const { user, token } = useContext(AuthContext);
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchConsultantData = async () => {
            try {
                const response = await fetch(`${API}consultant/${user.id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados do consultor");
                }
                const data = await response.json();
                setConsultantData(data);
                reset(data);
            } catch (error) {
                console.error("Erro ao buscar dados do consultor:", error);
                toast.error("Erro ao buscar dados.");
            }
        };

        fetchConsultantData();
    }, [user.id, token, reset]);

    const onSubmit = async (data) => {
    const { id, created_at, updated_at, role, status, password, ...filteredData } = data;
    try {
        const response = await fetch(`${API}consultant/${user.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filteredData),
        });

        if (response.ok) {
            toast.success("Dados atualizados com sucesso!");
        } else {
            const errorData = await response.json();
            console.error("Erro no backend:", errorData);
            throw new Error("Erro ao atualizar dados");
        }
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        toast.error("Erro ao atualizar dados.");
    }
};

    if (!consultantData) return <div>Carregando...</div>;

    return (
        <div className="container-data-user-consultant">
            <div className="card-data-user-consultant">
                <div className="box-title-data-user-consultant">
                    <h2 className="title-data-user-consultant">Seus Dados</h2>
                </div>
                <form className="form-data-user-consultant" onSubmit={handleSubmit(onSubmit)}>
                    <div className="box-data-user-consultant box-name-cpf-data-user-consultant">
                        <div className="field-input-data-user-consultant name-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant name" htmlFor="name">Nome</label>
                            </div>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Nome é obrigatório." }}
                                defaultValue={consultantData.name || ""}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="input-name-data-user-consultant"
                                    />
                                )}
                            />
                            {errors.name && <span className="error-data-user-consultant">{errors.name.message}</span>}
                        </div>

                        <div className="field-input-data-user-consultant cpf-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant cpf" htmlFor="cpf">CPF</label>
                            </div>
                            <Controller
                                name="cpf"
                                control={control}
                                rules={{ required: "CPF é obrigatório." }}
                                defaultValue={consultantData.cpf || ""}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="input-cpf-data-user-consultant"
                                        disabled
                                    />
                                )}
                            />
                            {errors.cpf && <span className="error-data-user-consultant">{errors.cpf.message}</span>}
                        </div>
                    </div>
                    <div className="box-data-user-consultant">              
                        <div className="field-input-data-user-consultant phone-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant phone" htmlFor="phone">Telefone</label>
                            </div>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{ required: "Telefone é obrigatório." }}
                                defaultValue={consultantData.phone || ""}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="input-phone-data-user-consultant"
                                    />
                                )}
                            />
                            {errors.phone && <span className="error-data-user-consultant">{errors.phone.message}</span>}
                        </div>

                        <div className="field-input-data-user-consultant email-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant email" htmlFor="email">E-mail</label>
                            </div>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue={consultantData.email || ""}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="email"
                                        className="input-email-data-user-consultant"
                                        disabled
                                    />
                                )}
                            />
                        </div>
                    </div> 
                    <div className="box-data-user-consultant">  
                        <div className="field-textarea-data-user-consultant profile_data">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant profile_data-data-user-consultant" htmlFor="profile_data">Descrição do Perfil</label>
                            </div>
                            <Controller
                                name="profile_data"
                                control={control}
                                rules={{ required: "Descrição do Perfil é obrigatória." }}
                                defaultValue={consultantData.profile_data || ""}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="textarea-profile_data-data-user-consultant"
                                    />
                                )}
                            />
                            {errors.profile_data && <span className="error-data-user-consultant">{errors.profile_data.message}</span>}
                        </div>

                        <div className="field-textarea-data-user-consultant consultants_story-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant consultants_story" htmlFor="consultants_story">História do Consultor</label>
                            </div>
                            <Controller
                                name="consultants_story"
                                control={control}
                                rules={{ required: "História do Consultor é obrigatória." }}
                                defaultValue={consultantData.consultants_story || ""}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="textarea-consultants_story-data-user-consultant"
                                    />
                                )}
                            />
                            {errors.consultants_story && <span className="error-data-user-consultant">{errors.consultants_story.message}</span>}
                        </div>
                    </div>
                    <div className="box-data-user-consultant">
                        <div className="field-textarea-data-user-consultant about_specialties-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant about_specialties" htmlFor="about_specialties">Especialidades</label>
                            </div>
                            <Controller
                                name="about_specialties"
                                control={control}
                                rules={{ required: "Especialidades são obrigatórias." }}
                                defaultValue={consultantData.about_specialties || ""}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className=" textarea-about_specialties-data-user-consultant"
                                    />
                                )}
                            />
                            {errors.about_specialties && <span className="error-data-user-consultant">{errors.about_specialties.message}</span>}
                        </div>

                        <div className="field-input-select-data-user-consultant payment_plan-data-user-consultant">
                            <div className="box-label-data-user-consultant">
                                <label className="label-data-user-consultant payment_plan" htmlFor="payment_plan">Plano de Pagamento</label>
                            </div>
                            <Controller
                                name="payment_plan"
                                control={control}
                                rules={{ required: "Plano de Pagamento é obrigatório." }}
                                defaultValue={consultantData.payment_plan || ""}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className=" input-payment_plan-data-user-consultant"
                                    >
                                        <option value="" disabled>
                                            Selecione um plano de pagamento
                                        </option>
                                        <option value="plan1">mensal</option>
                                        <option value="plan2">semestral</option>
                                        <option value="plan3">anual</option>
                                    </select>    
                                )}
                            />
                            {errors.payment_plan && <span className="error-data-user-consultant">{errors.payment_plan.message}</span>}
                        </div>
                    </div>
                    <button type="submit" className="button-submit-data-user-consultant">
                        Atualizar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DataUserConsultant;
