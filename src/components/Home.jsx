import React, { useState, useEffect} from "react";
import Consultants from "./Consultants"
import "../css/Home.css"
import Filters from "./Filters";
import Page from "./Page";
// import { API } from "../config";


const Home = () => {
  // console.log(API)
  const [consultants, setConsultants] = useState([]);
  const [totalConsultants, setTotalConsultants] = useState("");
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    "name": "",
    "specialties": [],
    "minValue": null,
    "maxValue": null
  });
  const [ queryString, setQueryString ] = useState("limit=9")
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1)

  useEffect(() => {
    
    const fetchConsultants = async () => {
      try {
        const response = await fetch(`http://localhost:3001/general-find?page=${page}&${queryString}`);
        ///                                 
        const data = await response.json();
        setConsultants(data.data);
        setTotalConsultants(data.meta.total)
        setTotalPage(data.meta.lastPage)
        setPage(parseInt(data.meta.page))
      } catch (error) {
        console.error("Erro ao buscar consultores:", error);
      } finally {
        setLoading(false);
      }
    };
   
    fetchConsultants();

  }, [queryString, params, page]);


  useEffect(() => {

    setQueryString(
    Object.entries(params).filter(([key, value]) => {
   
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== "";
    })
    .flatMap(([key, value]) => {
   
    if (Array.isArray(value)) {
      return value.map(item => `${key}=${encodeURIComponent(item)}`);
    }
   
    return `${key}=${encodeURIComponent(value)}`;
    }).join('&'))
  }, [params]);


  if (loading) {
    return <p>Carregando consultores...</p>;
  }
  
 

  return (
    <div className="consultants">
      <h2 id="title-consultant-page">Explore os melhores consultores e encontre o guia ideal para sua jornada!</h2>
      <div className="consultants-e-filtes">
         <Filters setParams={setParams} params={params}></Filters>
        { totalConsultants > 0 ? <Consultants consultants={consultants}></Consultants>
          : <div className="loading" >Não há itens correspondentes à consulta</div>}
      </div>
      <Page totalPage={totalPage} page={page} setPage={setPage}></Page>
    </div>
  );
}

export default Home;