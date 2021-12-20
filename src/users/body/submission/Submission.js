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

function SubmissionsRedecer(state, action) {
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
                searchProb: ''
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

function Submission() {
    const initialProblems = {
        submissionList: [],
        currentPage: 1,
        searchContent: '',
        searchAuthor: '',
        searchLanguage: '',
        searchVerdict: ''
    }
    const [problemsState, dispatch] = useReducer(SubmissionsRedecer, initialProblems)
    const { submissionList, currentPage, searchContent, searchAuthor, searchLanguage, searchVerdict } = problemsState
    const [submissionsPerPage, setProblemsPerPage] = useState(10)

    useEffect(() => {
        const updateSubmissionVerdict = async (id) => {
            try {
                const res = await axiosInstance.put(`/api/submission/update_verdict/${id}`);
                dispatch({ type: ACTIONS.GET_SUBMISSION_LIST, payload: res.data })
            } catch (error) {
                console.log(error)
            }
        }

        const getProblemList = async () => {
            try {
                const res = await axiosInstance.get(`/api/submission/user`);
                console.log(res.data)
                dispatch({ type: ACTIONS.GET_SUBMISSION_LIST, payload: res.data })
                if (res.data.length > 0) {
                    console.log(res.data)
                    res.data.map((submission, index) => {
                        if (submission.verdict === "Processing" || submission.verdict === "In Queue") {
                            console.log("true")
                            updateSubmissionVerdict(submission.id)
                        }
                    })
                }
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

        if (isEmpty(searchContent) && isEmpty(searchAuthor) && isEmpty(searchVerdict) && isEmpty(searchLanguage) ) return errorNotification("Please fill in search field")

        try {
            const res = await axiosInstance.get('/api/submission/user', {
                params: {
                    searchContent: searchContent,
                    searchAuthor: searchAuthor,
                    searchVerdict: searchVerdict,
                    searchLanguage: searchLanguage
                }
            })
            dispatch({ type: ACTIONS.SUBMIT_SEARCH, payload: res.data })
        } catch (error) {
            errorNotification(error.response.data.message)
        }
    }

    const onClickReset = async () => {
        try {
            const res = await axiosInstance.get('/api/submission/user')
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
                                        <label className="problem__block">Verdict</label>
                                        <input
                                            type="text"
                                            className="form-control problem__form-input-custom"
                                            placeholder="All"
                                            name="searchVerdict"
                                            value={searchVerdict}
                                            onChange={onChangeSearch}
                                        />
                                    </div>

                                    <div>
                                        <label className="problem__block">Language</label>
                                        <input
                                            type="text"
                                            className="form-control problem__form-input-custom"
                                            placeholder="All"
                                            name="searchLanguage"
                                            value={searchLanguage}
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
                                <th>Problem</th>
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
                                                <td><span className="fw-normal">{submission.problem.title.length > 20 ? `${submission.problem.title.slice(0, 20)}...` : submission.problem.title}</span></td>
                                                <td><span className="fw-normal">{submission.author}</span></td>
                                                <td><span className={`fw-normal problem__difficulty ${verdictClass(submission.verdict)}`}>{submission.verdict}</span></td>
                                                <td><span className="fw-normal">{submission.language}</span></td>
                                                <td><span className="fw-normal">{new Date(submission.createdAt).toDateString().slice(4, 15)}</span></td>
                                                <td>
                                                    <Link to={`/submission/${submission.id}/detail`}>
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

export default Submission
