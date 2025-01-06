import React, { useContext, useRef, useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { validate, ValidateEmail, ValidatePass, ValidateUsername } from './ValidateData';

import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Swal from 'sweetalert2';
import api_paths from '../../config/apis';

const Login = () => {


     const { setLoading } = useContext(AppContext);

     const navigator = useNavigate();
     const [currState, setcurrState] = useState("Sign Up");

     const username = useRef(null);
     const email = useRef(null);
     const password = useRef(null);
     const errorbox = useRef([]);
     const labels = useRef([]);

     const [passVisible, setpassVisible] = useState(false);
     const [formData, setformData] = useState({
          username: "",
          email: "",
          password: ""
     });

     const handleChange = (e) => {
          setformData({ ...formData, [e.target.name]: e.target.value });
     }

     const handleSubmit = async () => {

          if (currState === "Sign Up") {

               const Errors = [errorbox.current[0], errorbox.current[1], errorbox.current[2]];
               const Labels = [labels.current[0], labels.current[1], labels.current[2]];

               if (!validate([username.current, email.current, password.current], Errors, Labels)) {

                    setLoading(true);

                    try {

                         let { username, email, password } = formData;

                         let response = await fetch(`${api_paths.backendPath}/signup`, {
                              method: "POST",
                              headers: {
                                   Accept: 'application/json',
                                   'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(formData),
                         })

                         let result = await response.json();

                         setLoading(false);

                         console.log(result);

                         if (result?.success) {
                              navigator("/chat");
                              toast.success(result.message);

                              window.localStorage.setItem("secret_chat", result.token);

                         }
                         else {
                              console.log("Result Error : ", result?.error);
                              toast.error("Result Error : ", result?.error);
                         }

                    } catch (error) {
                         setLoading(false);
                         console.log("Login Page Error : ", error);
                         toast.error("Sign Up Failed");
                    }

                    // signup(username, email, password)
               }

          } else {

               const Errors = [errorbox.current[1], errorbox.current[2]];
               const Labels = [labels.current[1], labels.current[2]];

               if (!validate([email.current, password.current], Errors, Labels)) {

                    setLoading(true);

                    try {

                         let { email, password } = formData;
                         let token = localStorage.getItem("secret_chat");

                         // let response = await fetch(`${api_paths.backendPath}/mydata`, {
                         //      method: "POST",
                         //      headers: {
                         //           "Accept": 'application/json',
                         //           'Content-Type': 'application/json',
                         //      },
                         //      body: JSON.stringify({ email: email, password: password, token }),
                         // })
                         let response = await fetch(`${api_paths.backendPath}/mydata`)

                         let result = await response.json();

                         setLoading(false);

                         await Swal.fire({
                              title: "Login Successful",
                              text: "Redirection to home page...",
                              icon: "success",
                              timer: 3000,
                              limit: 1,
                              timerProgressBar: true,
                         })

                         // if (result.success) {

                         //      window.localStorage.setItem("secret_chat", result.token)

                         //      await Swal.fire({
                         //           title: "Login Successful",
                         //           text: "Redirection to home page...",
                         //           icon: "success",
                         //           timer: 3000,
                         //           limit: 1,
                         //           timerProgressBar: true,
                         //      })

                         //      window.location.replace("/chat");

                         // }
                         // else {

                         //      toast.error(result.error);

                         // }

                    } catch (error) {
                         setLoading(false);
                         toast.error("Sign Up Failed");
                    }

                    setLoading(false);

               }

          }

     }

     return (

          <div className='auth-container'>

               <div className="left-container">

                    <img src="/logo-icon.png" alt="" />
                    <h1> CHAT APP</h1>

               </div>

               <div className="form-container">

                    <h1>{currState}</h1>

                    {
                         currState === "Sign Up"
                              ?
                              <div className="input-box">

                                   <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>
                                   <Input
                                        type="text"
                                        value={formData.username}
                                        name="username"
                                        placeholder={""}
                                        inputRef={username}
                                        onKeyUp={() => ValidateUsername(username.current, errorbox.current[0], labels.current[0])}
                                        onChange={handleChange}
                                        spellCheck={false}
                                   // autoComplete={'off'}
                                   />

                                   <label ref={(e) => (labels.current[0] = e)} htmlFor="username" className='floating-label'>Enter Username</label>

                                   <div ref={(e) => (errorbox.current[0] = e)} className="error username-error"> <i className="material-icons">info_outline</i> invalid username </div>

                              </div>
                              :
                              <></>
                    }

                    <div className="input-box">

                         <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

                         <Input
                              type="email"
                              value={formData.email}
                              name="email"
                              placeholder={""}
                              inputRef={email}
                              onKeyUp={() => ValidateEmail(email.current, errorbox.current[1], labels.current[1])}
                              onChange={handleChange}
                              spellCheck={false}
                         // autoComplete={'off'}
                         />

                         <label ref={(e) => (labels.current[1] = e)} htmlFor="email" className='floating-label'>Enter Email</label>

                         <div ref={(e) => (errorbox.current[1] = e)} className="error email-error"> <i className="material-icons">info_outline</i> </div>

                    </div>

                    <div className="input-box">

                         <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

                         <Input
                              type={passVisible ? "text" : "password"}
                              value={formData.password}
                              name="password"
                              placeholder={""}
                              inputRef={password}
                              onKeyUp={() => ValidatePass(password.current, errorbox.current[2], labels.current[2])}
                              onChange={handleChange}
                         />

                         <label ref={(e) => (labels.current[2] = e)} htmlFor="password" className='floating-label'>Enter password</label>

                         <i className={`fa-regular fa-eye${passVisible ? "" : "-slash"} eye-icon`} onClick={() => setpassVisible(!passVisible)}></i>

                         <div ref={(e) => (errorbox.current[2] = e)} className="error pass-error"><i className="material-icons">info_outline</i> invalid password</div>

                    </div>

                    <Button text={currState} onClick={handleSubmit} />

                    <div className="form-link">

                         {
                              currState === "Sign Up"
                                   ? <p>already have an account ? <span onClick={() => setcurrState("Login")} >Login</span> </p>
                                   : <p>Do not have an account ? <span onClick={() => setcurrState("Sign Up")} >Create Account</span> </p>
                         }

                    </div>

                    <div className="line"></div>

                    {/* <div className="media-options">

                         <a href="/" className="field facebook">
                              <i className='fa-brands fa-facebook facebook-icon'></i>
                              <span>Login with Facebook</span>
                         </a>

                    </div> */}

                    <div className="media-options">

                         <div href="/" className="field google">

                              <img src="/google.png" alt="" className="google-img" />
                              <span>Google</span>

                         </div>

                         <div href="/" className="field facebook">

                              <i className='fa-brands fa-facebook facebook-icon'></i>
                              <span>Facebook</span>

                         </div>

                    </div>

               </div>

          </div>

     );

}

export default Login;
