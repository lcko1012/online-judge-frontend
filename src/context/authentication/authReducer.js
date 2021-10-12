import {
    LOGIN_SUCCESS,
    LOGOUT,
    GET_USER,
} from "../types"

export default (state, action) => {

    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
            }

        case GET_USER:
            return {
                ...state,
                user: action.payload
            }

        case LOGOUT: 
            return {
                ...state,
                user: null,
                isAuthenticated: false
            }

        default:
            return state
    }
}