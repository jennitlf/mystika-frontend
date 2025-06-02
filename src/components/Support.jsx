import React, { useState } from "react";
import SupportForm from "./SupportForm";
import SupportList from "./SupportList";
import "../css/Support.css";

const Support = () => {
    const [ element, setElement ] = useState("SupportList");
    const colorSelect = {backgroundColor: 'rgb(208, 225, 233)'}

    const onClick = (e) => {
        console.log("Changing to:", e.target.name);
        setElement(e.target.dataset.name)
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
            <div className="content-main-support">
            <nav className="nav-ajuda">
                <button className="button-support-list" data-name="SupportList" onClick={onClick} style={element === "SupportList" ? colorSelect : {backgroundColor: 'inherit'}}>Lista de suportes</button>
                <button data-name="SupportForm" onClick={onClick} style={element === "SupportForm" ? colorSelect : {backgroundColor: 'inherit'}}>Abra um chamado</button>
            </nav>
                {renderContent()}
            </div>
            
        </div>
    )
}

export default Support;