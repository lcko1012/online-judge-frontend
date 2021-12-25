import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../../services/config'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import { isEmpty } from '../../../utils/validation/Validation'


const ACTIONS = {
    ON_CHANGE: 'on-change',
    NEXT_PAGE: 'next-page',
    PREV_PAGE: 'prev-page',
    GET_USER_LIST: 'get-user-list',
    RESET_USER: 'reset-user',
    SUBMIT_SEARCH: 'submit-search',
    OPEN_ROLE: 'open-role',
    CHANGE_ITEM: 'change-item'
}

function UsersReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ON_CHANGE:
            return { ...state, [action.payload.name]: action.payload.value }
        case ACTIONS.NEXT_PAGE:
            return { ...state, currentPage: state.currentPage + 1 }
        case ACTIONS.PREV_PAGE:
            return { ...state, currentPage: state.currentPage - 1 }
        case ACTIONS.GET_USER_LIST:
            return { ...state, userList: action.payload }
        case ACTIONS.RESET_USER:
            return {
                ...state,
                userList: action.payload,
                currentPage: 1,
                searchUsername: '',
                searchRole: ''
            }
        case ACTIONS.SUBMIT_SEARCH:
            return {
                ...state,
                userList: action.payload,
                currentPage: 1
            }
        case ACTIONS.OPEN_ROLE:
            return {
                ...state,
                isOpenRole: !state.isOpenRole,
            }
        case ACTIONS.CHANGE_ITEM:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}


function AdminUser() {
    const initialUser = {
        userList: [],
        currentPage: 1,
        searchUsername: '',
        isOpenRole: false,
        searchRole: ''
    }

    const [userState, dispatch] = useReducer(UsersReducer, initialUser)
    const [usersPerPage, setUsersPerPage] = useState(10)

    useEffect(() => {
        const getUsers = async () => {
            const res = await axiosInstance.get('/api/user')
            if (res.status === 200) {
                dispatch({ type: ACTIONS.GET_USER_LIST, payload: res.data })
            }
        }
        getUsers()
    }, [])

    const { userList, currentPage, searchUsername, isOpenRole, searchRole } = userState

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser)


    const onClickNext = () => {
        if (currentPage <= Math.floor(userList.length / usersPerPage)) {
            dispatch({ type: ACTIONS.NEXT_PAGE })
        }
    }

    const onClickPrev = () => {
        if (currentPage > 1)
            dispatch({ type: ACTIONS.PREV_PAGE })
    }

    const onChangeSearch = e => {
        dispatch({
            type: ACTIONS.ON_CHANGE, payload: {
                name: e.target.name,
                value: e.target.value
            }
        })
    }

    const onSubmitSearch = async (e) => {
        e.preventDefault()
        if (isEmpty(searchUsername) && isEmpty(searchRole)) return errorNotification("Please fill in search field")

        const res = await axiosInstance.get('/api/user/', {
            params: {
                searchUsername: searchUsername,
                searchRole: searchRole
            }
        })
        if (res.status === 200) {
            dispatch({ type: ACTIONS.SUBMIT_SEARCH, payload: res.data })
        }

    }

    const onClickReset = async () => {
        const res = await axiosInstance.get('/api/user/')
        if (res.status === 200) {
            dispatch({ type: ACTIONS.RESET_USER, payload: res.data })
        }
    }

    const toggleOpenRole = () => dispatch({ type: ACTIONS.OPEN_ROLE })

    const onChangeRole = (role) => {
        dispatch({type: ACTIONS.CHANGE_ITEM, payload: {searchRole: role}})
    }

    const roleClass = `dropdown-menu${isOpenRole ? " show" : ""}`

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="input-group me-2 me-lg-3 ">
                        <span className="input-group-text">
                            <i className="fal fa-search"></i>
                        </span>

                        <form  className='d-flex'>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={searchUsername}
                                name="searchUsername"
                                onChange={onChangeSearch}
                            />
                            <div className="width-fit-content ms-2" >
                                <button type="button" className='btn btn-light dropdown-toggle' onClick={toggleOpenRole}>
                                    { searchRole === '' ? 'Role'
                                    : searchRole === 'Regular User' ? 'Student'
                                    : searchRole    
                                }
                                </button>
                                <ul className={roleClass}>
                                    <li className="dropdown-item cursor-pointer" onClick={() => onChangeRole('')}>
                                        Role
                                    </li>
                                    <li className="dropdown-item cursor-pointer" onClick={() => onChangeRole('Admin')}>
                                        Admin
                                    </li>
                                    <li className="dropdown-item cursor-pointer" onClick={() => onChangeRole('Teacher')}>
                                        Teacher
                                    </li>
                                    <li className="dropdown-item cursor-pointer" onClick={() => onChangeRole('Regular User')}>
                                        Student
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>

                    <div className='d-flex'>
                        <button
                            className="btn btn-light me-2"
                            onClick={onSubmitSearch}
                        >Submit</button>

                        <button
                            className="btn btn-light"
                            onClick={onClickReset}
                        >Reset</button>
                    </div>
                </div>


                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Last Online</th>
                                <th>Is Active</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.length > 0 &&
                                <>
                                    {
                                        currentUsers.map((user, index) =>
                                            <tr key={user.id}>
                                                <td><span className="fw-normal">{currentPage * 10 - 10 + index}</span></td>
                                                <td><span className="fw-normal">{user.username}</span></td>
                                                <td><span className="fw-normal">{user.role === "Regular User" ? "Student" : user.role}</span></td>
                                                <td>Some days</td>
                                                <td>
                                                    {user.isActive ? "Yes" : "No"}
                                                </td>
                                                <td>
                                                    <Link to={`/admin/user/${user.username}/detail`}>
                                                        <button className="btn btn-dark btn-xs">Detail</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </>
                            }
                        </tbody>
                    </table>

                    <div className="card-footer px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination mb-0">
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={onClickPrev}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>

                                <li className="page-item">
                                    <button className="page-link">{currentPage}</button>
                                </li>

                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={onClickNext}
                                        disabled={currentPage > Math.floor(userList.length / usersPerPage)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminUser
