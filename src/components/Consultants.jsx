import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css"



const Consultant = ({consultants}) => {
  if (!consultants) {
    return <div className="loading-consultant-list-filter">Carregando...</div>; 
  }
    const specialty = ( consultant )=> { 
        if (consultant.specialties.length > 1) {  
          return (
            <p className="specialty-label"> {consultant.specialties[1].name} [...]</p> 
          )
        } else {
          return (
            <p className="specialty-label"> {consultant.specialties[0].name}</p> 
          )
        }
      }

    const lowestValue = (consultants) => {
      const value = consultants.specialties.reduce((menor, especialidade) => {
        return especialidade.value_per_duration < menor 
          ? especialidade.value_per_duration 
          : menor;
      }, Infinity);
      const formattedValue = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });

      return formattedValue
    }  

    return (
      <div className="Content-consultants">
        {consultants
          .filter((consultant) => consultant.status === 'ativo') 
          .map((consultant) => (
            <div key={consultant.consultant_id} className="consultant-card">
              <div className="container-img">
                <img src={consultant.img} alt="profile consultant" />
              </div>
              <h3>{consultant.consultant_name}</h3>
              <div className="box-specialty">
                {specialty(consultant)}
                <p className="value-minimum">
                  A partir de <b>{lowestValue(consultant)}</b>
                </p>
              </div>
              <Link className="div-button" to={`/consultor/${consultant.consultant_id}`}>
                <button>Marcar consulta</button>
              </Link>
            </div>
          ))}
      </div>
    );
    
}

export default Consultant; 