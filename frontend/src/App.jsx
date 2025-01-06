// import { HashRouter as Navigate, Route, Router, Routes } from 'react-router-dom'
// import './App.css'
// import Login from './pages/Auth/Login'
// import Chat from './pages/Chat/Chat'
// import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
// import { Flip, ToastContainer } from 'react-toastify';
// import { useContext } from 'react'
// import { AppContext } from './context/AppContext'
// import Loader from './components/Loader/Loader'
// import NotFound from './pages/NotFound'

// function App() {
//      const { Loading, error } = useContext(AppContext);

//      const token = localStorage.getItem("secret_chat");

//      if (error === "404") {
//           return <NotFound />
//      }

//      return (
//           <>
//                <ToastContainer
//                     position="top-center"
//                     autoClose={5000}
//                     hideProgressBar={false}
//                     newestOnTop
//                     closeOnClick={false}
//                     rtl={false}
//                     pauseOnFocusLoss={false}
//                     draggable
//                     pauseOnHover={false}
//                     theme="light"
//                     transition={Flip}
//                />

//                {
//                     Loading
//                          ? <Loader />
//                          : <></>
//                }

//                <Router>

//                     <Routes>

//                          <Route path='/' element={!token ? <Login /> : <Chat />} />

//                          <Route path='/profile' element={<ProfileUpdate />} />

//                          <Route path='/chat' element={!token ? <Login /> : <Chat />} />

//                          <Route path='*' element={<NotFound />} />

//                          {
//                               !token
//                                    ? Navigate("/")
//                                    : Navigate("/chat")
//                          }

//                     </Routes>


//                </Router>
//           </>
//      )
// }

// export default App

import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Auth/Login';
import Chat from './pages/Chat/Chat';
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate';
import { Flip, ToastContainer } from 'react-toastify';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Loader from './components/Loader/Loader';
import NotFound from './pages/NotFound';

function App() {
    const { Loading, error } = useContext(AppContext);

    const token = localStorage.getItem("secret_chat");

    if (error === "404") {
        return <NotFound />;
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Flip}
            />

            {Loading ? <Loader /> : null}

            <Router>
                <Routes>
                    <Route path="/" element={!token ? <Login /> : <Chat />} />
                    <Route path="/profile" element={<ProfileUpdate />} />
                    <Route path="/chat" element={!token ? <Navigate to="/" /> : <Chat />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;

