import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './Profile.css'
import Input from '../UI/Input';
import { toast, Flip } from 'react-toastify';

import Cropper from 'react-easy-crop';
import { Modal } from 'antd'; // For modal (you can use any library or custom modal)
import getCroppedImg from './cropImage'; // Utility function to crop image
import { AppContext } from '../../context/AppContext';
import api_paths from '../../config/apis';

const Profile = ({ activelink }) => {

     const menuRef = useRef(null);

     const { userData, fetchuserdata } = useContext(AppContext);

     const [inputField, setinputField] = useState({
          name: "",
          about: ""
     });

     const [isInputEdit, setisInputEdit] = useState({
          name: false,
          about: false
     });

     const [image, setimage] = useState(null);
     const [visibleoverlay, setvisibleoverlay] = useState(false);
     const [imageview, setimageview] = useState(false);
     const [menuVisible, setMenuVisible] = useState(false);
     const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

     const [crop, setCrop] = useState({ x: 0, y: 0 });
     const [zoom, setZoom] = useState(1);
     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
     const [modalOpen, setModalOpen] = useState(false);
     const [croppedImage, setCroppedImage] = useState(null);

     const OpenMenu = (event) => {
          const { clientX, clientY } = event;
          setMenuPosition({ top: clientY - 60, left: clientX - 60 });
          setvisibleoverlay(true);
          setMenuVisible(true);
     };

     const closeMenu = (e) => {
          if (menuRef.current && !menuRef.current.contains(e.target)) {
               setMenuVisible(false);
               setvisibleoverlay(false);
          }
     };

     useEffect(() => {

          setCroppedImage(userData?.avatar);
          setimage(userData?.avatar);
          setinputField({ name: userData?.name, about: userData?.bio });

          document.addEventListener("click", closeMenu);
          return () => {
               document.addEventListener("click", closeMenu);
          };
     }, []);

     const handleImageChange = async (event) => {

          try {

               const file = event.target.files[0];

               if (file) {

                    console.log(file);
                    setimage(URL.createObjectURL(file));
                    setModalOpen(true);

               }

          } catch (error) {

               toast.error("image upload failed", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Flip,
               });

          }

     };

     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
          setCroppedAreaPixels(croppedAreaPixels);
     }, []);

     const handleCrop = async () => {
          try {
               const croppedImg = await getCroppedImg(image, croppedAreaPixels);
               setModalOpen(false);

               const blob = await fetch(croppedImg).then((res) => res.blob());
               const reader = new FileReader();

               reader.onloadend = async () => {

                    const formData = new FormData();
                    formData.append('image', blob);
                    console.log(blob.text());
                    console.log(blob.stream());
                    console.log(blob.arrayBuffer());
                    formData.append('token', window.localStorage.getItem('secret_chat'));

                    let response = await fetch( api_paths.ImageUpload , {
                         method: "POST",
                         body: formData
                    })

                    const result = await response.json();

                    if (result.success) {
                         toast.success("Image Updated Successfully");
                         setCroppedImage(result.image);
                         fetchuserdata();
                    }
                    else {
                         toast.error("error" + result.message);
                         console.log(result.error);
                    }

               };


               reader.readAsDataURL(blob);

          } catch (e) {
               console.error(e);
          }
     };

     const closeImageView = () => {
          setimageview(false);
     }

     const handleChange = (e) => {
          setinputField({ ...inputField, [e.target.name]: e.target.value })
     }

     const UpdateName = () => {
          
          setisInputEdit({ name: false })
     }

     const UpdateBio = () => {

          setisInputEdit({ about: false })

     }


     return (

          <div className='profile'>

               <div className={`image-view ${imageview ? "visible" : "hidden"} `} onClick={closeImageView} >

                    <div className="header-content">

                         <img src="/techno.jpg" alt="" />
                         <p>Dhrumeel</p>

                    </div>

                    <img src={croppedImage || "/default-avatar.png"} alt="" onClick={closeImageView} />

                    <i className="close-img-view-btn fa-solid fa-xmark" ></i>

               </div>

               <div className="header">

                    <h1>{activelink}</h1>

               </div>

               <div className="profile-image-container">

                    <label ref={menuRef} htmlFor="" className='profile-img-label' onClick={OpenMenu} >

                         {<img src={croppedImage || "/default-avatar.png"} alt="Cropped" style={{ width: '200px', height: '200px' }} />}
                         <Modal
                              title="Crop Image"
                              open={modalOpen}
                              onOk={handleCrop}
                              onCancel={() => setModalOpen(false)}
                              okText="Crop"
                         >
                              <div style={{ position: 'relative', width: '100%', height: 400 }}>
                                   <Cropper
                                        image={image}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                   />
                              </div>

                         </Modal>

                         <input
                              type="file"
                              onChange={handleImageChange}
                              id="profile-image"
                              accept="image/*"
                              style={{ display: "none" }}
                         />

                         <div className={`image-overlay ${visibleoverlay ? "visible" : "hidden"} `}>

                              <i className="material-icons">photo_camera</i>
                              <p>CHANGE <span>PROFILE PHOTO</span></p>

                         </div>

                    </label>

                    {
                         menuVisible && (

                              <ul className="menu" style={{ top: menuPosition.top, left: menuPosition.left, }}>

                                   <li onClick={() => setimageview(true)} ><i className="fa-solid fa-eye"></i> View photo</li>

                                   <li><i className='fas fa-camera-retro'></i> Take photo</li>

                                   <li onClick={() => document.getElementById('profile-image').click()}>
                                        <i className="fa-regular fa-folder-open"></i> Upload photo
                                   </li>

                                   <hr />

                                   <li onClick={() => setimage(null)} ><i className='far fa-trash-alt'></i> Remove photo</li>

                              </ul>

                         )
                    }

               </div>

               <button onClick={() => console.log(inputField)} >Get UserData</button>

               <div className={`edit-name-box ${isInputEdit.name ? "edit" : "normal"}`}>

                    <span>Your name</span>

                    <div className="input-box">

                         <Input
                              type={"text"}
                              // value={inputField.name}
                              value={inputField.name}
                              onChange={handleChange}
                              name="name"
                              placeholder={"Enter your Name"}
                              readOnly={!isInputEdit.name}
                              maxLength={25}
                         />

                         <div className={`edit-mode`}>

                              <div className="word-count">{25 - (inputField?.name?.length)}</div>

                              <button className='emoji-btn' >

                                   <svg viewBox="0 0 20 20" height="20" width="20" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 20 20">
                                        <title>emoji-input</title>
                                        <path fill="currentColor" d="M9.5,1.7C4.8,1.7,1,5.5,1,10.2s3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5S14.2,1.7,9.5,1.7z  M9.5,17.6c-4.1,0-7.4-3.3-7.4-7.4s3.3-7.4,7.4-7.4s7.4,3.3,7.4,7.4S13.6,17.6,9.5,17.6z"></path>
                                        <path fill="currentColor" d="M6.8,9.8C7.5,9.7,8,9.1,7.9,8.4C7.8,7.8,7.4,7.3,6.8,7.3C6.1,7.3,5.6,8,5.7,8.7 C5.7,9.3,6.2,9.7,6.8,9.8z"></path>
                                        <path fill="currentColor" d="M13.9,11.6c-1.4,0.2-2.9,0.3-4.4,0.4c-1.5,0-2.9-0.1-4.4-0.4c-0.2,0-0.4,0.1-0.4,0.3 c0,0.1,0,0.2,0,0.2c0.9,1.8,2.7,2.9,4.7,3c2-0.1,3.8-1.2,4.8-3c0.1-0.2,0-0.4-0.1-0.5C14.1,11.6,14,11.6,13.9,11.6z M9.8,13.6 c-2.3,0-3.5-0.8-3.7-1.4c2.3,0.4,4.6,0.4,6.9,0C13,12.3,12.6,13.6,9.8,13.6L9.8,13.6z"></path>
                                        <path fill="currentColor" d="M12.2,9.8c0.7-0.1,1.2-0.7,1.1-1.4c-0.1-0.6-0.5-1.1-1.1-1.1c-0.7,0-1.2,0.7-1.1,1.4 C11.2,9.3,11.6,9.7,12.2,9.8z"></path>
                                   </svg>

                              </button>

                              <button className='toggle-edit-btn' onClick={UpdateName} >
                                   <i className="material-icons">check</i>
                              </button>

                         </div>

                         <div className={`normal-mode `}>
                              <button className='toggle-edit-btn' onClick={(e) => setisInputEdit({ name: true })}>
                                   <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24">
                                        <title>pencil</title>
                                        <path fill="currentColor" d="M3.95,16.7v3.4h3.4l9.8-9.9l-3.4-3.4L3.95,16.7z M19.75,7.6c0.4-0.4,0.4-0.9,0-1.3 l-2.1-2.1c-0.4-0.4-0.9-0.4-1.3,0l-1.6,1.6l3.4,3.4L19.75,7.6z"></path>
                                   </svg>
                              </button>
                         </div>

                         <hr />

                         <p></p>

                    </div>

               </div>

               <hr style={{ margin: '10px 8px', color: '#667781' }} />

               <div className={`edit-name-box ${isInputEdit.about ? "edit" : "normal"}`}>

                    <span>About</span>

                    <div className="input-box">

                         <Input
                              type={"text"}
                              onChange={handleChange}
                              value={inputField.about}
                              name="about"
                              placeholder={"About you"}
                              readOnly={!isInputEdit.about}
                              maxLength={25}
                         />

                         <div className={`edit-mode`}>

                              <button className='emoji-btn' >

                                   <svg viewBox="0 0 20 20" height="20" width="20" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 20 20">
                                        <title>emoji-input</title>
                                        <path fill="currentColor" d="M9.5,1.7C4.8,1.7,1,5.5,1,10.2s3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5S14.2,1.7,9.5,1.7z  M9.5,17.6c-4.1,0-7.4-3.3-7.4-7.4s3.3-7.4,7.4-7.4s7.4,3.3,7.4,7.4S13.6,17.6,9.5,17.6z"></path>
                                        <path fill="currentColor" d="M6.8,9.8C7.5,9.7,8,9.1,7.9,8.4C7.8,7.8,7.4,7.3,6.8,7.3C6.1,7.3,5.6,8,5.7,8.7 C5.7,9.3,6.2,9.7,6.8,9.8z"></path>
                                        <path fill="currentColor" d="M13.9,11.6c-1.4,0.2-2.9,0.3-4.4,0.4c-1.5,0-2.9-0.1-4.4-0.4c-0.2,0-0.4,0.1-0.4,0.3 c0,0.1,0,0.2,0,0.2c0.9,1.8,2.7,2.9,4.7,3c2-0.1,3.8-1.2,4.8-3c0.1-0.2,0-0.4-0.1-0.5C14.1,11.6,14,11.6,13.9,11.6z M9.8,13.6 c-2.3,0-3.5-0.8-3.7-1.4c2.3,0.4,4.6,0.4,6.9,0C13,12.3,12.6,13.6,9.8,13.6L9.8,13.6z"></path>
                                        <path fill="currentColor" d="M12.2,9.8c0.7-0.1,1.2-0.7,1.1-1.4c-0.1-0.6-0.5-1.1-1.1-1.1c-0.7,0-1.2,0.7-1.1,1.4 C11.2,9.3,11.6,9.7,12.2,9.8z"></path>
                                   </svg>

                              </button>

                              <button className='toggle-edit-btn' onClick={UpdateBio}>
                                   <i className="material-icons">check</i>
                              </button>

                         </div>

                         <div className={`normal-mode `}>
                              <button className='toggle-edit-btn' onClick={(e) => setisInputEdit({ about: true })}>
                                   <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24">
                                        <title>pencil</title>
                                        <path fill="currentColor" d="M3.95,16.7v3.4h3.4l9.8-9.9l-3.4-3.4L3.95,16.7z M19.75,7.6c0.4-0.4,0.4-0.9,0-1.3 l-2.1-2.1c-0.4-0.4-0.9-0.4-1.3,0l-1.6,1.6l3.4,3.4L19.75,7.6z"></path>
                                   </svg>
                              </button>
                         </div>

                         <hr />

                         <p></p>

                    </div>

               </div>

          </div>
     );
}

export default Profile;
