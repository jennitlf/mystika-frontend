import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import "../../css/consultant/register.css";

const RegisterConsultant = () => {
    const { control, handleSubmit, watch } = useForm();
    const [step, setStep] = useState(1);

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="container-register">
            <div className="content-left">
                <div className="content-text-register">
                    <h3 className="content-text-1-register animate-slide-in">
                        Conecte-se com aqueles que buscam orientação e sabedoria.
                    </h3>
                </div>
            </div>
            <div className="content-right">
                <div className="content-sign-in-register">
                    <h5>
                        Already have an account? <Link>Sign in here!</Link>
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
                                            control={control}
                                            rules={{ required: "Name is required" }}
                                            render={({ field }) => (
                                                <input {...field} className="input-name-register-consultant" placeholder="Name"/>
                                            )}
                                        />
                                        <Controller
                                            name="cpf"
                                            control={control}
                                            rules={{ required: "CPF is required" }}
                                            render={({ field }) => (
                                                <input {...field} className="input-cpf-register-consultant" placeholder="CPF"/>
                                            )}
                                        />
                                    </div>
                                    <div className="content-step1-register-consultant">
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{ required: "Phone is required" }}
                                            render={({ field }) => (
                                                <input {...field} className="input-phone-register-consultant" placeholder="Phone"/>
                                            )}
                                        />
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{ required: "Email is required" }}
                                            render={({ field }) => (
                                                <input {...field} className="input-email-register-consultant" placeholder="Email"/>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="subcontainer-step1-register-consultant-down">
                                    <Controller
                                    name="image_consultant"
                                    control={control}
                                    rules={{ required: "Image URL is required" }}
                                    render={({ field }) => (
                                        <input {...field} className="input-image-register-consultant" placeholder="Image URL" />
                                    )}
                                    />
                                </div>
                                
                            </div>
                        )}
                        {step === 2 && (
                            <div className="step2-register-consultant">
                                
                                <Controller
                                    name="consultants_story"
                                    control={control}
                                    rules={{ required: "Consultant's story is required" }}
                                    render={({ field }) => (
                                        <textarea {...field} className="input-story-register-consultant" placeholder="Consultant's story"
                                        />
                                    )}
                                />
                                <Controller
                                    name="about_specialties"
                                    control={control}
                                    rules={{ required: "Specialties are required" }}
                                    render={({ field }) => (
                                        <textarea {...field} className="input-specialties-register-consultant" placeholder="About specialties"/>
                                    )}
                                />
                                <Controller
                                    name="profile_data"
                                    control={control}
                                    rules={{ required: "Profile data is required" }}
                                    render={({ field }) => (
                                        <textarea {...field} className="input-profile-register-consultant" placeholder="Profile data"/>
                                    )}
                                />
                                
                            </div>
                        )}
                        {step === 3 && (
                            <div className="step3-register-consultant">
                                <Controller
                                    name="consultations_carried_out"
                                    control={control}
                                    rules={{ required: "Consultations carried out is required" }}
                                    render={({ field }) => (
                                        <input {...field} className="input-consultations-register-consultant" placeholder="Consultations carried out"/>
                                    )}
                                />
                                <Controller
                                    name="payment_plan"
                                    control={control}
                                    rules={{ required: "Payment plan is required" }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="input-payment-register-consultant"
                                            placeholder="Payment Plan"
                                        />
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: "Password is required" }}
                                    render={({ field }) => (
                                        <input {...field} className="input-password-register-consultant" placeholder="Password" type="password"/>
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
