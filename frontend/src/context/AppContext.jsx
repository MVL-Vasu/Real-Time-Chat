import { createContext, useEffect, useState } from "react";
import api_paths from "../config/apis";

export const AppContext = createContext();

const AppContextProvider = (props) => {


     const [activelink, setactivelink] = useState("Chats");
     const [Loading, setLoading] = useState(false);
     const [userData, setUserData] = useState(null);
     const [chatData, setChatData] = useState(null);
     const [selectedUser, setSelectedUser] = useState(null);

     const [onlineUser, setOnlineUser] = useState("");
     const [socketconnection, setsocketconnection] = useState(null);

     const [error, seterror] = useState(null);


     const fetchuserdata = () => {
          const token = localStorage.getItem("secret_chat");

          
          try {
               
               if (token) {
                    setLoading(true);
                    

                    fetch(api_paths.UserData, {
                         method: "POST",
                         body: JSON.stringify({ token }),
                    })
                         .then((res) => res.json())
                         .then((result) => { setUserData(result.data) })
                    setLoading(false);
               }

          } catch (error) {

               // setLoading(false);
               seterror("404");

          }
     }

     useEffect(() => {

          fetchuserdata();

     }, []);


     const value = {
          userData, setUserData,
          chatData, setChatData,
          activelink, setactivelink,
          Loading, setLoading,
          onlineUser, setOnlineUser,
          socketconnection, setsocketconnection,
          selectedUser, setSelectedUser,
          error, seterror,
          fetchuserdata
     }

     return (
          <AppContext.Provider value={value} >
               {props.children}
          </AppContext.Provider>
     )

}

export default AppContextProvider;
