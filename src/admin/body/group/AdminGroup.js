import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../../context/authentication/authContext'
import axios from 'axios'
import { useContext } from 'react'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import { isEmpty } from '../../../utils/validation/Validation'

const ACTIONS = {
    ON_CHANGE: 'on-change',
    NEXT_PAGE: 'next-page',
    PREV_PAGE: 'prev-page',
    GET_GROUP_LIST: 'get-group-list',
    RESET_GROUP: 'reset-post',
    SUBMIT_SEARCH: 'submit-search'
}

function PostsReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ON_CHANGE:
            return { ...state, [action.payload.name]: action.payload.value }
        case ACTIONS.NEXT_PAGE:
            return { ...state, currentPage: state.currentPage + 1 }
        case ACTIONS.PREV_PAGE:
            return { ...state, currentPage: state.currentPage - 1 }
        case ACTIONS.GET_GROUP_LIST:
            return { ...state, groupList: action.payload }
        case ACTIONS.RESET_GROUP:
            return {
                ...state,
                groupList: action.payload,
                currentPage: 1,
                searchName: '',
                searchUsername: ''
            }
        case ACTIONS.SUBMIT_SEARCH:
            return {
                ...state,
                groupList: action.payload,
                currentPage: 1
            }
        default:
            return state
    }
}

function AdminGroup() {
    const authContext = useContext(AuthContext)
    const { user } = authContext
    const initialGroups = {
        groupList: [],
        currentPage: 1,
        searchName: '',
        searchUsername: ''
    }
    const [groupState, dispatch] = useReducer(PostsReducer, initialGroups)
    const { groupList, currentPage, searchName, searchUsername } = groupState
    const [groupsPerPage, setgroupsPerPage] = useState(10)

    useEffect(() => {
        const getgroupList = async () => {
            try {
                const res = await axios.get("/api/group");
                dispatch({ type: ACTIONS.GET_GROUP_LIST, payload: res.data })
            } catch (error) {
                console.log(error)
            }
        }
        getgroupList()
    }, [])

    const indexOfLastGroup = currentPage * groupsPerPage
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage
    const currentGroups = groupList.slice(indexOfFirstGroup, indexOfLastGroup)

    const onClickNext = () => {
        if (currentPage <= Math.floor(groupList.length / groupsPerPage)) {
            dispatch({ type: ACTIONS.NEXT_PAGE })
        }
    }

    const onClickPrev = () => {
        if (currentPage > 1) {
            dispatch({ type: ACTIONS.PREV_PAGE })
        }
    }

    const onChangeSearch = e => {
        dispatch({
            type: ACTIONS.ON_CHANGE, payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }

    const onSubmitSearch = async (e) => {
        e.preventDefault()
        if (e.keyCode === 13) {
            if (isEmpty(searchName) && isEmpty(searchUsername)) return errorNotification("Please fill in search field")
            try {
                const res = await axios.get("/api/group", {
                    params: {
                        name: searchName,
                        username: searchUsername
                    }
                })
                dispatch({ type: ACTIONS.SUBMIT_SEARCH, payload: res.data })
            } catch (error) {
                errorNotification(error.response.data.message)
            }
        }

    }

    const onClickReset = async () => {
        try {
            const res = await axios.get('/api/group')
            dispatch({ type: ACTIONS.RESET_GROUP, payload: res.data })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <div className="input-group me-2 me-lg-3 ">
                            <span className="input-group-text">
                                <i className="fal fa-search"></i>
                            </span>
                            <form onKeyUp={onSubmitSearch} className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Groupname"
                                    value={searchName}
                                    name="searchName"
                                    onChange={onChangeSearch}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Creator"
                                    value={searchUsername}
                                    name="searchUsername"
                                    onChange={onChangeSearch}
                                />
                            </form>
                        </div>
                    </div>

                    <div>
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
                                <th>Group</th>
                                <th>Creator</th>
                                <th>Member</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupList.length > 0 ?
                                <>
                                    {
                                        currentGroups.map((group, index) =>
                                            <tr key={group.id}>
                                                <td><span className="fw-normal">{currentPage * 10 - 10 + index}</span></td>
                                                <td><span className="fw-normal">{group.name.length > 20 ? `${group.name.slice(0, 20)}...` : group.name}</span></td>
                                                <td><span className="fw-normal">{group.users[0].username}</span></td>
                                                <td><span className="fw-normal">{group.userCount}</span></td>
                                                <td>
                                                    <Link to={`/admin/group/${group.id}/detail`}>
                                                        <button className="btn btn-light btn-xs">
                                                            Detail
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </> : null
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
                                        disabled={currentPage > Math.floor(groupList.length / groupsPerPage)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <Link to="/admin/group/new">
                        <button 
                            className="btn btn-dark"
                        >
                            <i className="fal fa-plus mr-2"></i> Add Group
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default AdminGroup
