import axios from "axios"
import CookiesService from "./CookiesService"
const cookiesService = CookiesService.getService()

axios.interceptors.request.use(
    config => {
      const accessToken = cookiesService.getToken()
      if (accessToken) {
        config.headers['Authorization'] = accessToken
      }
      return config
    },
    error => {
      Promise.reject(error)
    }
)