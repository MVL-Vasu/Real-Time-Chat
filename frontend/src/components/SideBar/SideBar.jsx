import React, { act, useContext } from 'react';
import "./SideBar.css"
import ChatBar from '../ChatBar/ChatBar';
import Status from '../Status/Status';
import Channel from '../Channel/Channel';
import Community from '../Community/Community';
import Setting from '../Setting/Setting';
import Profile from '../Profile/Profile'; 
import { AppContext } from '../../context/AppContext'; 

const SideBar = ({ activelink }) => {

     const { userData, setUserData } = useContext(AppContext);

     const GetComponent = () => {

          switch (activelink) {
               case "Chats":
                    return <ChatBar activelink={activelink}/>

               case "Status":
                    return <Status activelink={activelink} />

               case "Channel":
                    return <Channel activelink={activelink} />

               case "Community":
                    return <Community activelink={activelink} />

               case "Setting":
                    return <Setting activelink={activelink} userData={userData} />

               case "Profile":
                    return <Profile activelink={activelink} userData={userData} setUserData={setUserData} />

               default:
                    break;
          }

     }

     return (

          <div className='side-bar'>

               {GetComponent()}

          </div>
     );
}

export default SideBar;
