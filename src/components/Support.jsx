import React, { useState } from "react";
import SupportForm from "./SupportForm";
import SupportList from "./SupportList";
import "../css/Support.css";

const Support = () => {
    const [ element, setElement ] = useState("SupportList");
    const colorSelect = {backgroundColor: 'rgb(208, 225, 233)'}

    const onClick = (e) => {
        setElement(e.target.name)
    }

    const renderContent = () => {
        switch (element) {
            case "SupportList":
                return <SupportList />;
            case "SupportForm":
                return <SupportForm />;
            default:
                return <SupportList />;
        }
    };
    return (
        <div className="container-ajuda">
            <nav className="nav-ajuda">
                <button name="SupportList" onClick={onClick} style={element === "SupportList" ? colorSelect : {backgroundColor: 'inherit'}}>Lista de chamados</button>
                <button name="SupportForm" onClick={onClick} style={element === "SupportForm" ? colorSelect : {backgroundColor: 'inherit'}}>Abra um chamado</button>
            </nav>
            <div className="content-main-support">
                {renderContent()}
            </div>
            
        </div>
    )
}

export default Support;