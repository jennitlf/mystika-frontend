import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import { useForm, Controller } from "react-hook-form";
import { API } from "../../config";
import '../../css/consultant/login.css'

const LoginConsultant = () => {
    const { control, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const onSubmit = async (data) => {
        try{
            const response = await fetch(`${API}auth/consultant/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const { access_token } = await response.json();
                login(access_token);
                toast.success("Login realizado com sucesso!");
                navigate("/consultor/consultas-agendadas");
            } else {
                toast.error("Erro no login. Verifique suas credenciais.");
            }
        }catch(error) {
            console.error("Erro no login", error);
            toast.error(error);
        }
    };

    return(
        <div className="container-login-consultant">
            <div className="content-left-login-consultant">
                <div className="content-text-login-consultant">
                    <h3 className="content-text-1-login animate-slide-in">
                            Bem vindo!
                    </h3>
                </div>
            </div>
            <div className="content-right-login-consultant">
                <div className="content-sign-in-login">
                    <h5>
                        Not registered?? <Link to={'/consultor/register'}>Register here!</Link>
                    </h5>
                </div>
                <div className="container-form-login-consultant">
                    <div className="container-title-login-consultant">
                        <h3>Login</h3>
                    </div>
                    <form className="form-login-consultant" onSubmit={handleSubmit(onSubmit)} >
                        <Controller
                        name="email"
                        id="email-login-consultant"
                        control={control}
                        rules={{ required: "email is required" }}
                        render={({ field }) => (
                            <input {...field} maxLength='60' className="input-emil-login-consultant" placeholder="Email"/>
                        )}
                        />
                        <Controller
                            name="password"
                            id="password-login-consultant"
                            control={control}
                            rules={{ required: "password is required" }}
                            render={({ field }) => (
                                <input {...field} maxLength='15' className="input-password-login-consultant" placeholder="Password"/>
                            )}
                        />
                         <button
                        type="submit"
                        className="button-submit-login-consultant"
                        >
                        Entrar
                        </button>
                    </form>
                </div>
                <div className="container-copyright-login-consultant">
                    <p>@copyright 2025. Copyright inc ltd</p>
                </div>
            </div>
        </div>
    )
}

export default LoginConsultant;