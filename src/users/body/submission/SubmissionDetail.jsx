import React, { useEffect, useState, useReducer } from 'react'
import { useParams, useHistory } from 'react-router';
import { axiosInstance } from '../../../services/config';
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification';
import MDEditor from '@uiw/react-md-editor'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'

const ACTIONS = {
  NEXT_PAGE: 'next-page',
  PREV_PAGE: 'prev-page',
  GET_SUBMISSION: 'get-submission',
}

function SubmissionRedecer(state, action) {
  switch (action.type) {
    case ACTIONS.NEXT_PAGE:
      return { ...state, currentPage: state.currentPage + 1 }
    case ACTIONS.PREV_PAGE:
      return { ...state, currentPage: state.currentPage - 1 }
    case ACTIONS.GET_SUBMISSION:
      return { ...state, submission: action.payload }
    default:
      return state
  }
}

function SubmissionDetail() {
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
  const [testCasePerPage, setTestCasePerPage] = useState(10)

  useEffect(() => {
    if (id) {
      const getProblem = async () => {
        try {
          const res = await axiosInstance.get(`/api/submission/user/${id}`);
          console.log(res.data)
          dispatch({ type: ACTIONS.GET_SUBMISSION, payload: res.data })
          setCodeValue(Buffer.from(res.data.source, 'base64').toString('ascii'))
        } catch (error) {
          error.response && errorNotification(error.response.data.message)
        }
      }
      getProblem()
    }
  }, [id])

  const onClickNext = () => {
    if (currentPage <= Math.floor(submission.output.length / testCasePerPage)) {
      dispatch({ type: ACTIONS.NEXT_PAGE })
    }
  }

  const onClickPrev = () => {
    if (currentPage > 1)
      dispatch({ type: ACTIONS.PREV_PAGE })
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
          <div className="d-flex border-bottom">
            <label className="me-2 fw-bold">Submission ID:</label>
            <p className="mb-0">{id}</p>
          </div>
          <div className="px-5 mt-2">
            <div className="row">
              <div className="col-md-6 d-flex">
                <label className="me-2">Author:</label>
                <p>{submission.author}</p>
              </div>
              <div className="col-md-6 d-flex">
                <label className="me-2">Problem ID:</label>
                <p>{submission.problemId}</p>
              </div>
            </div>
            <div className="row">
              <div className="d-flex">
                <label className="me-2">Language:</label>
                <p>{submission.language}</p>
              </div>
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
            <label>Status</label>
            <div className="px-5">
              <div className="d-flex">
                <label className="me-5">Verdict:</label>
                <p className={`${verdictClass(submission.verdict)}`}>{submission.verdict}</p>
              </div>

              <div>
                <label>Run Testcase:</label>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>status</th>
                      <th>time</th>
                      <th>memory</th>
                    </tr>
                  </thead>
                  {
                    submission !== null &&
                    <tbody>
                      {
                        submission.output.length > 0 ?
                          <>
                            {
                              submission.output.map((sub, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{sub.status.description}</td>
                                    <td>{sub.time}</td>
                                    <td>{(sub.memory / 1024).toString().slice(0, 3)}</td>
                                  </tr>
                                )
                              })
                            }
                          </>
                          : null
                      }
                      <tr></tr>
                    </tbody>
                  }
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
        </div>
      </div>
    </div>
  )
}

export default SubmissionDetail
