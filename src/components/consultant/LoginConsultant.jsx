import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import { useForm, Controller } from "react-hook-form";
import { API } from "../../config";
import '../../css/consultant/login.css'

const LoginConsultant = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${API}auth/consultant/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const { access_token, expires_in } = await response.json();

                if (!access_token || !expires_in) {
                    toast.error("Token ou expiração ausente na resposta.");
                    return;
                }

                login(access_token, expires_in);
                toast.success("Login realizado com sucesso!");
                navigate("/consultor/consultas-agendadas");
            } else {
                toast.error("Erro no login. Verifique suas credenciais.");
            }
        } catch (error) {
            console.error("Erro no login", error);
            toast.error("Erro inesperado no login.");
        }
    };

    return (
        <div className="container-login-consultant">
            <div className="content-left-login-consultant">
                <div className="content-text-login-consultant">
                    <h3 className="content-text-1-login animate-slide-in">
                        Bem-vindo!
                    </h3>
                </div>
            </div>
            <div className="content-right-login-consultant">
                <div className="content-sign-in-login">
                    <h5>
                        Ainda não registrado? <Link to={'/consultor/register'}>Registre-se aqui!</Link>
                    </h5>
                </div>
                <div className="container-form-login-consultant">
                    <div className="container-title-login-consultant">
                        <h3>Login do Consultor</h3>
                    </div>
                    <form className="form-login-consultant" onSubmit={handleSubmit(onSubmit)} >
                        <div className="form-field-login-consultant">
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "O email é obrigatório.",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Email inválido."
                                    }
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        maxLength='60'
                                        className="input-login-consultant"
                                        placeholder="Email"
                                    />
                                )}
                            />
                            {errors.email && <p className="error-message-login-consultant">{errors.email.message}</p>}
                        </div>

                        <div className="form-field-login-consultant">
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: "A senha é obrigatória.",
                                    minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres." }
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        maxLength='15'
                                        className="input-login-consultant"
                                        placeholder="Senha"
                                        type="password"
                                    />
                                )}
                            />
                            {errors.password && <p className="error-message-login-consultant">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="button-submit-login-consultant"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
                <div className="container-copyright-login-consultant">
                    <p>©copyright 2025. Copyright inc ltd</p>
                </div>
            </div>
        </div>
    );
};

export default LoginConsultant;
