import React, { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config";
import "../../css/consultant/register.css";
import { toast } from "react-toastify";

const RegisterConsultant = () => {
    const { control, handleSubmit, trigger, setValue, formState: { errors } } = useForm({
        mode: "onBlur"
    });
    const [step, setStep] = useState(1);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const allowedImageTypes = useMemo(() =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    , []);

    const formatCpf = useCallback((value) => {
        if (!value) return "";
        let cpf = value.replace(/\D/g, '');

        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return cpf;
    }, []);

    const isValidCpf = useCallback((cpf) => {
        if (typeof cpf !== 'string') return false;
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

        const CpfDigits = cpf.split('').map(el => +el);
        const rest = (count) => {
            let sum = 0;
            for (let i = 0; i < count; i++) {
                sum += CpfDigits[i] * (count + 1 - i);
            }
            const result = 11 - (sum % 11);
            return result > 9 ? 0 : result;
        };

        return rest(9) === CpfDigits[9] && rest(10) === CpfDigits[10];
    }, []);

    const onSubmit = useCallback(async (data) => {
        setError(null);
        setIsLoading(true);

        const formData = new FormData();

        for (const key in data) {
            if (key !== 'image_consultant') {
                if (key === 'cpf') {
                    formData.append(key, data[key].replace(/\D/g, ''));
                } else if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }
        }
        formData.append('role', 'consultant');

        if (data.image_consultant && data.image_consultant[0]) {
            formData.append('image_consultant', data.image_consultant[0]);
        }

        try {
            const response = await fetch(`${API}auth/consultant/register`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no registro');
            }

            const result = await response.json();
            console.log("Registro bem-sucedido:", result);
            navigate('/consultor/login');
        } catch (err) {
            console.error("Erro ao registrar:", err.message);
            setError(err.message);
            toast.error(err.message)
        } finally {
            setIsLoading(false);
        }
    }, [navigate, setError, setIsLoading]);

    const handleNextStep = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await trigger(["name", "cpf", "phone", "email", "image_consultant"]);
            if (isValid) {
                const cpfValue = control._fields.cpf._f.value;
                if (!isValidCpf(cpfValue)) {
                    setError('CPF inválido.');
                    isValid = false;
                } else {
                    setError(null);
                }
            }
        } else if (step === 2) {
            isValid = await trigger(["profile_data", "about_specialties", "consultants_story"]);
        } else if (step === 3) {
            isValid = await trigger(["consultations_carried_out", "payment_plan", "password"]);
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

    const previousStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            if (!allowedImageTypes.includes(file.type)) {
                setError('Tipo de arquivo não permitido. Por favor, selecione uma imagem (JPG, PNG, GIF, WebP).');
                setSelectedFileName("");
                setValue("image_consultant", null, { shouldValidate: true });
                event.target.value = null;
                return false;
            }
            setError(null);
            setSelectedFileName(file.name);
            setValue("image_consultant", file, { shouldValidate: true });
            return true;
        } else {
            setSelectedFileName("");
            setValue("image_consultant", null, { shouldValidate: true });
            return true;
        }
    }, [allowedImageTypes, setError, setValue]);

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
                                                <input {...field} maxLength='60' className="input-consultant" placeholder="Nome completo" disabled={isLoading}/>
                                            )}
                                        />
                                        {errors.name && <p className="error-message">{errors.name.message}</p>}
                                    </div>
                                    <div className="form-field-consultant">
                                        <Controller
                                            name="cpf"
                                            id="cpf-register-consultant"
                                            control={control}
                                            rules={{
                                                required: "O CPF é obrigatório.",
                                                validate: (value) => {
                                                    const cleanedCpf = value.replace(/\D/g, '');
                                                    if (cleanedCpf.length !== 11) {
                                                        return "O CPF deve ter 11 dígitos.";
                                                    }
                                                    return isValidCpf(cleanedCpf) || "CPF inválido.";
                                                }
                                            }}
                                            render={({ field: { onChange, value, ...rest } }) => (
                                                <input
                                                    {...rest}
                                                    maxLength='14'
                                                    className="input-consultant"
                                                    placeholder="CPF"
                                                    disabled={isLoading}
                                                    value={formatCpf(value)}
                                                    onChange={(e) => {
                                                        const cleanedValue = e.target.value.replace(/\D/g, '');
                                                        onChange(cleanedValue);
                                                    }}
                                                />
                                            )}
                                        />
                                        {errors.cpf && <p className="error-message">{errors.cpf.message}</p>}
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
                                                    value: /^\d{1,15}$/,
                                                    message: "Telefone inválido. Use apenas números e no máximo 15 dígitos."
                                                }
                                            }}
                                            render={({ field: { onChange, value, ...rest } }) => (
                                                <input
                                                    {...rest}
                                                    maxLength='15'
                                                    className="input-consultant"
                                                    placeholder="Telefone (apenas números)"
                                                    disabled={isLoading}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const cleanedValue = e.target.value.replace(/\D/g, '');
                                                        onChange(cleanedValue);
                                                    }}
                                                />
                                            )}
                                        />
                                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
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
                                                <input {...field} maxLength='60' className="input-consultant" placeholder="Email" disabled={isLoading}/>
                                            )}
                                        />
                                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                                    </div>
                                </div>
                                <div className="subcontainer-step1-register-consultant-down">
                                   <Controller
                                   name="image_consultant"
                                   control={control}
                                   rules={{
                                       required: "A imagem é obrigatória.",
                                       validate: {
                                           fileType: (value) => {
                                               if (!value) return "A imagem é obrigatória.";
                                               if (!value[0]) return "A imagem é obrigatória.";
                                               if (!allowedImageTypes.includes(value[0].type)) {
                                                   return 'Tipo de arquivo não permitido. Por favor, selecione uma imagem (JPG, PNG, GIF, WebP).';
                                               }
                                               return true;
                                           }
                                       }
                                   }}
                                   render={({ field: { onChange, value, ...rest } }) => (
                                       <>
                                           <input
                                               type="file"
                                               accept="image/jpeg, image/png, image/gif, image/webp"
                                               onChange={(e) => {
                                                   const isValidFile = handleFileChange(e);
                                                   if (isValidFile || !e.target.files[0]) {
                                                       onChange(e.target.files);
                                                   } else {
                                                       onChange(null);
                                                   }
                                               }}
                                               className="input-consultant-file"
                                               style={{ display: "none" }}
                                               id="file-input-consultant"
                                               disabled={isLoading}
                                               {...rest}
                                           />
                                           <label htmlFor="file-input-consultant" className="custom-file-upload-consultant" style={isLoading ? { cursor: 'not-allowed', opacity: 0.6 } : {}}>
                                               Escolha uma imagem de perfil
                                           </label>
                                           {selectedFileName && (
                                               <p className="file-name">{selectedFileName}</p>
                                           )}
                                       </>
                                   )}
                               />
                                {errors.image_consultant && <p className="error-message">{errors.image_consultant.message}</p>}
                                {error && <p className="error-message">{error}</p>}
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
                                            <textarea {...field} maxLength='800' id="profile-data-register" className="textarea-consultant" placeholder="Fale sobre seu perfil profissional (min. 50 caracteres)" disabled={isLoading}/>
                                        )}
                                    />
                                    {errors.profile_data && <p className="error-message">{errors.profile_data.message}</p>}
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
                                            <textarea {...field} maxLength='700' id="about-specialties-register" className="textarea-consultant" placeholder="Descreva suas especialidades (min. 30 caracteres)" disabled={isLoading}/>
                                        )}
                                    />
                                    {errors.about_specialties && <p className="error-message">{errors.about_specialties.message}</p>}
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
                                            <textarea {...field} maxLength='700' className="textarea-consultant" placeholder="Conte sua história como consultor (min. 50 caracteres)" disabled={isLoading}
                                            />
                                        )}
                                    />
                                    {errors.consultants_story && <p className="error-message">{errors.consultants_story.message}</p>}
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
                                                disabled={isLoading}
                                            />
                                        )}
                                    />
                                    {errors.consultations_carried_out && <p className="error-message">{errors.consultations_carried_out.message}</p>}
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
                                                disabled={isLoading}
                                            >
                                                <option value="">
                                                    Selecione um plano de pagamento
                                                </option>
                                                <option value="mensal">Mensal</option>
                                                <option value="semestral">Semestral</option>
                                                <option value="anual">Anual</option>
                                            </select>
                                        )}
                                    />
                                    {errors.payment_plan && <p className="error-message">{errors.payment_plan.message}</p>}
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
                                            <input {...field} maxLength='15' className="input-consultant" placeholder="Crie sua senha" type="password" disabled={isLoading}/>
                                        )}
                                    />
                                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                                </div>
                            </div>
                        )}
                        <div className="container-button-register-consultant">
                            {step > 1 && (
                                <button type="button" onClick={previousStep} className="button-prev-consultant-register-consultant" disabled={isLoading}>
                                    Voltar
                                </button>
                            )}
                            {step < 3 && (
                                <button type="button" onClick={handleNextStep} className="button-next-consultant-register-consultant" disabled={isLoading}>
                                    Próximo
                                </button>
                            )}
                            {step === 3 && (
                                <button type="submit" className="button-submit-consultant-register-consultant" disabled={isLoading}>
                                    {isLoading ? "Registrando..." : "Cadastrar"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterConsultant;