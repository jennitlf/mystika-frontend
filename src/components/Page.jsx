import React, {useState, useEffect} from "react";
import '../css/Page.css'

const Page = ({totalPage, setPage, page}) => {

  
  const [lessDesabled, setLessDesabled] = useState(true)
  const [moreDesabled, setMoreDesabled] = useState(false)
  

  useEffect(()=>{

    if(page <= 1){
      setLessDesabled(true)
    }else{
      setLessDesabled(false)
    }
    if(page >= totalPage){
      setMoreDesabled(true)
    }else{
      setMoreDesabled(false)
    }
  }, [page, totalPage])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (e.target.id === "less"){
      if ( page <= 1) {
        setPage(1);  
      }else {
        setPage(page - 1) 
      }
    }
    if (e.target.id === "more"){
      if ( page >= totalPage){
        setPage(totalPage); 
      }else{
        setPage(page + 1)
      }
    }
  }

  return(
      <div className="container-page">
        <button id="less" disabled={lessDesabled} onClick={handleSubmit}> Anterior</button>
        <p id="page">{page}</p>
        <button id="more" onClick={handleSubmit} disabled={moreDesabled}>Próxima</button>
      </div>
  )
      
};

export default Page;