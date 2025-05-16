import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DataUser.css";
import { API } from "../config.js";
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().min(4, "Nome deve ter no mínimo 4 caracteres."),
    phone: yup
      .string()
      .matches(/^\d{11}$/, "O telefone deve ter exatamente 11 dígitos.")
  });

  const DataUser = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const { user, token } = useContext(AuthContext);
    const [dataUser, setDataUser] = useState({});
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dataUserFetch = async () => {
            try {
                const response = await fetch(`${API}/user/id/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Erro ao acessar dados do usuário");
                }
                const data = await response.json();
                setDataUser(data);
                setName(data.name); // Inicializa o estado "name" com o valor do usuário
                setPhone(data.phone); // Inicializa o estado "phone" com o valor do usuário
                setLoading(false);
            } catch (error) {
                console.error("Erro:", error);
                setLoading(false); // Atualiza o estado de carregamento mesmo em caso de erro
            }
        };
        dataUserFetch();
    }, [user.id, token]);

    const onSubmit = async (data) => {
        const updatedData = { ...data, name, phone, status: "ativo" };
        try {
            const response = await fetch(`${API}/user/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (response.ok) {
                toast.success("Dados atualizados com sucesso");
            } else {
                toast.error("Erro ao atualizar dados.");
                console.error(response);
            }
        } catch (error) {
            console.error("Erro ao atualizar dados.", error);
            toast.error("Erro ao atualizar dados.");
        }
    };

    // Retorno condicional para o estado de carregamento
    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <form className="container-dataUser" onSubmit={handleSubmit(onSubmit)}>
            <h3>Dados do usuário</h3>
            <div className="box-dataUser">
                <label htmlFor="name">Nome:</label>
                <input
                    type="text"
                    {...register("name")}
                    value={name} // Usa o estado "name" como valor do campo
                    onChange={(e) => setName(e.target.value)} // Atualiza dinamicamente o estado "name"
                />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>
            <div className="box-dataUser">
                <label htmlFor="phone">Telefone:</label>
                <input
                    type="text"
                    {...register("phone")}
                    value={phone} // Usa o estado "phone" como valor do campo
                    onChange={(e) => setPhone(e.target.value)} // Atualiza dinamicamente o estado "phone"
                />
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>
            <div className="box-dataUser">
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    value={dataUser.email || ""}
                    disabled={true}
                />
            </div>
            <div className="container-button-submit">
                <button type="submit">Salvar</button>
            </div>
        </form>
    );
};

export default DataUser;
