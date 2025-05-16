import React, {useContext} from "react";
import { Link } from "react-router-dom";
import '../css/menuOptions.css'
import { AuthContext } from '../context/AuthContext.js';

const MenuOptions = ({ setMenuActive}) => {

    const { user, logout } = useContext(AuthContext);

    const onClick = () => {
        setMenuActive(false)
    }

    return(
        <div className="menu-options-m">
            <ul >
                <Link to={`/consultores`} className="options-m" onClick={onClick}>Consultores</Link>
                <Link className="options-m" to={`/meus-dados`} onClick={onClick}>Meus dados</Link>
                <Link className="options-m" onClick={onClick}>ajuda</Link>
            </ul>
            <div className="content-button-enter-mobile">
                {user ? 
                <div className="menu-user-menuOption"> 
                    <button >{user.name}</button> 
                    <div>Sair<span className="material-symbols-outlined logout" onClick={()=> logout()}>logout</span></div>
                </div> : 
                <Link className="menu-user-menuOption" to={'/login'}> 
                    <button>Entrar</button>
                </Link>
                }
            </div>
        </div>
    )
};

export default MenuOptions;