import React, { useState } from "react";
import '../css/HeaderMobile.css'
import file from '../image/file.png';
import MenuOptions from "./MenuOptions";


const HeaderMobile = () => {

    const [menuOptions, setMenuOptions] = useState(false)

    const onClick = (e) => {
        e.preventDefault()
        if (menuOptions){
            setMenuOptions(false)
        }else{
            setMenuOptions(true)
        }
    }

    return(
        <>
            <div className="header-m">
                <div className="container-logo-m">  
                    <img src={file} alt="logo do site" />  
                </div>
                <button className="menu-user-m" type="button" onClick={onClick}>
                {menuOptions ? <span className="material-symbols-outlined">close</span> :  <span className="material-symbols-outlined" translate="no"> menu </span>}
                </button>
            </div>
            {menuOptions && <MenuOptions menuActive={menuOptions} setMenuActive={setMenuOptions}/> }
        </>
    )
};

export default HeaderMobile;