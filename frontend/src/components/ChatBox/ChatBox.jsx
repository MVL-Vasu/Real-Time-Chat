import React, { useContext, useEffect } from 'react';
import "./ChatBox.css"
import { useRef } from 'react';
import { useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import uploadMedia from "../../config/upload";
import moment from "moment";
import axios from "axios";

const ChatBox = () => {


     const { socketconnection, userData, setLoading, selectedUser } = useContext(AppContext);

     const [UserData, setUserData] = useState(null);
     const [ImagePreview, setImagePreview] = useState(false);
     const [Allmessage, setAllmessage] = useState([]);
     const [sendFile, setsendFile] = useState(null);

     const [ProgressBar, setProgressBar] = useState(0);


     const chatBoxRef = useRef(null);

     useEffect(() => {
          handleScrollBottom();
     }, [Allmessage]);


     const [IsScrollBottomVisible, setIsScrollBottomVisible] = useState(true);
     const [message, setmessage] = useState({
          text: "",
          imageUrl: "",
          videoUrl: ""
     });


     const handlebtnclick = (e) => {
          console.log(e);
     }


     const handleUploadImage = async (e) => {

          const file = e.target.files[0];
          if (file) {

               try {

                    const uploadPhoto = await uploadMedia(file);

                    setmessage({ ...message, imageUrl: uploadPhoto?.secure_url });

                    toast.success("Image Updated Successfully");
                    setImagePreview(true);

               } catch (error) {

                    toast.error("error" + error);
                    console.log(error);

               }
          }
     }

     const handleUploadVideo = async (e) => {
          const file = e.target.files[0];
          if (file) {
               try {

                    const videourl = URL.createObjectURL(file);
                    setsendFile(file);
                    setmessage({ ...message, videoUrl: videourl });

                    setImagePreview(true);

               } catch (error) {

                    toast.error("error" + error);
                    console.log(error);

               }
          }
     }

     useEffect(() => {
          console.log("Selected User Changed", selectedUser?._id);
     }, [selectedUser?._id])

     useEffect(() => {
          if (socketconnection) {
               console.log("Selected User : ", selectedUser?._id);
               socketconnection.emit("message-page", selectedUser?._id);

               socketconnection.emit("seen", selectedUser?._id)

               socketconnection.on("message-user", (data) => {
                    setUserData(data)
               })

               socketconnection.on("LoadConversation", (data) => {
                    if (data) {
                         setAllmessage(data);
                    } else {
                         setAllmessage([]);
                    }
               });

               socketconnection.on("message", (data, sender) => {

                    if (sender === selectedUser?._id) {
                         console.log("Selected User : ", selectedUser?._id);
                         console.log("Sender : ", sender);
                         socketconnection.emit("seen", selectedUser?._id)
                         if (data) {
                              setAllmessage(data);
                         }
                         else {
                              setAllmessage([]);
                         }
                    }

                    // if(data)

                    // if (data.find(item => item?.msgByUserId === selectedUser?._id)) {
                    //      console.log("SenderId : " , sender)
                    //      console.log("ReceiverId : " , selectedUser?._id)
                    //      if (data) {
                    //           setAllmessage(data);
                    //      }
                    //      else {
                    //           setAllmessage([]);
                    //      }
                    // }
               })

          }
          return () => {
               socketconnection.off("LoadConversation");
               socketconnection.off("message");
          };
     }, [socketconnection, selectedUser?._id]);

     const handleScrollBottom = () => {
          chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight });
     }


     const sendmessage = async () => {

          if (message.text || message.imageUrl || message.videoUrl) {

               setImagePreview(false);

               if (socketconnection) {

                    let tempMsg = {
                         sender: userData?._id,
                         receiver: selectedUser?._id,
                         text: message?.text,
                         imageUrl: message?.imageUrl,
                         videoUrl: message?.videoUrl,
                         msgByUserId: userData?._id
                    }


                    setAllmessage((prev) => [...prev, tempMsg]);

                    if (sendFile) {

                         const CloudinaryURL = `https://api.cloudinary.com/v1_1/dhdzriwzq/auto/upload`

                         const formData = new FormData();
                         formData.append("file", sendFile);
                         formData.append("upload_preset", "chat-app-file");

                         axios.post(CloudinaryURL, formData, {

                              headers: {
                                   "Content-Type": "multipart/form-data",
                              },
                              onUploadProgress: (event) => {
                                   setProgressBar(Math.round((event.loaded * 100) / event.total));
                              }
                         })
                              .then((res) => {
                                   // setsendFile(res?.data?.secure_url),
                                   // setmessage({ ...message, videoUrl: res?.data?.secure_url }),
                                   tempMsg.videoUrl = res?.data?.secure_url
                              })
                              .then(() => { socketconnection.emit("new message", tempMsg), console.log("Message Send") });

                    } else {

                         socketconnection.emit("new message", tempMsg);

                    }
               }

          }

          setmessage({
               text: "",
               imageUrl: "",
               videoUrl: ""
          })

          setsendFile(null);
     }


     return (



          <div className='chat-box'>

               <div className="chat-background"></div>

               <div className={`image-preview ${ImagePreview ? "visible" : "hidden"}`}>

                    <button
                         onClick={() => {
                              setImagePreview(false), setmessage({
                                   text: "",
                                   imageUrl: "",
                                   videoUrl: ""
                              })
                              setsendFile(null);
                         }}
                         className="close-img-preview fa-solid fa-close"
                    ></button>

                    {
                         message.imageUrl
                              ? <img src={message.imageUrl || "default-avatar.png"} alt="" />
                              : <video src={message?.videoUrl ? message?.videoUrl : ""} controls autoPlay muted ></video>
                    }


                    <div className="message-box">

                         <input type="text" value={message.text} onChange={(e) => setmessage({ ...message, text: e.target.value })} placeholder='Add a Caption' />

                    </div>

                    <div className="send-box">

                         <div className="image-list" onClick={handlebtnclick} >

                              <button className="image"></button>
                              <button className="image"></button>

                         </div>

                         <button id='send-button' onClick={sendmessage} className="material-icons">send</button>

                    </div>

               </div>

               <div className="chat-box-header">

                    <div className="header-content">

                         <img src={UserData?.avatar || "/default-avatar.png"} alt="" />
                         {
                              UserData?.online &&
                              <div className="isonline"></div>
                         }

                         <div>

                              <p>{UserData?.name}  </p>
                              {
                                   UserData?._id === userData?._id
                                        ? <span>Message Yourself</span>
                                        : UserData?.online
                                             ? <span style={{ color: "green", fontWeight: "500" }}>online</span>
                                             : <span>ofline</span>

                              }

                         </div>

                    </div>

                    <div className="header-icon-bar">

                         <div className="video-call-icons">
                              <i className="fa-solid fa-video"></i>
                              <i className="fa-solid fa-angle-down"></i>
                         </div>

                         <i className="fa-solid fa-magnifying-glass"></i>

                         <div className="menu">

                              <button className="menu-button" onClick={(e) => { e.target.parentElement.classList.toggle("active") }} onBlur={(e) => { e.target.parentElement.classList.remove("active") }} >

                                   <i className="fa-solid fa-ellipsis-vertical"></i>

                              </button>

                              <ul className="sub-menu">
                                   <li>Contact info</li>
                                   <li>Select messages</li>
                                   <li>Mute notification</li>
                                   <li>Disppearing messages</li>
                                   <li>Add to favourites</li>
                                   <li>Close chat</li>
                                   <li>Report</li>
                                   <li>Block</li>
                                   <li>Clear chat</li>
                                   <li>Delete chat</li>
                              </ul>

                         </div>

                    </div>

               </div>

               <div className="chat-box-body" ref={chatBoxRef}>

                    {
                         IsScrollBottomVisible
                              ? (
                                   <div className="scroll-to-bottom-btn" onClick={handleScrollBottom}>
                                        <i className="fa-solid fa-angle-down"></i>
                                   </div>
                              )
                              :
                              (<></>)
                    }


                    {Allmessage.map((message, i) => {

                         return (

                              <div key={i} className={`${userData._id === message?.msgByUserId ? "s-msg" : "r-msg"} `}>

                                   <div className="msg">
                                        {
                                             // userData._id === message?.msgByUserId &&

                                             <div className="menu">

                                                  <button style={{ background: `${message?.videoUrl ? "transparent" : ""}`, right: `${message?.imageUrl || message?.videoUrl ? "10px" : ""}` }} className="select-msg" onClick={(e) => { e.target.parentElement.classList.toggle("active") }} onBlur={(e) => { e.target.parentElement.classList.remove("active") }} >

                                                       <i className="fa-solid fa-angle-down"></i>

                                                  </button>

                                                  <ul className="sub-menu">
                                                       <li>Message info</li>
                                                       <li>Reply</li>
                                                       <li>React</li>
                                                       <li>Forward</li>
                                                       <li>Pin</li>
                                                       <li>Star</li>
                                                       <li>Delate</li>
                                                  </ul>

                                             </div>
                                        }
                                        {
                                             userData._id === message?.msgByUserId &&
                                             <svg style={{ right: `${message?.imageUrl || message?.videoUrl ? "10px" : "5px"}`, bottom: `${message?.imageUrl || message?.videoUrl ? "10px" : "5px"}` }} viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" className="double-tik-icon" fill="none">
                                                  <title>msg-dblcheck</title>
                                                  <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path>
                                             </svg>
                                        }
                                        {
                                             message?.imageUrl && (
                                                  <img className='msg-image' src={message?.imageUrl || "/techno.jpg"} alt="" />
                                             )
                                        }
                                        {
                                             message?.videoUrl && (
                                                  <video src={message?.videoUrl ? message?.videoUrl : ""} controls muted ></video>
                                             )
                                        }
                                        {
                                             message?.text && (
                                                  <p>{message?.text}</p>
                                             )
                                        }

                                        {i === Allmessage.length - 1 && ProgressBar !== 0 && ProgressBar !== 100 &&
                                             <div className="progress-bar-container">
                                                  <div className="progress-circle" style={{ '--progress': `${ProgressBar ? ProgressBar * 3.6 : ""}deg` }}>

                                                  </div>
                                             </div>
                                        }

                                   </div>

                                   <div className='user-info'>

                                        <img src={message.msgByUserId === userData?._id ? userData?.avatar : selectedUser?.avatar || "default-avatar.png"} alt="" />
                                        <p>{moment(message.createdAt).format("hh:mm")}</p>

                                   </div>

                              </div>
                         )

                    })}



               </div>

               <div className="chat-box-bottom">

                    <div className="upload-box">

                         <button className="plus-button" onClick={(e) => { e.target.parentElement.classList.toggle("active") }} >

                              <i className="fa-solid fa-plus" style={{ pointerEvents: "none" }}></i>

                         </button>

                         <ul className="upload-menu">

                              <label htmlFor="document-upload">
                                   <li>
                                        <svg height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path fillRule="evenodd" clipRule="evenodd" d="M2 0C0.9 0 0.01 0.9 0.01 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6.83C16 6.3 15.79 5.79 15.41 5.42L10.58 0.59C10.21 0.21 9.7 0 9.17 0H2ZM9 6V1.5L14.5 7H10C9.45 7 9 6.55 9 6ZM4 10C3.44772 10 3 10.4477 3 11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10H4ZM10 15C10 14.4477 9.55228 14 9 14H4C3.44772 14 3 14.4477 3 15C3 15.5523 3.44772 16 4 16H9C9.55228 16 10 15.5523 10 15Z" fill="#7f66ff"></path>
                                        </svg>
                                        <span>Document</span>
                                        <input type="file" id='document-upload' accept=".doc,.docx,.pdf,.txt" hidden />
                                   </li>
                              </label>

                              <label htmlFor="photo-upload">
                                   <li>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20 14V2C20 0.9 19.1 0 18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14ZM9.4 10.53L11.03 12.71L13.61 9.49C13.81 9.24 14.19 9.24 14.39 9.49L17.35 13.19C17.61 13.52 17.38 14 16.96 14H7C6.59 14 6.35 13.53 6.6 13.2L8.6 10.53C8.8 10.27 9.2 10.27 9.4 10.53ZM0 18V5C0 4.45 0.45 4 1 4C1.55 4 2 4.45 2 5V17C2 17.55 2.45 18 3 18H15C15.55 18 16 18.45 16 19C16 19.55 15.55 20 15 20H2C0.9 20 0 19.1 0 18Z" fill="#007bfc"></path></svg>
                                        <span>Photos</span>
                                        <input type="file" accept="image/*" onChange={handleUploadImage} id='photo-upload' hidden />
                                   </li>
                              </label>

                              <label htmlFor="video-upload">
                                   <li>
                                        <svg width="20" height="19" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" fill='#ff2e74'></path>
                                        </svg>
                                        <span>Video</span>
                                        <input type="file" accept="video/*" onChange={handleUploadVideo} id='video-upload' hidden />
                                   </li>
                              </label>

                              <li>
                                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 4C12 6.21 10.21 8 8 8C5.79 8 4 6.21 4 4C4 1.79 5.79 0 8 0C10.21 0 12 1.79 12 4ZM0 14C0 11.34 5.33 10 8 10C10.67 10 16 11.34 16 14V15C16 15.55 15.55 16 15 16H1C0.45 16 0 15.55 0 15V14Z" fill="#009de2"></path>
                                   </svg>
                                   <span>Contact</span>
                              </li>

                              <li>
                                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 2C0 0.895431 0.895431 0 2 0H11C12.1046 0 13 0.895431 13 2C13 3.10457 12.1046 4 11 4H2C0.89543 4 0 3.10457 0 2ZM0 8C0 6.89543 0.895431 6 2 6H14C15.1046 6 16 6.89543 16 8C16 9.10457 15.1046 10 14 10H2C0.895431 10 0 9.10457 0 8ZM2 12C0.895431 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16H8C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12H2Z" fill="#ffbc38"></path>
                                   </svg>
                                   <span>Poll</span>
                              </li>
                              <li>
                                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18 23C20.7614 23 23 20.7614 23 18C23 15.2386 20.7614 13 18 13C15.2386 13 13 15.2386 13 18C13 20.7614 15.2386 23 18 23ZM17.25 15.75C17.25 15.3358 17.5858 15 18 15C18.4142 15 18.75 15.3358 18.75 15.75V17.25H20.25C20.6642 17.25 21 17.5858 21 18C21 18.4142 20.6642 18.75 20.25 18.75H18.75V20.25C18.75 20.6642 18.4142 21 18 21C17.5858 21 17.25 20.6642 17.25 20.25V18.75H15.75C15.3358 18.75 15 18.4142 15 18C15 17.5858 15.3358 17.25 15.75 17.25H17.25V15.75Z" fill="#02a698"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M2 7C2 4.23858 4.23858 2 7 2H17C19.7614 2 22 4.23858 22 7V12.2547C20.8662 11.4638 19.4872 11 18 11C14.134 11 11 14.134 11 18C11 19.4872 11.4638 20.8662 12.2547 22H7C4.23858 22 2 19.7614 2 17V7ZM14 9.5L14.7812 7.78125L16.5 7L14.7812 6.21875L14 4.5L13.2188 6.21875L11.5 7L13.2188 7.78125L14 9.5ZM8 8.5L9.25 11.25L12 12.5L9.25 13.75L8 16.5L6.75 13.75L4 12.5L6.75 11.25L8 8.5Z" fill="#02a698"></path>
                                   </svg>
                                   <span>New Sticker</span>
                              </li>
                         </ul>

                    </div>

                    <div className="message-input-bar">

                         <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none">
                              <title>expressions</title>
                              <path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z" fill="currentColor"></path>
                              <path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z" fill="currentColor"></path>
                              <path fillRule="evenodd" clipRule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z" fill="currentColor"></path>
                         </svg>

                         <input
                              type="text"
                              value={message.text}
                              onKeyUp={(e) => { e.key === "Enter" ? sendmessage() : '' }}
                              onChange={(e) => setmessage({ ...message, text: e.target.value })}
                              className="message-input"
                              placeholder=' Type a message'
                         />

                         {/* <button onClick={() => console.log(message)}>message</button> */}

                         <i className="mic-icon fa-solid fa-microphone"></i>

                         <i className="send-icon material-icons" onClick={sendmessage}>send</i>

                    </div>

               </div>

          </div >
     );
}

export default ChatBox;
