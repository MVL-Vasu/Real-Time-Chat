import React, { useContext } from 'react';
import './Setting.css'
import { AppContext } from '../../context/AppContext';

const Setting = ({ activelink }) => {

     const { userData, setUserData } = useContext(AppContext);

     const logout = () => {
          localStorage.removeItem("secret_chat");
          window.location.replace("/");
     }

     return (
          <div className='setting'>

               <div className="header">

                    <h1>{activelink}</h1>

               </div>

               <div className="search-bar">

                    <div className="search-box">

                         <input type="search" placeholder='Search Setting' id='search-field' />

                         <i className="fa-solid fa-magnifying-glass"></i>

                    </div>

               </div>

               <ul className="setting-list">
                    <li className='profile-box'>
                         <img src={userData?.avatar || "/techno.jpg"} alt="" />
                         <span>{userData?.name}</span>
                    </li>
                    <li>
                         <i className="fa-solid fa-circle-user"></i><span>Account</span>
                    </li>
                    <li>
                         <i className="fa-solid fa-lock"></i><span>Privacy</span>
                    </li>
                    <li>
                         <i className="material-icons">chat</i><span>Chats</span>
                    </li>
                    <li>
                         <i className="fa-solid fa-bell"></i><span>Notifications</span>
                    </li>
                    <li>
                         <i className="fa-solid fa-keyboard"></i> <span>Keybord Shortcuts</span>
                    </li>
                    <li>
                         <i className="fa-solid fa-circle-question"></i><span>Help</span>
                    </li>
                    <li className='logout-button' onClick={() => logout()}>
                         <i className="fa-solid fa-arrow-right-from-bracket"></i><span>Log out</span>
                    </li>

               </ul>

          </div>
     );
}

export default Setting;
