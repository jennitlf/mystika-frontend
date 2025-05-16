import React, { useEffect, useState} from "react";
import '../css/Filters.css'

const Filters = ({setParams, params}) => {

  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    
    const fetchSpecialties = async () => {
      try {
        const response = await fetch("http://localhost:3001/specialty");
        const data = await response.json();
        setSpecialties(data); 
      } catch (error) {
        console.error("Erro ao buscar consultores:", error);
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
    return <p>Nenhum especialidade encontrada encontrado.</p>;
  }

  const handleInputChange = (event) => {
   
    if (event.target.name === "name"){
      setParams((prevState)=>({
        ...prevState,
        "name": event.target.value,
      }))
    }else if(event.target.name === "min-Value"){
      setParams((prevState)=>({
        ...prevState,
        "minValue": event.target.value,
      }))
      
    }else if(event.target.name === "max-Value"){
      setParams((prevState)=>({
        ...prevState,
        "maxValue": event.target.value,
      }))
      
    }
  }

  const handleCheckBoxChange = (event) => {

    const { checked, id} = event.target

      setParams((prevState)=>({
        ...prevState,
        "specialties": checked ? [...prevState.specialties, id] : prevState.specialties.filter((specialty) => specialty !== id)
      }));
  }

    return (
        <div className="content-filters">
            <div className="name">
              <span className="material-symbols-outlined" translate="no">search</span>
              <input type="text" name="name" value={params.name} onChange={handleInputChange}></input>
            </div>
            <p>Filtrar por especialidade</p>
            <div className="specialty">
                {specialties.map((specialty)=>(
                    <div key={specialty.id_specialty}>
                        <input id={specialty.name_specialty} name="specialty" type="checkbox" onChange={handleCheckBoxChange}></input>
                        <label htmlFor={specialty.name_specialty}>{specialty.name_specialty}</label>
                    </div>
                ))}
            </div>
            <p>Filtrar por valor</p>
            <div className="value">
                <div className="min">
                    <label htmlFor="min-Value">Valor mínimo</label>
                    <input type="number" name="min-Value"  onChange={handleInputChange}/>
                </div>
                <div className="max">
                    <label htmlFor="max-Value">Valor máximo</label>
                    <input type="number" name="max-Value"onChange={handleInputChange}/>
                </div>
            </div>
        </div>
    ) 
};

export default Filters;