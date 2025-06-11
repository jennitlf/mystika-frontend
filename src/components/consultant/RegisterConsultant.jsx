import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import "../../css/consultant/register.css";

const RegisterConsultant = () => {
    const { control, handleSubmit } = useForm();
    const [step, setStep] = useState(1);
    const [selectedFileName, setSelectedFileName] = useState("");

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name); 
        } else {
            setSelectedFileName("");
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
                        Already have an account? <Link to={'/consultor/login'}>Sign in here!</Link>
                    </h5>
                </div>
                <div className="container-form-register-consultant">
                    <div className="container-title-register-consultant">
                        <h3>Create An Account</h3>
                    </div>
                    <form className="form-register-consultant" onSubmit={handleSubmit(onSubmit)} >
                        {step === 1 && (
                            <div className="container-step1-register-consultant">
                                <div className="subcontainer-step1-register-consultant-up">
                                    <div className="content-step1-register-consultant">
                                        <Controller
                                            name="name"
                                            id="name-register-consultant"
                                            control={control}
                                            rules={{ required: "Name is required" }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='60' className="input-name-register-consultant" placeholder="Name"/>
                                            )}
                                        />
                                        <Controller
                                            name="cpf"
                                            id="cpf-register-consultant"
                                            control={control}
                                            rules={{ required: "CPF is required" }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='11' className="input-cpf-register-consultant" placeholder="CPF"/>
                                            )}
                                        />
                                    </div>
                                    <div className="content-step1-register-consultant">
                                        <Controller
                                            name="phone"
                                            id="phone-register-consultant"
                                            control={control}
                                            rules={{ required: "Phone is required" }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='15' className="input-phone-register-consultant" placeholder="Phone"/>
                                            )}
                                        />
                                        <Controller
                                            name="email"
                                            id="email-register-consultant"
                                            control={control}
                                            rules={{ required: "Email is required" }}
                                            render={({ field }) => (
                                                <input {...field} maxLength='60' className="input-email-register-consultant" placeholder="Email"/>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="subcontainer-step1-register-consultant-down">
                                   <Controller
                                    name="image_consultant"
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => (
                                        <>
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    handleFileChange(e); // Atualiza o estado local
                                                    field.onChange(e); // Passa o evento para o React Hook Form
                                                }}
                                                className="input-image-register-consultant"
                                                style={{ display: "none" }}
                                                id="file-input"
                                            />
                                            <label htmlFor="file-input" className="custom-file-upload">
                                                Escolha uma imagem
                                            </label>
                                            {selectedFileName && (
                                                <p className="file-name">{selectedFileName}</p>
                                            )}
                                        </>
                                    )}
                                />

                                </div>

                                
                            </div>
                        )}
                        {step === 2 && (
                            <div className="step2-register-consultant">
                                <div className="container-step2-register-consultant-up">
                                    <Controller
                                        name="profile_data"
                                        control={control}
                                        rules={{ required: "Profile data is required" }}
                                        render={({ field }) => (
                                            <textarea {...field} maxLength='800' id="profile-data-register" className="input-profile-register-consultant" placeholder="Fale sobre você"/>
                                        )}
                                    />
                                    <Controller
                                        name="about_specialties"
                                        control={control}
                                        rules={{ required: "Specialties are required" }}
                                        render={({ field }) => (
                                            <textarea {...field} maxLength='700' id="about-specialties-register" className="input-specialties-register-consultant" placeholder="Fale sobre suas especialidades"/>
                                        )}
                                    /> 
                                </div>
                                <div className="container-step2-register-consultant-down">  
                                    <Controller
                                        name="consultants_story"
                                        id="consultants-story-register"
                                        control={control}
                                        rules={{ required: "Consultant's story is required" }}
                                        render={({ field }) => (
                                            <textarea {...field} maxLength='700' className="input-story-register-consultant" placeholder="Fale sobre sua história como consultor"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="step3-register-consultant">
                                <Controller
                                    name="consultations_carried_out"
                                    id="consultations-carried-out-register"
                                    control={control}
                                    rules={{ required: "Consultations carried out is required" }}
                                    render={({ field }) => (
                                        <input {...field} 
                                        type="number"
                                        maxLength={'4'}
                                        className="input-consultations-register-consultant" 
                                        placeholder="Quantas consultas você já realizou?"
                                        />
                                    )}
                                />
                                <Controller
                                name="payment_plan"
                                id="payment-plan-register"
                                control={control}
                                rules={{ required: "Payment plan is required" }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        id="payment-plan-register"
                                        className="input-payment-register-consultant"
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
                                <Controller
                                    name="password"
                                    id="password-register-consultant"
                                    control={control}
                                    rules={{ required: "Password is required" }}
                                    render={({ field }) => (
                                        <input {...field} maxLength='15' className="input-password-register-consultant" placeholder="Password" type="password"/>
                                    )}
                                />
                            </div>
                        )}
                        <div className="navigation-buttons-register-consultant">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={previousStep}
                                    className="button-prev-register-consultant"
                                >
                                    Previous
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="button-next-register-consultant"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="button-submit-register-consultant"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="container-copyright-register-consultant">
                    <p>@copyright 2025. Copyright inc ltd</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterConsultant;
