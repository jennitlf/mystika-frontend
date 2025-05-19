import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import '../css/Header.css';
import file from '../image/file.png';
import { AuthContext } from '../context/AuthContext.js';


const Header = () => {

    const { user, logout } = useContext(AuthContext);
    
    return (
        <div className="header">
            <div className="logo"><img src={file} alt="logo do site" /></div>
            <ul className="div-menu-nav">
                <Link className="menu-nav" to={'/consultores'}>Consultores</Link>
                <Link className="menu-nav" to={'/meus-dados'}>Meus dados</Link>
                <Link className="menu-nav" to={'/ajuda'}>ajuda</Link>
            </ul>
            <div className="content-button-enter">
            {user ? <div className="menu-user"> <button >{user.name}</button> <span className="material-symbols-outlined logout" onClick={()=> logout()}>logout</span></div>: <Link className="menu-user" to={'/login'}> <button>Entrar</button></Link>}
            </div>
        </div>
    ) 
};

export default Header;