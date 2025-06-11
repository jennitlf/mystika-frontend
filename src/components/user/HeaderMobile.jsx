import React, { useState, useContext } from "react";
import "../../css/user/HeaderMobile.css";
import file from "../../image/file.png";
import MenuOptions from "./MenuOptions";
import MenuOptionsConsultant from "../consultant/MenuOptionsConsultant.jsx";
import { AuthContext } from '../../context/AuthContext.js';

const HeaderMobile = () => {
    const [menuOptions, setMenuOptions] = useState(false);
    const { user } = useContext(AuthContext);
    const onClick = (e) => {
        e.preventDefault();
        setMenuOptions(!menuOptions);
    };
    const renderMenu = () => {
        if (!user) {
            return <MenuOptions menuActive={menuOptions} setMenuActive={setMenuOptions} />;
        }
        switch (user.role) {
            case 'user':
                return <MenuOptions menuActive={menuOptions} setMenuActive={setMenuOptions} />;
            case 'consultant':
                return <MenuOptionsConsultant menuActive={menuOptions} setMenuActive={setMenuOptions} />;
            case 'adm':
                return <></>;
            default:
                return null;
        }
    };
    return (
        <>
            {menuOptions && (
                <div 
                    className="overlay" 
                    onClick={() => setMenuOptions(false)}
                />
            )}
            {renderMenu()}
            <div className="header-m">
                <button className="menu-user-m" type="button" onClick={onClick}>
                    {!menuOptions && (
                        <div className="container-button-menu">
                            <span className="material-symbols-outlined" translate="no">apps</span>
                            <p>Menu</p>
                        </div>
                    )}
                </button>
                <div className="container-logo-m">
                    <img src={file} alt="logo do site" />
                </div>
            </div>
        </>
    );
};

export default HeaderMobile;
