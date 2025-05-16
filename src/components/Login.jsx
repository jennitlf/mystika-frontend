import React, { useContext } from "react";
import "../css/Login.css";
import file from '../image/file.png';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from "../context/AuthContext";
import { API } from "../config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    email: yup.string().email("Informe um email válido").required(),
    password: yup.string().min(7, "Informe o minimo de 7 caracteres").required()
})

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  })
  const { login } = useContext(AuthContext);
 

  const onSubmit = async (data) => {
    data.status = "ativo";
    try {
      const response = await fetch(`${API}/auth/customer/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { access_token } = await response.json(); 
        login(access_token);
        toast.success("Login realizado com sucesso!");
        navigate("/consultores");
      } else {
        toast.error("Erro no login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro no login", error);
      toast.error("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="container-main-login">
      <div className="box-login-1">
        <img src={file} alt="logo site" />
      </div>
      <div className="box-login-2">
        <div className="title-login">Login</div>
        <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="e-mail">E-mail:</label>
            <input
              {...register("email")}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Senha:</label>
            <input
            {...register("password")}
              type="password"
            />
            {errors.password && <p className="error-message">{errors.password.password}</p>}
          </div>
          <div className="container-button-submit">
            <button type="submit">Entrar</button>
          </div>
        </form>
        <div className="redirection-to-resgitry">
          <p> Ainda não tem login? <Link className="registry-link" to="/register">Registre-se</Link></p>
        </div>
        <div className="redirection-to-recovery">
          <p><Link className="registry-link" to="/register">Esqueceu</Link> a senha?</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
