import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../../services/config'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import { isEmpty } from '../../../utils/validation/Validation'

const ACTIONS = {
    ON_CHANGE: 'on-change',
    NEXT_PAGE: 'next-page',
    PREV_PAGE: 'prev-page',
    GET_SUBMISSION_LIST: 'get-problem-list',
    RESET_SUBMISSION: 'reset-submission',
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
        case ACTIONS.GET_SUBMISSION_LIST:
            return { ...state, submissionList: action.payload }
        case ACTIONS.RESET_SUBMISSION:
            return {
                ...state,
                submissionList: action.payload,
                currentPage: 1,
                searchText: ''
            }
        case ACTIONS.SUBMIT_SEARCH:
            return {
                ...state,
                submissionList: action.payload,
                currentPage: 1
            }
        default:
            return state
    }
}

function AdminSubmission() {
    const initialProblems = {
        submissionList: [],
        currentPage: 1,
        searchText: '',
    }
    const [problemsState, dispatch] = useReducer(ProblemsRedecer, initialProblems)
    const { submissionList, currentPage, searchText } = problemsState
    const [submissionsPerPage, setProblemsPerPage] = useState(10)

    useEffect(() => {
        const getProblemList = async () => {
            try {
                const res = await axiosInstance.get(`/api/submission/admin`);
                console.log(res.data)
                dispatch({ type: ACTIONS.GET_SUBMISSION_LIST, payload: res.data })
            } catch (error) {
                console.log(error)
            }
        }
        getProblemList()
    }, [])

    const indexOfLastSubmission = currentPage * submissionsPerPage
    const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage
    const currentSubmission = submissionList.slice(indexOfFirstSubmission, indexOfLastSubmission)

    const onClickNext = () => {
        if (currentPage <= Math.floor(submissionList.length / submissionsPerPage)) {
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

        if (isEmpty(searchText) ) return errorNotification("Please fill in search field")

        try {
            const res = await axiosInstance.get('/api/submission/admin', {
                params: {
                    searchText
                }
            })
            console.log(res.data)
            dispatch({ type: ACTIONS.SUBMIT_SEARCH, payload: res.data })
        } catch (error) {
            errorNotification(error.response.data.message)
        }
    }

    const onClickReset = async () => {
        try {
            const res = await axiosInstance.get('/api/submission/admin')
            dispatch({ type: ACTIONS.RESET_SUBMISSION, payload: res.data })
        } catch (error) {
            console.log(error)
        }
    }

    const verdictClass = (verdict) => {
        switch (verdict) {
            case "Correct":
                return "problem__difficulty--easy"

            case "Wrong":
                return "problem__difficulty--hard"

            default:
                return "problem__difficulty--medium"

        }
    }

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
						<div className="input-group me-2 me-lg-3 ">
							<span className="input-group-text">
								<i className="fal fa-search"></i>
							</span>
							<form onSubmit={onSubmitSearch}>
								<input
									type="text"
									className="form-control"
									placeholder="Problem's ID or author"
									value={searchText}
									name="searchText"
									onChange={onChangeSearch}
								/>
							</form>
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
                                <th>Sub ID</th>
                                <th>Prob ID</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Language</th>
                                <th>When</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissionList.length > 0 ?
                                <>
                                    {
                                        currentSubmission.map((submission, index) =>
                                            <tr key={submission.id}>
                                                <td><span className="fw-normal">{currentPage * 10 - 10 + index}</span></td>
                                                <td><span className="fw-normal">{submission.id}</span></td>
                                                <td><span className="fw-normal">{submission.problemId}</span></td>
                                                <td><span className="fw-normal">{submission.author}</span></td>
                                                <td><span className={`fw-normal problem__difficulty ${verdictClass(submission.verdict)}`}>{submission.verdict}</span></td>
                                                <td><span className="fw-normal">{submission.language}</span></td>
                                                <td><span className="fw-normal">{new Date(submission.createdAt).toDateString().slice(4, 15)}</span></td>
                                                <td>
                                                    <Link to={`/admin/submission/${submission.id}/detail`}>
                                                        <button className="btn btn-outline-dark">Detail</button>
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

export default AdminSubmission
