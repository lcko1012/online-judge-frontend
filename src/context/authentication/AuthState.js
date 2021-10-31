import axios from 'axios'
import React, { useReducer } from 'react'
import {LOGOUT, LOGIN_SUCCESS, GET_USER} from "../types"
import authReducer from './authReducer'
import AuthContext from "./authContext";
import CookiesService from '../../services/CookiesService';


const AuthState = (props) => {
    const initialState = {
        isAuthenticated: false,
        user: null,
    }

    const cookiesService = CookiesService.getService()

    const [state, dispatch] = useReducer(authReducer, initialState)

    const loadUser = async () => {
        try {
            const res = await axios.get('/api/user/whoami')
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
        await axios.get('/api/auth/logout')
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