import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { axiosInstance } from '../../../services/config';
import { errorNotification } from '../../../utils/notification/ToastNotification';
import MDEditor from '@uiw/react-md-editor'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import axios from 'axios'

function ProblemDetail() {
    const { id } = useParams()
    const [problem, setProblem] = useState({})
    const [isOpenLanguage, setOpenLanguage] = useState(false)
    const [codeValue, setCodeValue] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('javascript')

    useEffect(() => {
        if (id) {
            const getProblem = async () => {
                try {
                    const res = await axiosInstance.get(`/api/problem/user/${id}`);
                    setProblem(res.data)
                    console.log(res.data)
                } catch (error) {
                    error.response && errorNotification(error.response.data.message)
                }
            }
            getProblem()
        }
    }, [id])
    const languageClass = `dropdown-menu${isOpenLanguage ? " show" : ""}`

    const languageArray = ["javascript", "java", "cpp", "python"]

    const onChangeLanguage = (language) => {
        setSelectedLanguage(language)
    }

    const openLanguageBox = () => {
        setOpenLanguage(!isOpenLanguage)
    }

    const checkLanguageId = () => {
        switch (selectedLanguage) {
            case "javascript":
                return 63
            case "java":
                return 62
            case "cpp":
                return 54
            case "python":
                return 71
            default:
                return 63
        }
    }

    const submitCode = async () => {
        try {
            const res = await axiosInstance.post(`/api/submission/${id}`, {
                source_code: Buffer.from(codeValue).toString('base64'),
                language_id: checkLanguageId(),
            })

            console.log(res)
        } catch (error) {
            error.response && errorNotification(error.response.data.message)
        }
    }

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div className="card card-body border-0 shadow ">
                    <div className="d-flex justify-content-between">
                        <div>
                            <label>Problem</label>
                            <span className="ms-2">{problem.title}</span>
                        </div>
                        <div>
                            <label>Time Limit</label>
                            <span className="ms-2">{problem.timeLimit}</span>
                        </div>
                        <div>
                            <label>Mem Limit</label>
                            <span className="ms-2">{problem.memoryLimit}</span>
                        </div>
                    </div>

                    <div className="mt-3 problem__statement">
                        <MDEditor.Markdown source={problem.statement} />
                    </div>

                    <div className="mt-3 problem__submit-container">
                        <div className="d-flex justify-content-between mb-3">
                            <span>Code Editor</span>
                            <div className="width-fit-content" >
                                <button type="button" className="btn btn-light dropdown-toggle" onClick={openLanguageBox}>
                                    {selectedLanguage}
                                </button>
                                <ul className={languageClass}>
                                    {
                                        languageArray.map((language, index) => {
                                            return (
                                                <li key={index} className="dropdown-item" onClick={() => onChangeLanguage(language)}>
                                                    {language}
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            
                        </div>
                        <CodeMirror
                                value={codeValue}
                                height="400px"
                                extensions={[
                                    selectedLanguage === 'python' ? python() :
                                    selectedLanguage === 'java' ? java() :
                                    selectedLanguage === 'cpp' ? cpp() : javascript()
                                ]}
                                onChange={(value) => {
                                    setCodeValue(value)
                                }}
                            />
                    </div>

                    <div className="mt-3 text-end">
                        <button className="btn btn-dark" onClick={submitCode}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProblemDetail