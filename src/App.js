import React, {useEffect, useContext} from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './routes/index'
import { ToastContainer } from 'react-toastify';
import AuthContext from './context/authentication/authContext'
import CookiesService from './services/CookiesService';
 
import "./index.css"
import { axiosInstance } from './services/config';


function App() {
  const authContext = useContext(AuthContext)
  const cookiesService = CookiesService.getService()

  useEffect(() => {
      if(cookiesService.getToken()) {
        const getAccessToken = async () => {
         try {
            const res = await axiosInstance.get("/api/auth/refresh_token")
            if(res) {
              cookiesService.setToken(res.data.accessToken)
              console.log(res.data)
              authContext.login()
            }
         } catch (error) {
            console.log(error.response.data)
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
