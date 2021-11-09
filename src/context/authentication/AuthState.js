import React, { useReducer } from 'react'
import {LOGOUT, LOGIN_SUCCESS, GET_USER} from "../types"
import authReducer from './authReducer'
import AuthContext from "./authContext";
import CookiesService from '../../services/CookiesService';
import { axiosInstance } from '../../services/config';


const AuthState = (props) => {
    const initialState = {
        isAuthenticated: false,
        user: null,
    }

    const cookiesService = CookiesService.getService()

    const [state, dispatch] = useReducer(authReducer, initialState)

    const loadUser = async () => {
        try {
            const res = await axiosInstance.get('/api/user/whoami')
            if(res) {
                dispatch({
                    type: GET_USER,
                    payload: res.data
                })
            }
        } catch (err) {
            dispatch({
                type: LOGOUT
            })
        }
    }

    const login = () => {
        dispatch({
            type: LOGIN_SUCCESS,
        })
        loadUser()
    }

    const logout = async () => {
        await axiosInstance.get('/api/auth/logout')
        dispatch({
            type: LOGOUT
        })
        cookiesService.clearToken()
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                login,
                loadUser,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )

}



export default AuthState