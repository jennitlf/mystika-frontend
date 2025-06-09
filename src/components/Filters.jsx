import React, { useEffect, useState } from "react";
import "../css/Filters.css";
import { API } from "../config";

const Filters = ({
  setImmediateParams,
  setDebouncedParams,
  immediateParams,
  debouncedParams,
}) => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(`${API}specialty`);
        const data = await response.json();
        setSpecialties(data);
      } catch (error) {
        console.error("Erro ao buscar especialidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  if (loading) {
    return <p>Carregando especialidades...</p>;
  }

  if (specialties.length === 0) {
    return <p></p>;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "name") {
      setImmediateParams((prevState) => ({
        ...prevState,
        name: value,
      }));
    } else if (name === "min-Value") {
      setDebouncedParams((prevState) => ({
        ...prevState,
        minValue: value,
      }));
    } else if (name === "max-Value") {
      setDebouncedParams((prevState) => ({
        ...prevState,
        maxValue: value,
      }));
    }
  };

  const handleCheckBoxChange = (event) => {
    const { checked, id } = event.target;

    setImmediateParams((prevState) => ({
      ...prevState,
      specialties: checked
        ? [...prevState.specialties, id]
        : prevState.specialties.filter((specialty) => specialty !== id),
    }));
  };

  return (
    <div className="content-filters">
      <div className="name">
        <span className="material-symbols-outlined" translate="no">
          search
        </span>
        <input
          type="text"
          name="name"
          value={immediateParams.name}
          onChange={handleInputChange}
        />
      </div>
      <p>Filtrar por especialidade</p>
      <div className="specialty">
        {specialties.map((specialty) => (
          <div key={specialty.id_specialty}>
            <input
              id={specialty.name_specialty}
              name="specialty"
              type="checkbox"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor={specialty.name_specialty}>
              {specialty.name_specialty}
            </label>
          </div>
        ))}
      </div>
      <p>Filtrar por valor</p>
      <div className="value">
        <div className="min">
          <label htmlFor="min-Value">Valor mínimo</label>
          <input
            type="number"
            name="min-Value"
            value={debouncedParams.minValue || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="max">
          <label htmlFor="max-Value">Valor máximo</label>
          <input
            type="number"
            name="max-Value"
            value={debouncedParams.maxValue || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
