import React, { useState, useRef } from "react"; 
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import "../../css/consultant/register.css";

const RegisterConsultant = () => {
   
    const { control, handleSubmit, trigger, setValue, formState: { errors } } = useForm();
    const [step, setStep] = useState(1);
    const [selectedFileName, setSelectedFileName] = useState("");

    
    const fileInputRef = useRef(null);

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        
        alert("Formulário enviado com sucesso! Verifique o console para os dados.");
        
    };

    const handleNextStep = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await trigger(["name", "cpf", "phone", "email"]); 
        } else if (step === 2) {
            isValid = await trigger(["profile_data", "about_specialties", "consultants_story"]);
        } else if (step === 3) {
            
            isValid = await trigger(["consultations_carried_out", "payment_plan", "password", "image_consultant"]);
        }
        
        if (isValid) {
            setStep((prev) => Math.min(prev + 1, 3));
        } else {
            const firstErrorField = Object.keys(errors).find(key => errors[key]);
            if (firstErrorField) {
                document.getElementById(firstErrorField)?.focus();
            }
        }
    };

    const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            setValue("image_consultant", file, { shouldValidate: true }); 
        } else {
            setSelectedFileName("");
            setValue("image_consultant", null, { shouldValidate: true });
        }
    };

    return (
        <div className="container-register">
            <div className="content-left-register-consultant">
                <div className="content-text-register-consultant">
                    <h3 className="content-text-1-register animate-slide-in">
                        Conecte-se com aqueles que buscam orientação e sabedoria.
                    </h3>
                </div>
            </div>
            <div className="content-right-register-consultant">
                <div className="content-sign-in-register">
                    <h5>
                        Já tem uma conta? <Link to={'/consultor/login'}>Entre aqui!</Link>
                    </h5>
                </div>
                <div className="container-form-register-consultant">
                    <div className="container-title-register-consultant">
                        <h3>Crie sua conta de Consultor</h3>
                    </div>
                    <form className="form-register-consultant" onSubmit={handleSubmit(onSubmit)} >
                        {step === 1 && (
                            <div className="container-step1-register-consultant">
                                <div className="subcontainer-step1-register-consultant-up">
                                    <div className="form-field-consultant">
                                        <Controller
                                            name="name"
                                            id="name-register-consultant"
                                            control={control}
                                            rules={{ required: "O nome é obrigatório." }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='60' className="input-consultant" placeholder="Nome completo"/>
                                            )}
                                        />
                                        {errors.name && <p className="error-message-consultant">{errors.name.message}</p>}
                                    </div>
                                    <div className="form-field-consultant">
                                        <Controller
                                            name="cpf"
                                            id="cpf-register-consultant"
                                            control={control}
                                            rules={{
                                                required: "O CPF é obrigatório.",
                                                pattern: {
                                                    value: /^\d{11}$/,
                                                    message: "CPF inválido. Use apenas números."
                                                }
                                            }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='11' className="input-consultant" placeholder="CPF (apenas números)"/>
                                            )}
                                        />
                                        {errors.cpf && <p className="error-message-consultant">{errors.cpf.message}</p>}
                                    </div>
                                </div>
                                <div className="subcontainer-step1-register-consultant-middle">
                                    <div className="form-field-consultant">
                                        <Controller
                                            name="phone"
                                            id="phone-register-consultant"
                                            control={control}
                                            rules={{
                                                required: "O telefone é obrigatório.",
                                                pattern: {
                                                    value: /^\d{10,11}$/,
                                                    message: "Telefone inválido. Use apenas números."
                                                }
                                            }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='15' type="number" className="input-consultant" placeholder="Telefone (apenas números)"/>
                                            )}
                                        />
                                        {errors.phone && <p className="error-message-consultant">{errors.phone.message}</p>}
                                    </div>
                                    <div className="form-field-consultant">
                                        <Controller
                                            name="email"
                                            id="email-register-consultant"
                                            control={control}
                                            rules={{
                                                required: "O email é obrigatório.",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                    message: "Email inválido."
                                                }
                                            }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='60' className="input-consultant" placeholder="Email"/>
                                            )}
                                        />
                                        {errors.email && <p className="error-message-consultant">{errors.email.message}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="container-step2-register-consultant">
                                <div className="form-field-consultant">
                                    <Controller
                                        name="profile_data"
                                        control={control}
                                        rules={{
                                            required: "Seu perfil profissional é obrigatório.",
                                            minLength: { value: 50, message: "Mínimo de 50 caracteres." }
                                        }}
                                        render={({ field }) => (
                                            <textarea {...field} maxLength='800' className="textarea-consultant" placeholder="Fale sobre seu perfil profissional (min. 50 caracteres)"/>
                                        )}
                                    />
                                    {errors.profile_data && <p className="error-message-consultant">{errors.profile_data.message}</p>}
                                </div>
                                <div className="form-field-consultant">
                                    <Controller
                                        name="about_specialties"
                                        control={control}
                                        rules={{
                                            required: "Suas especialidades são obrigatórias.",
                                            minLength: { value: 30, message: "Mínimo de 30 caracteres." }
                                        }}
                                        render={({ field }) => (
                                            <textarea {...field} maxLength='700' className="textarea-consultant" placeholder="Descreva suas especialidades (min. 30 caracteres)"/>
                                        )}
                                    />
                                    {errors.about_specialties && <p className="error-message-consultant">{errors.about_specialties.message}</p>}
                                </div>
                                <div className="form-field-consultant">
                                    <Controller
                                        name="consultants_story"
                                        id="consultants-story-register"
                                        control={control}
                                        rules={{
                                            required: "Sua história como consultor é obrigatória.",
                                            minLength: { value: 50, message: "Mínimo de 50 caracteres." }
                                        }}
                                        render={({ field }) => (
                                            <textarea {...field} maxLength='700' className="textarea-consultant" placeholder="Conte sua história como consultor (min. 50 caracteres)"/>
                                        )}
                                    />
                                    {errors.consultants_story && <p className="error-message-consultant">{errors.consultants_story.message}</p>}
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="container-step3-register-consultant">
                                <div className="form-field-consultant">
                                    <Controller
                                        name="consultations_carried_out"
                                        id="consultations-carried-out-register"
                                        control={control}
                                        rules={{
                                            required: "Este campo é obrigatório.",
                                            min: { value: 0, message: "Não pode ser negativo." },
                                            max: { value: 9999, message: "Máximo de 4 dígitos." }
                                        }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="number"
                                                className="input-consultant"
                                                placeholder="Quantas consultas você já realizou?"
                                                onWheel={(e) => e.target.blur()}
                                            />
                                        )}
                                    />
                                    {errors.consultations_carried_out && <p className="error-message-consultant">{errors.consultations_carried_out.message}</p>}
                                </div>
                                <div className="form-field-consultant">
                                    <Controller
                                    name="payment_plan"
                                    id="payment-plan-register"
                                    control={control}
                                    rules={{ required: "Um plano de pagamento é obrigatório." }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="payment-plan-register"
                                            className="select-consultant"
                                        >
                                            <option value="">
                                                Selecione um plano de pagamento
                                            </option>
                                            <option value="monthly">Mensal</option>
                                            <option value="biannual">Semestral</option>
                                            <option value="annual">Anual</option>
                                        </select>
                                    )}
                                    />
                                    {errors.payment_plan && <p className="error-message-consultant">{errors.payment_plan.message}</p>}
                                </div>
                                <div className="form-field-consultant">
                                    <Controller
                                        name="password"
                                        id="password-register-consultant"
                                        control={control}
                                        rules={{
                                            required: "A senha é obrigatória.",
                                            minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres." }
                                        }}
                                        render={({ field }) => (
                                            <input {...field} maxLength='15' className="input-consultant" placeholder="Crie sua senha" type="password"/>
                                        )}
                                    />
                                    {errors.password && <p className="error-message-consultant">{errors.password.message}</p>}
                                </div>
                                
                                <div className="form-field-consultant file-upload-field">
                                    <input
                                        type="file"
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        className="input-consultant-file"
                                        id="file-input-consultant"
                                        
                                    />
                                    <label htmlFor="file-input-consultant" className="custom-file-upload-consultant">
                                        Escolha uma imagem de perfil
                                    </label>
                                    {selectedFileName && (
                                        <span className="file-name-display-consultant">{selectedFileName}</span>
                                    )}
                                    
                                    {errors.image_consultant && <p className="error-message-consultant">{errors.image_consultant.message}</p>}
                                </div>
                            </div>
                        )}
                        <div className="navigation-buttons-register-consultant">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={previousStep}
                                    className="button-consultant button-prev-consultant"
                                >
                                    Voltar
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="button-consultant button-next-consultant"
                                >
                                    Próximo
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="button-consultant button-submit-consultant"
                                >
                                    Registrar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="container-copyright-register-consultant">
                    <p>©copyright 2025. Copyright inc ltd</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterConsultant;