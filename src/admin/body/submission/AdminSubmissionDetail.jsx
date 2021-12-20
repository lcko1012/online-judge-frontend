import React, { useEffect, useState, useReducer, useContext } from 'react'
import { useParams, useHistory } from 'react-router';
import { axiosInstance } from '../../../services/config';
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification';
import AuthContext from '../../../context/authentication/authContext'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'

const ACTIONS = {
    GET_SUBMISSION: 'get-submission',
}

function SubmissionRedecer(state, action) {
    switch (action.type) {
        case ACTIONS.GET_SUBMISSION:
            return { ...state, submission: action.payload }
        default:
            return state
    }
}

function AdminSubmissionDetail() {
    const { id } = useParams()

    const [codeValue, setCodeValue] = useState('')

    const initialSubmission = {
        submission: {
            id: id,
            verdict: "",
            output: [],
            language: "",
            source: "",
            createdAt: new Date(),
            author: "",
            problemId: null,
        },
        currentPage: 1,
    }

    const [submissionState, dispatch] = useReducer(SubmissionRedecer, initialSubmission)
    const { submission, currentPage } = submissionState
    const authContext = useContext(AuthContext)
    const { user } = authContext
    const history = useHistory()

    useEffect(() => {
        if (id) {
            const getProblem = async () => {
                try {
                    const res = await axiosInstance.get(`/api/submission/${checkRole()}/${id}`);
                    dispatch({ type: ACTIONS.GET_SUBMISSION, payload: res.data })
                    setCodeValue(Buffer.from(res.data.source, 'base64').toString('ascii'))
                } catch (error) {
                    error.response && errorNotification(error.response.data.message)
                }
            }
            getProblem()
        }
    }, [id])

    const checkRole = () => {
        return user.role === 'Admin' ? 'admin' : 'teacher'
    }

    const deleteSubmission = async () => {
        try {
            const res = await axiosInstance.delete(`/api/submission/${checkRole()}/${id}`)
            successNotification(res.data.message)
            history.push("/admin/submission")
        } catch (error) {
            console.log(error)
        }
    }
    const verdictClass = (verdict) => {
        switch (verdict) {
          case "Correct":
            return "problem__difficulty--easy-color"
    
          case "Wrong":
            return "problem__difficulty--hard-color"
    
          default:
            return "problem__difficulty--medium-color"
    
        }
      }
    

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div className="card card-body border-0 shadow ">

                    <div className="problem__row">
                        <label className="problem__col-lg-1">Submission ID</label>
                        <div className="me-3 col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                value={submission.id}
                                disabled
                            />
                        </div>

                        <label className="problem__col-lg-1">Problem ID</label>
                        <div className=" me-3 col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={submission.problemId}
                            />
                        </div>
                    </div>

                    <div className="problem__row mt-3">
                        <label className="problem__col-lg-1">Author</label>
                        <div className="col-lg-4 me-3">
                            <input
                                type="text"
                                className="form-control"
                                value={submission.author}
                                disabled
                            />
                        </div>
                        <label className="problem__col-lg-1">Created At</label>
                        <div className="col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                value={new Date(submission.createdAt).toDateString()}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="mt-3 ">
                        <span className="fst-italic">Source code</span>
                        <CodeMirror
                            value={codeValue}
                            height="400px"
                            extensions={[
                                submission.language === 'Python' ? python() :
                                    submission.language === 'Java' ? java() :
                                        submission.language === 'C++' ? cpp() : javascript()
                            ]}
                            readonly="nocursor"
                        />
                    </div>


                    <div className="mt-3">
                        <div className="d-flex">
                            <label className="me-5">Verdict:</label>
                            <p className={`${verdictClass(submission.verdict)}`}>{submission.verdict}</p>
                        </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end">
                        
                        {
                            user.role === 'Admin' ? 
                            <div>
                                    <button className="btn btn-danger" onClick={deleteSubmission}>Delete</button>
                            </div> :
                            null
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSubmissionDetail
