import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../../services/config'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import { isEmpty } from '../../../utils/validation/Validation'
import "./problem.scss"

const ACTIONS = {
    ON_CHANGE: 'on-change',
    NEXT_PAGE: 'next-page',
    PREV_PAGE: 'prev-page',
    GET_PROBLEM_LIST: 'get-problem-list',
    RESET_PROBLEM: 'reset-problem',
    SUBMIT_SEARCH: 'submit-search'
}

function ProblemsRedecer(state, action) {
    switch (action.type) {
        case ACTIONS.ON_CHANGE:
            return { ...state, [action.payload.name]: action.payload.value }
        case ACTIONS.NEXT_PAGE:
            return { ...state, currentPage: state.currentPage + 1 }
        case ACTIONS.PREV_PAGE:
            return { ...state, currentPage: state.currentPage - 1 }
        case ACTIONS.GET_PROBLEM_LIST:
            return { ...state, problemList: action.payload }
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

function Problem() {
    const initialProblems = {
        problemList: [],
        currentPage: 1,
        searchContent: '',
        searchAuthor: '',
        searchDifficulty: ''
    }
    const [problemsState, dispatch] = useReducer(ProblemsRedecer, initialProblems)
    const { problemList, currentPage, searchContent, searchAuthor, searchDifficulty } = problemsState
    const [problemsPerPage, setProblemsPerPage] = useState(10)

    useEffect(() => {
        const getProblemList = async () => {
            try {
                const res = await axiosInstance.get(`/api/problem/user`);
                dispatch({ type: ACTIONS.GET_PROBLEM_LIST, payload: res.data })
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
        if (currentPage <= Math.floor(problemList.length / problemsPerPage)) {
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

        if (isEmpty(searchContent) && isEmpty(searchAuthor) && isEmpty(searchDifficulty)) return errorNotification("Please fill in search field")

        try {
            const res = await axiosInstance.get('/api/problem/user', {
                params: {
                    searchContent: searchContent,
                    searchAuthor: searchAuthor,
                    searchDifficulty: searchDifficulty
                }
            })
            dispatch({ type: ACTIONS.SUBMIT_SEARCH, payload: res.data })
        } catch (error) {
            errorNotification(error.response.data.message)
        }
    }

    const onClickReset = async () => {
        try {
            const res = await axiosInstance.get('/api/problem/user')
            dispatch({ type: ACTIONS.RESET_PROBLEM, payload: res.data })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div class="accordion mb-4" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Search/Filter
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <form className="d-flex justify-content-between">
                                    <div>
                                        <label className="problem__block">Search content</label>
                                        <input
                                            type="text"
                                            className="form-control problem__form-input-custom"
                                            placeholder="Content"
                                            name="searchContent"
                                            value={searchContent}
                                            onChange={onChangeSearch}
                                        />
                                    </div>
                                    <div>
                                        <label className="problem__block">Search for author</label>
                                        <input
                                            type="text"
                                            className="form-control problem__form-input-custom"
                                            placeholder="Author name"
                                            name="searchAuthor"
                                            value={searchAuthor}
                                            onChange={onChangeSearch}
                                        />
                                    </div>
                                    <div>
                                        <label className="problem__block">Difficulty</label>
                                        <input
                                            type="text"
                                            className="form-control problem__form-input-custom"
                                            placeholder="All"
                                            name="searchDifficulty"
                                            value={searchDifficulty}
                                            onChange={onChangeSearch}
                                        />
                                    </div>
                                </form>

                                <div className="mt-3 text-end">
                                    <button
                                        className="btn btn-light me-2"
                                        onClick={onClickReset}
                                    >Reset</button>
                                    <button
                                        className="btn btn-light"
                                        onClick={onSubmitSearch}
                                    >Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Level</th>
                                <th>Created</th>
                                <th>Tries</th>
                                <th>Correct</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problemList.length > 0 ?
                                <>
                                    {
                                        currentProblem.map((prob, index) =>
                                            <tr key={prob.id}>
                                            

                                                <td><span className="fw-normal">{currentPage * 10 - 10 + index}</span></td>
                                                <td><Link to={`/problem/${prob.id}/detail`} className="text-black"><span className="fw-normal">{prob.title.length > 20 ? `${prob.title.slice(0, 20)}...` : prob.title}</span></Link></td>
                                                <td><span className="fw-normal">{prob.author}</span></td>
                                                <td><span className="fw-normal">{prob.difficulty}</span></td>
                                                <td>{new Date(prob.createdAt).toLocaleDateString()}</td>
                                                <td><span className="fw-normal">{prob.totalAttempt}</span></td>
                                                <td><span className="fw-normal">{prob.correctAttempt}</span></td>
                                                
                                           
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

export default Problem
