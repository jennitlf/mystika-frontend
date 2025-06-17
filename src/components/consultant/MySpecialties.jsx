import React, { useState, useEffect, useContext, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import "../../css/consultant/mySpecialties.css";
import { toast } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';

const MySpecialties = () => {
    const { token, user } = useContext(AuthContext);
    const [mySpecialties, setMySpecialties] = useState([]);
    const [availableSpecialties, setAvailableSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAvailable, setLoadingAvailable] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            id_specialty: "",
            duration: "",
            value_per_duration: ""
        }
    });

    const fetchMySpecialties = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API}consultant-specialty?idConsultant=${user.id}&page=1&limit=99`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Não foi possível buscar suas especialidades cadastradas.");
            }
            const data = await response.json();
            setMySpecialties(data.data);
        } catch (error) {
            console.error("Erro ao buscar minhas especialidades:", error);
            toast.error("Erro ao carregar suas especialidades.");
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    const fetchAvailableSpecialties = useCallback(async () => {
        setLoadingAvailable(true);
        try {
            const response = await fetch(`${API}specialty`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Não foi possível buscar especialidades disponíveis.");
            }
            const data = await response.json();
            const filteredSpecialties = data.filter(
                (specialty) => !mySpecialties.some((mySpec) => mySpec.id_specialty === specialty.id)
            );
            setAvailableSpecialties(filteredSpecialties);
        } catch (error) {
            console.error("Erro ao buscar especialidades disponíveis:", error);
            toast.error("Erro ao carregar especialidades disponíveis.");
        } finally {
            setLoadingAvailable(false);
        }
    }, [mySpecialties]);

    useEffect(() => {
        if (user && user.id && token) {
            fetchMySpecialties();
        }
    }, [token, user, fetchMySpecialties]);

    useEffect(() => {
        if (user && user.id && token && showAddModal) {
            fetchAvailableSpecialties();
        }
    }, [token, user, showAddModal, mySpecialties, fetchAvailableSpecialties]);

    const handleAddClick = () => {
        setShowAddModal(true);
        reset();
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                id_consultant: user.id,
                id_specialty: parseInt(data.id_specialty),
                duration: parseInt(data.duration),
                value_per_duration: parseFloat(data.value_per_duration)
            };

            const response = await fetch(`${API}consultant-specialty`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao adicionar especialidade.");
            }

            toast.success("Especialidade adicionada com sucesso!");
            handleCloseModal();
            fetchMySpecialties();
        } catch (error) {
            console.error("Erro ao adicionar especialidade:", error);
            toast.error(error.message || "Erro ao adicionar especialidade.");
        }
    };

    const handleRemoveSpecialty = async (consultantSpecialtyId) => {
        if (!window.confirm("Tem certeza que deseja remover esta especialidade?")) {
            return;
        }

        try {
            const response = await fetch(`${API}consultant-specialty/${consultantSpecialtyId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao remover especialidade.");
            }

            toast.success("Especialidade removida com sucesso!");
            fetchMySpecialties();
        } catch (error) {
            console.error("Erro ao remover especialidade:", error);
            toast.error(error.message || "Erro ao remover especialidade.");
        }
    };

    return (
        <div className="container-my-specialties">
            <div className="subcontainer-my-specialties">
                <div className="header-my-specialties">
                    <h2>Minhas Especialidades</h2>
                    <button className="add-specialty-button" onClick={handleAddClick}>
                        <span className="material-symbols-outlined" translate="no">add</span>
                        Adicionar Especialidade
                    </button>
                </div>
                <div className="content-my-specialties">
                    {loading ? (
                        <div className="message-container">
                            <p>Carregando suas especialidades...</p>
                        </div>
                    ) : mySpecialties.length > 0 ? (
                        <div className="specialties-list">
                            {mySpecialties.map((specialty) => (
                                <div key={specialty.id} className="specialty-card">
                                    <h3 className="card-specialty-name">{specialty.specialty.name_specialty}</h3>
                                    <p className="card-detail">
                                        <span className="material-symbols-outlined" translate="no">timer</span>
                                        Duração: {specialty.duration} minutos
                                    </p>
                                    <p className="card-detail">
                                        <span className="material-symbols-outlined" translate="no">payments</span>
                                        Valor por duração: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(specialty.value_per_duration)}
                                    </p>
                                    <div className="card-actions">
                                        <button
                                            className="action-button remove-button"
                                            title="Remover Especialidade"
                                            onClick={() => handleRemoveSpecialty(specialty.id)}
                                        >
                                            <span className="material-symbols-outlined" translate="no">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="message-container">
                            <p>Você ainda não possui especialidades cadastradas. Clique em "Adicionar Especialidade" para começar!</p>
                        </div>
                    )}
                </div>

                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-content-add">
                            <div className="modal-header-add">
                                <h2>Adicionar Nova Especialidade</h2>
                                <button className="modal-close-button" onClick={handleCloseModal}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-body-add">
                                    <div className="form-group">
                                        <label htmlFor="id_specialty">Especialidade</label>
                                        <Controller
                                            name="id_specialty"
                                            control={control}
                                            rules={{ required: "Selecione uma especialidade" }}
                                            render={({ field }) => (
                                                <select {...field} id="id_specialty">
                                                    <option value="">Selecione uma especialidade</option>
                                                    {loadingAvailable ? (
                                                        <option disabled>Carregando especialidades...</option>
                                                    ) : availableSpecialties.length > 0 ? (
                                                        availableSpecialties.map((specialty) => (
                                                            <option key={specialty.id} value={specialty.id}>
                                                                {specialty.name_specialty}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>Nenhuma especialidade disponível</option>
                                                    )}
                                                </select>
                                            )}
                                        />
                                        {errors.id_specialty && <p className="error-message">{errors.id_specialty.message}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="duration">Duração (minutos)</label>
                                        <Controller
                                            name="duration"
                                            control={control}
                                            rules={{
                                                required: "Informe a duração",
                                                min: { value: 1, message: "Duração mínima de 1 minuto" },
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "A duração deve conter apenas números"
                                                }
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    id="duration"
                                                    type="number"
                                                    placeholder="Ex: 30 (minutos)"
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                />
                                            )}
                                        />
                                        {errors.duration && <p className="error-message">{errors.duration.message}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="value_per_duration">Valor por Duração (R$)</label>
                                        <Controller
                                            name="value_per_duration"
                                            control={control}
                                            rules={{
                                                required: "Informe o valor",
                                                min: { value: 0.01, message: "Valor deve ser maior que R$0,00" }
                                            }}
                                            render={({ field }) => (
                                                <CurrencyInput
                                                    id="value_per_duration"
                                                    name="value_per_duration"
                                                    placeholder="Ex: R$ 50,00"
                                                    defaultValue={field.value}
                                                    decimalsLimit={2}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                                    className="currency-input"
                                                />
                                            )}
                                        />
                                        {errors.value_per_duration && <p className="error-message">{errors.value_per_duration.message}</p>}
                                    </div>
                                </div>
                                <div className="modal-footer-add">
                                    <button type="button" className="modal-action-button cancel-button" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="modal-action-button add-button">
                                        Adicionar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySpecialties;