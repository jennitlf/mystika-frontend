import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext.js';
import '../../css/consultant/menuOptionsConsultant.css'

const MenuOptionsConsultant = ({ setMenuActive, menuActive }) => {
    const { user, logout } = useContext(AuthContext);
    const [ enabledMydata, setEnabledMyData ] = useState(false);
    const [ enabledHelp, setEnabledHelp ] = useState(false);

    const onClick = () => {
        setMenuActive(false); 
    };

    return(
        <div className={`menu-options-consultant ${menuActive ? "active" : ""}`}>
            <div className="menu-options-consultant-subcontainer">
                {user ? (
                    <div className="menu-user-menuOption-consultant">
                        <span className="material-symbols-outlined menu-user-menuOption-icon-consultant" translate="no">account_circle</span>
                        <span className="menu-consultant-menuOption-name" translate="no">{user.name}</span>
                    </div>
                ) : (
                    <Link className="menu-consultant-menuOption-button-login" onClick={onClick} to={'/consultor/login'}> 
                        Acesse sua conta
                        <span className="material-symbols-outlined icon-login-menuOption-consultant" translate="no">login</span>
                    </Link>
                )}
                <ul className="ul-options-consultant">
                    <Link to={`/consultor/consultas-agendadas`} className="options-m-consultant" onClick={onClick}>
                        Minhas Consultas
                    </Link>
                    <div className="options-m-consultant options-m-dataUser" onClick={() => setEnabledMyData(!enabledMydata)}>
                        Meus dados
                        {enabledMydata ? (
                            <span className="material-symbols-outlined icon-arrow" translate="no">keyboard_arrow_up</span>
                        ) : (
                            <span className="material-symbols-outlined icon-arrow" translate="no">keyboard_arrow_down</span>
                        )}
                    </div>
                    {enabledMydata && (
                        <ul className="ul-options-sub-menu"> 
                            <Link to={`/consultor/dados-do-perfil`} className="ul-options-sub-menu-li" onClick={onClick}>Dados do perfil</Link>
                            <Link to={`/consultor/especialidades`} className="ul-options-sub-menu-li" onClick={onClick}>Minhas especialidades</Link> 
                            <Link to={`/consultor/agenda`} className="ul-options-sub-menu-li" onClick={onClick}>Agenda</Link>
                            <Link to={`/consultor/financeiro`} className="ul-options-sub-menu-li" onClick={onClick}>Financeiro</Link>
                        </ul>
                    )}
                    <div className="options-m-consultant options-m-help" onClick={() => setEnabledHelp(!enabledHelp)}>
                        Ajuda
                        {enabledHelp ? (
                            <span className="material-symbols-outlined icon-arrow" translate="no">keyboard_arrow_up</span>
                        ) : (
                            <span className="material-symbols-outlined icon-arrow" translate="no">keyboard_arrow_down</span>
                        )}
                    </div>
                    {enabledHelp && (
                        <ul className="ul-options-sub-menu"> 
                            <Link to={`/consultor/suportes`} className="ul-options-sub-menu-li" onClick={onClick}>Lista de pedidos</Link> 
                            <Link to={`/consultor/novo-suporte`} className="ul-options-sub-menu-li" onClick={onClick}>Solicite ajuda</Link> 
                        </ul>
                    )}
                </ul>
            </div>
            {user ? (
                <div className="container-logout" onClick={() => logout()}> 
                    Sair<span className="material-symbols-outlined logout-icon" translate="no">logout</span> 
                </div>
            ) : (
                <div className="container-logout-off"></div>
            )}
        </div>
    );
}

export default MenuOptionsConsultant;