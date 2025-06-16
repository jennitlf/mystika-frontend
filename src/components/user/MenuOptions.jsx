import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import '../../css/user/menuOptions.css'
import { AuthContext } from '../../context/AuthContext.js';

const MenuOptions = ({ setMenuActive, menuActive }) => {
    const { user, logout } = useContext(AuthContext);
    const [ enabledMydata, setEnabledMyData ] = useState(false);
    const [ enabledHelp, setEnabledHelp ] = useState(false);
    const onClick = () => {
        setMenuActive(false);
    };

    

    return (
        <div className={`menu-options-m ${menuActive ? "active" : ""}`}>
            <div className="menu-options-m-subcontainer">
                {user ? (
                    <div className="menu-user-menuOption">
                        <span className="material-symbols-outlined menu-user-menuOption-icon" translate="no">account_circle</span>
                        <span className="menu-user-menuOption-name" translate="no">{user.name}</span>  
                    </div>
                ) : (
                    <Link className="menu-user-menuOption-button-login" onClick={onClick} to={'usuario/login'}>
                        Acesse sua conta
                        <span className="material-symbols-outlined icon-login-menuOption" translate="no">login</span>
                    </Link>
                )}
            <ul className="ul-options">
                <Link to={`/consultores`} className="options-m options-m-consultants" onClick={onClick}>
                    Consultores
                </Link>
                <div className="options-m options-m-dataUser" onClick={() => setEnabledMyData(!enabledMydata)}>
                    Meus dados
                    {enabledMydata ? (<span className="material-symbols-outlined" translate="no">keyboard_arrow_up</span>) 
                    : 
                    (<span className="material-symbols-outlined" translate="no">keyboard_arrow_down</span>)}
                </div>
                {enabledMydata && (
                    <ul className="ul-options-myData">
                        <Link to={`/meus-dados`} className="ul-options-myData-li li-mydata" onClick={onClick}>Meus dados</Link>
                        <Link to={`/consultas-agendadas`} className="ul-options-myData-li li-scheduleAppoiment" onClick={onClick}>Consultas agendadas</Link>
                    </ul>
                )}
                <div className="options-m options-m-help" onClick={() => setEnabledHelp(!enabledHelp)}>
                    Ajuda
                    {enabledHelp ? (<span className="material-symbols-outlined" translate="no">keyboard_arrow_up</span>) 
                    : 
                    (<span className="material-symbols-outlined" translate="no">keyboard_arrow_down</span>)}
                </div>
                {enabledHelp && (
                    <ul className="ul-options-help">
                        <Link to={`/solicitacoes-de-supote`} className="ul-options-help-li li-help-list" onClick={onClick}>Lista de pedidos</Link>
                        <Link to={`/formulario-de-ajuda`} className="ul-options-help-li li-help" onClick={onClick}>Solicite ajuda</Link>
                    </ul>
                )}
            </ul>
        </div>
            {user ? (
                    <div className="container-logout-user">Sair<span className="material-symbols-outlined logout" onClick={() => logout()} translate="no">logout</span></div>
                ) : (
                    <div className="container-logout-off-user"></div>
                )}
            
    </div>
    );
};

export default MenuOptions;