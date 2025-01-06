import React, { useContext, useEffect, useState } from 'react';
import './ChatBar.css'
import { AppContext } from '../../context/AppContext';
import api_paths from '../../config/apis';

const ChatBar = ({ activelink }) => {

     const [activefilter, setactivefilter] = useState("All");
     const [showSearchBar, setshowSearchBar] = useState(false);
     const { socketconnection, userData, onlineUser, setSelectedUser } = useContext(AppContext);
     const [AllUser, setAllUser] = useState([]);

     const [query, setQuery] = useState('');
     const [users, setUsers] = useState([]);
     const [DefaultUser, setDefaultUser] = useState([]);

     const fetchUsers = async (searchQuery) => {

          if (searchQuery.trim() === '') {
               setUsers([]); // Clear results for empty input
               return;
          }

          try {
               const response = await fetch(`${api_paths.SearchUser}/?q=${searchQuery}`, {
                    method: "POST"
               });
               const data = await response.json();
               setUsers(data);
          } catch (error) {
               console.error('Error fetching users:', error);
          }
     };

     const fetchAllusers = () => {

          fetch(api_paths.GetAllUsers, {
               method: "POST"
          })
               .then((res) => res.json())
               .then((result) => { setDefaultUser(result.users) })

     }

     useEffect(() => {
          if (socketconnection && userData?._id) {
               socketconnection.emit('sidebar', userData?._id);

               socketconnection.on('conversation', (data) => {

                    const conversationUserData = data.map((ConvUser, index) => {

                         if (ConvUser?.sender?._id === ConvUser?.receiver?._id) {
                              return {
                                   ...ConvUser,
                                   userDetails: ConvUser.sender
                              }
                         }
                         else if (ConvUser?.receiver?._id !== userData?._id) {
                              return {
                                   ...ConvUser,
                                   userDetails: ConvUser.receiver
                              }
                         } else {
                              return {
                                   ...ConvUser,
                                   userDetails: ConvUser.sender
                              }
                         }

                    })

                    setAllUser(conversationUserData);
               })

          }

          fetchAllusers();
     }, [socketconnection, userData?._id])

     const handleUserClick = (e) => {
          setshowSearchBar(false)
          setSelectedUser(e);
     }

     const handleInputChange = (e) => {
          const value = e.target.value;
          setQuery(value);
          fetchUsers(value); // Call fetchUsers on each input change
     };

     return (

          // !showSearchBar
          //      ?
          <div className="chat-bar">

               <div className={`chat-bar-container ${!showSearchBar ? "visible" : "hidden"} `}>

                    <div className="header">

                         <h1>{activelink}</h1>

                         <div>

                              <svg onClick={() => setshowSearchBar(true)} viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none">
                                   <title>new-chat-outline</title>
                                   <path d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z" fill="currentColor"></path>
                                   <path fillRule="evenodd" clipRule="evenodd" d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z" fill="currentColor"></path>
                              </svg>

                              <div className="menu">

                                   <button className="menu-button" onClick={(e) => { e.target.parentElement.classList.toggle("active") }} onBlur={(e) => { e.target.parentElement.classList.remove("active") }} >

                                        <i className="fa-solid fa-ellipsis-vertical"></i>

                                   </button>

                                   <ul className="sub-menu">
                                        <li>New group</li>
                                        <li>Starred messages</li>
                                        <li>Select chats</li>
                                        <li>Log out</li>
                                        <hr />
                                        <li>Get WhatsApp for Windows</li>
                                   </ul>

                              </div>

                         </div>

                    </div>

                    <div className="search-bar">

                         <div className="search-box">

                              <input type="search" placeholder='Search' id='search-field' />

                              <i className="fa-solid fa-arrow-left"></i>

                              <i className="fa-solid fa-magnifying-glass"></i>

                         </div>

                    </div>

                    <div className="filter-container" onClick={(e) => setactivefilter(e.target.id)}>

                         <button id='All' className={activefilter === "All" ? 'active' : ' '}>All</button>
                         <button id='Unread' className={activefilter === "Unread" ? 'active' : ' '} >Unread</button>
                         <button id='Favourites' className={activefilter === "Favourites" ? 'active' : ' '} >Favourites</button>
                         <button id='Groups' className={activefilter === "Groups" ? 'active' : ' '} >Groups</button>

                    </div>

                    <div className="friends-list">

                         {AllUser.map((e, i) => {

                              return <div key={i} onClick={() => handleUserClick(e?.userDetails)} className="friend">
                                   <img src={e?.userDetails?.avatar || "/default-avatar.png"} alt="" />
                                   {
                                        onlineUser.map((onUser, i) => {
                                             if (e?.userDetails?._id.toString() === onUser.toString()) {
                                                  return (
                                                       <div key={i} className="isonline"></div>
                                                  )
                                             }
                                        })
                                   }

                                   <div className='friend-info'>
                                        <div className="line1">
                                             <p className='friend-name'>{e?.userDetails?.name} {e?.userDetails?._id === userData?._id ? "(You)" : ""} </p>
                                             <span>9:50 pm</span>
                                        </div>
                                        <div className="line2">
                                             {
                                                  e?.lastMsg?.videoUrl &&
                                                  <p><i className="fa-solid fa-video"></i> {e?.lastMsg?.text ? "" : "Video"}</p>
                                             }

                                             {
                                                  e?.lastMsg?.imageUrl &&
                                                  <p><i className="fa-solid fa-image"></i> {e?.lastMsg?.text ? "" : "Image"} </p>
                                             }
                                             <p>{e?.lastMsg?.text}</p>

                                             <div className="side-arrow">
                                                  {
                                                       e?.unseenMsg !== 0 &&
                                                       <div className="unread-msg">{e?.unseenMsg}</div>
                                                  }
                                                  <i className="fa-solid fa-angle-down"></i>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                         })}


                         <div className="friendlist-footer">
                              <i className="fa-solid fa-lock"></i>
                              <span>
                                   Your personal messages are <a rel="noreferrer noopener" target="_blank">end-to-end encrypted</a>
                              </span>

                         </div>

                    </div>

               </div>



               <div className={`search-user-bar ${showSearchBar ? "visible" : "hidden"} `}>
                    <div className="header">
                         <h1>
                              <button className='fa-solid fa-arrow-left' onClick={() => setshowSearchBar(false)}></button>
                              New chat
                         </h1>
                    </div>

                    <div className="search-bar">

                         <div className="search-box">

                              <input type="search" placeholder='Search' id='search-field' value={query} onChange={handleInputChange} />

                              <i className="fa-solid fa-arrow-left"></i>

                              <i className="fa-solid fa-magnifying-glass"></i>

                         </div>

                    </div>

                    {/* <div className="user-list">
                         <div className="user"></div>
                    </div> */}

                    <div className="friends-list">

                         {
                              users.length == 0 && (
                                   DefaultUser.map((e, i) => {
                                        return (
                                             <div onClick={() => handleUserClick(e)} key={i} className="friend">
                                                  <img src={e?.avatar || "/default-avatar.png"} alt="" />
                                                  {
                                                       onlineUser && onlineUser.map((onUser, i) => {
                                                            if (e?._id.toString() === onUser.toString()) {
                                                                 return (
                                                                      <div key={i} className="isonline"></div>
                                                                 )
                                                            }
                                                       })
                                                  }


                                                  <div className='friend-info'>
                                                       <div className="line1">
                                                            <p className='friend-name'>{e?.name}</p>
                                                       </div>
                                                       <div className="line2">
                                                            {/* <p>{userData?.bio}</p> */}
                                                            <p>{e?.email}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        )
                                   })
                                   // <div>no user</div>
                              )
                         }

                         {users.map((userData, i) => {

                              return (

                                   <div onClick={() => handleUserClick(userData)} key={i} className="friend">
                                        <img src={userData?.avatar || "/default-avatar.png"} alt="" />
                                        {
                                             onlineUser.map((onUser, i) => {
                                                  if (userData?._id.toString() === onUser.toString()) {
                                                       return (
                                                            <div key={i} className="isonline"></div>
                                                       )
                                                  }
                                             })
                                        }


                                        <div className='friend-info'>
                                             <div className="line1">
                                                  <p className='friend-name'>{userData?.name}</p>
                                             </div>
                                             <div className="line2">
                                                  {/* <p>{userData?.bio}</p> */}
                                                  <p>{userData?.email}</p>
                                             </div>
                                        </div>
                                   </div>
                              )

                         })}
                    </div>
               </div>

          </div>

          // :



     );

}

export default ChatBar;
