import React, {useEffect, useContext} from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './routes/index'
import { ToastContainer } from 'react-toastify';
import AuthContext from './context/authentication/authContext'
import CookiesService from './services/CookiesService';
 
import "./index.css"
import axios from 'axios';


function App() {
  const authContext = useContext(AuthContext)
  const cookiesService = CookiesService.getService()

  useEffect(() => {
      if(cookiesService.getToken()) {
        const getAccessToken = async () => {
          const res = await axios.get("/api/auth/refresh_token")
          if(res) {
            console.log("login")
            authContext.login()
          }
        }
        getAccessToken()
      }
  }, [])
  
  return (
    <Router>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes />
    </Router>
  );
}

export default App;
