import React, { useContext, useEffect, useState } from 'react';
import "./Chat.css";
import SideMenu from '../../components/SideMenu/SideMenu';
import SideBar from '../../components/SideBar/SideBar';
import ChatBox from '../../components/ChatBox/ChatBox';
import { AppContext } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';
import {io} from "socket.io-client"; 
import api_paths from '../../config/apis';

const Chat = () => {

     const { activelink, setactivelink,onlineUser, selectedUser,setOnlineUser, setsocketconnection } = useContext(AppContext);


     const location = useLocation();
     const basepath = location.pathname === "/chat"

     // if(!localStorage.getItem("secret_chat")){
     //      window.location.replace("/");
     // }

     useEffect(() => {

          const socketconnection = io( api_paths.backendPath , {
               auth: {
                    token: localStorage.getItem("secret_chat")
               }
          })

          socketconnection.on("onlineUser", (data) => {
               setOnlineUser(data || []);
          })

          setsocketconnection(socketconnection);

          return () => {
               socketconnection.disconnect();
          }

     }, [])

     return (
          <div className='chat'>
               <SideMenu activelink={activelink} setactivelink={setactivelink} />
               <SideBar activelink={activelink} />
               {
                    selectedUser
                         ? <ChatBox />
                         : <div className='default-chat-page'><img src="/vite.svg" alt="" /></div>
               }
          </div>
     );
}

export default Chat;
