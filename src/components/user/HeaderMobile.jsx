import React, { useState } from "react";
import "../../css/user/HeaderMobile.css";
import file from "../../image/file.png";
import MenuOptions from "./MenuOptions";

const HeaderMobile = () => {
    const [menuOptions, setMenuOptions] = useState(false);

    const onClick = (e) => {
        e.preventDefault();
        setMenuOptions(!menuOptions);
    };

    return (
        <>
            {menuOptions && (
                <div 
                    className="overlay" 
                    onClick={() => setMenuOptions(false)}
                />
            )}
            <MenuOptions menuActive={menuOptions} setMenuActive={setMenuOptions} />
            <div className="header-m">
                <button className="menu-user-m" type="button" onClick={onClick}>
                    {!menuOptions &&  (
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
