import axios from 'axios'
import CookiesService from "./CookiesService"
const cookiesService = CookiesService.getService()

export const axiosInstance = axios.create({
    // baseURL: 'https://online-judge-vn.herokuapp.com/',
    timeout: 10000,
    withCredentials: true
})

const interceptors = () => {
    axiosInstance.interceptors.request.use(
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
}

interceptors()