import React from "react";
import { Link, useNavigate } from "react-router-dom";
import file from '../image/file.png';
import '../css/Register.css';
import { API } from "../config";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().min(4, "Nome deve ter no mínimo 4 caracteres.").required("Nome é obrigatório."),
    phone: yup
      .string()
      .matches(/^\d{11}$/, "O telefone deve ter exatamente 11 dígitos.")
      .required("Telefone é obrigatório."),
    email: yup.string().email("Informe um e-mail válido.").required("E-mail é obrigatório."),
    password: yup.string().min(8, "A senha deve ter pelo menos 8 caracteres.").required("Senha é obrigatória."),
  });

const Register = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });
    
    const onSubmit = async (data) => {
        data.status = "ativo";
        try {
          const response = await fetch(`${API}/auth/customer/register`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
            navigate("/login");
          } else {
            toast.error("Erro no cadastro. Tente novamente.");
            console.error(response);
          }
        } catch (error) {
          console.error("Erro ao realizar cadastro", error);
          toast.error("Erro ao efetuar cadastro");
        }
      };

    return (
        <div className="container-main-register">
            <div className="box-register-1">
                <img src={file} alt="logo site" />
            </div>
            <div className="box-register-2">
                <div className="title-register">Registre-se</div>
                <form className="form-register" onSubmit={handleSubmit(onSubmit)} >
                    <div className="form-field-register">
                        <label htmlFor="name">Nome:</label>
                        <input 
                        {...register("name")} 
                        type="text"/>
                        {errors.name && <p className="error-message">{errors.name.message}</p>}
                    </div>
                    <div className="form-field-register">
                        <label htmlFor="phone">Telefone:</label>
                        <input 
                        {...register("phone")}
                        type="number" 
                        />
                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                    </div>
                    <div className="form-field-register">
                        <label htmlFor="e-mail">E-mail:</label>
                        <input
                        {...register("email")}
                        type="text" 
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                    <div className="form-field-register">
                        <label htmlFor="password">Senha:</label>
                        <input
                        {...register("password")}
                        type="password"
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>
                    <div className="container-button-submit">
                        <button type="submit">salvar</button>
                    </div>
                </form>
                <div className="redirection-to-login">
                    <p> Faça <Link className="login-link" to={'/login'}>Login</Link> com sua conta</p>
                </div>
            </div>
        </div>
    )
}

export default Register