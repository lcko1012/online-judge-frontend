import React, { useEffect, useReducer, useState } from 'react'
import "./adminProblem.scss"
import { useContext } from 'react'
import AuthContext from '../../../context/authentication/authContext'
import { isEmpty } from '../../../utils/validation/Validation'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../../services/config'

const ACTIONS = {
    ON_CHANGE: 'on-change',
    NEXT_PAGE: 'next-page',
    PREV_PAGE: 'prev-page',
    GET_PROBLEM_LIST: 'get-problem-list',
    RESET_PROBLEM: 'reset-problem',
    SUBMIT_SEARCH: 'submit-search'
}

function ProblemsRedecer(state, action) {
    switch(action.type) {
        case ACTIONS.ON_CHANGE:
            return { ...state, [action.payload.name]: action.payload.value }
        case ACTIONS.NEXT_PAGE:
            return { ...state, currentPage: state.currentPage + 1 }
        case ACTIONS.PREV_PAGE:
            return { ...state, currentPage: state.currentPage - 1}
        case ACTIONS.GET_PROBLEM_LIST:
            return { ...state, problemList: action.payload}
        case ACTIONS.RESET_PROBLEM:
            return {
                ...state,
                problemList: action.payload,
                currentPage: 1,
                searchProb: ''
            }
        case ACTIONS.SUBMIT_SEARCH:
            return {
                ...state, 
                problemList: action.payload,
                currentPage: 1
            }
        default: 
            return state
    }
}

function AdminProblem() {
    const authContext = useContext(AuthContext)
    const { user } = authContext 
    const initialProblems = {
        problemList: [],
        currentPage: 1,
        searchProb: ''
    }

    const [problemsState, dispatch] = useReducer(ProblemsRedecer, initialProblems)
    const {problemList, currentPage, searchProb} = problemsState
    const [problemsPerPage, setProblemsPerPage] = useState(10)

    const checkRole = () => {
        return user.role === 'Admin' ? 'admin' :'teacher'
    }

    useEffect(() => {
        const getProblemList = async () => {
            try {
                const res = await axiosInstance.get(`/api/problem/${checkRole()}`);
                dispatch({type: ACTIONS.GET_PROBLEM_LIST, payload: res.data})
            } catch (error) {
                console.log(error)
            }
        }
        getProblemList()
    }, [])

    const indexOfLastProblem = currentPage * problemsPerPage
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage
    const currentProblem = problemList.slice(indexOfFirstProblem, indexOfLastProblem)

    const onClickNext = () => {
        if(currentPage <= Math.floor(problemList.length / problemsPerPage)) {
            dispatch({type: ACTIONS.NEXT_PAGE})
        }
    }

    const onClickPrev = () => {
        if(currentPage > 1) 
        dispatch({type: ACTIONS.PREV_PAGE})
    }

    const onChangeSearch = e => {
        dispatch({type: ACTIONS.ON_CHANGE, payload: {
            name: e.target.name,
            value: e.target.value
        }})
    }

    const onSubmitSearch = async (e) => {
        e.preventDefault()
            if(isEmpty(searchProb)) return errorNotification("Please fill in search field")
            
            try {
                const res = await axiosInstance.get(`/api/problem/${checkRole()}`, {
                    params: {
                        searchTitle: searchProb
                    }
                })
                dispatch({type: ACTIONS.SUBMIT_SEARCH, payload: res.data})           
            } catch (error) {
                errorNotification(error.response.data.message)
            }
    }

    const onClickReset = async () => {
        try {
            const res = await axiosInstance.get(`/api/problem/${checkRole()}`)
            dispatch({type: ACTIONS.RESET_PROBLEM, payload: res.data})
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
							<form onSubmit={onSubmitSearch}>
								<input
									type="text"
									className="form-control"
									placeholder="Problem title"
									value={searchProb}
									name="searchProb"
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
								<th>Problem ID</th>
								<th>Problem Title</th>
								<th>Author</th>
								<th>Created</th>
								<th>Visibility</th>
								<th></th>
							</tr>
						</thead>
                        <tbody>
                            {problemList.length > 0 ? 
                                <>
                                    {
                                        currentProblem.map((prob, index) => 
                                            <tr key={prob.id}>
                                                <td><span className="fw-normal">{currentPage*10 -10 + index}</span></td>
                                                <td><span className="fw-normal">{prob.id}</span></td>
                                                <td><span className="fw-normal">{prob.title.length > 20 ? `${prob.title.slice(0,20)}...`: prob.title}</span></td>
                                                <td><span className="fw-normal">{prob.author}</span></td>
                                                <td>{new Date(prob.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <span className="fw-normal">
                                                        {prob.visibleMode === 'public' ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/problem/${prob.id}/detail`}>
                                                        <button className="btn btn-dark btn-xs">Detail</button>
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
                                        disabled={currentPage > Math.floor(problemList.length / problemsPerPage)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <Link to="/admin/problem/new">
                        <button 
                            className="btn btn-dark"
                        >
                            <i className="fal fa-plus mr-2"></i> Add Problem
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminProblem
