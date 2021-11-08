import React, { useEffect, useState, useContext, useReducer } from 'react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios';
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification'
import { useHistory, useParams } from 'react-router';
import AuthContext from '../../../context/authentication/authContext'

const ACTIONS = {
    ON_CHANGE: 'on-change',
    GET_PROBLEM: 'get-group',
    GET_TAG_LIST: 'get-tag-list',
    GET_PICKED_TAG: 'get-picked-tag',
    CHANGE_ZIP_FILE_STATUS: 'change-zip-file-status',
    OPEN_TAG_LIST: 'open-tag-list',
    OPEN_DIFFICULTY: 'open-diff',
    CHANGE_PROBLEM_ITEM: 'change-problem-item'
}

function ProblemReducer(state, action) {
    switch(action.type) {
        case ACTIONS.ON_CHANGE:
            return { ...state, [action.payload.name]: action.payload.value }
    
        case ACTIONS.GET_PROBLEM:
            return { ...state, 
                title: action.payload.title,
                timeLimit: action.payload.timeLimit,
                memoryLimit: action.payload.memoryLimit,
                visibleMode: action.payload.visibleMode,
                difficulty: action.payload.difficulty,
                createdAt: action.payload.createdAt,
                author: action.payload.author,
                id: action.payload.id,
                pickedTags: action.payload.problemTags,
                zipFile: action.payload.testDataURL,
                isShowZipFileLink: action.payload.testDataURL ? true : false,
            }
        case ACTIONS.GET_TAG_LIST:
            return { ...state, tagList: action.payload }
        case ACTIONS.GET_PICKED_TAG:
            return { ...state, pickedTags: action.payload}

        case ACTIONS.CHANGE_ZIP_FILE_STATUS:
            return {
                ...state,
                ...action.payload,
            }
        case ACTIONS.OPEN_TAG_LIST:
            return {
                ...state, 
                isOpen: !state.isOpen,
            }
        case ACTIONS.OPEN_DIFFICULTY:
            return {
                ...state, 
                isOpenDificulty: !state.isOpenDificulty,
            }
        case ACTIONS.CHANGE_PROBLEM_ITEM:
            return {
                ...state, 
                ...action.payload
            }
        
        default: 
            return state
    }
}

const initialProblem = {
    title: '',
    timeLimit: 1,
    memoryLimit: 256,
    visibleMode: 'public',
    difficulty: null,
    createdAt: new Date(),
    author: '',
    id: '',
    // statement: "**Hello!!!**",
    zipFile: null,
    isOpen: false,
    isOpenDificulty: false,
    tagList: [],
    pickedTags: [],
    isShowZipFileLink: false,
}


function AdminProblemCreating() {
    const { id } = useParams()
    const [statement, setStatement] = useState("**Hello!!!**");
    const difficultyList = ["Easy", "Medium", "Hard"];
    const authContext = useContext(AuthContext)
    const { user } = authContext
    const history = useHistory()

    const [problemState, dispatch] = useReducer(ProblemReducer, initialProblem)
    const {tagList, pickedTags, zipFile, isShowZipFileLink, isOpen, isOpenDificulty} = problemState

    const checkRole = () => {
        return user.role === 'Admin' ? 'admin' : 'teacher'
    }

    useEffect(() => {
        const getTagList = async () => {
            const res = await axios.get('/api/tag');
            dispatch({type: ACTIONS.GET_TAG_LIST, payload: res.data})
        }

        getTagList()
    }, [])

    useEffect(() => {
        if (id) {
            const getProblem = async () => {
                try {
                    const res = await axios.get(`/api/problem/${checkRole()}/${id}`);
                    console.log(res.data);
                    setStatement(res.data.statement);
                    dispatch({type: ACTIONS.GET_PROBLEM, payload: res.data})
                } catch (error) {
                    error.response && errorNotification(error.response.data.message)
                    history.push('/admin/problem')
                }
            }
            getProblem()
        }
    }, [id])

    const validateFile = async () => {
        if (zipFile) {
            try {
                const formData = new FormData()
                formData.append("zipFile", zipFile)
                const res = await axios.post('/api/problem/validate_zip', formData)
                successNotification(res.data.message)
            } catch (error) {
                error.response.data && errorNotification(error.response.data.message)
            }
        }
    }

    const handleChangeFile = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            return
        }
        if (!file.type.includes('zip')) {
            errorNotification("Only zip file is allowed");
            e.target.value = "";
            dispatch({type: ACTIONS.CHANGE_ZIP_FILE_STATUS, payload: {zipFile: null}})
            return
        }
        dispatch({type: ACTIONS.CHANGE_ZIP_FILE_STATUS, payload: {zipFile: file, isShowZipFileLink: false}})
    }

    const deleteFile = () => {
        dispatch({type: ACTIONS.CHANGE_ZIP_FILE_STATUS, payload: {zipFile: null, isShowZipFileLink: false}})
    }

    const toggleOpen = () => dispatch({type: ACTIONS.OPEN_TAG_LIST})
    const toggleOpenDificulty = () => dispatch({type: ACTIONS.OPEN_DIFFICULTY})
    const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
    const difficultyClass = `dropdown-menu${isOpenDificulty ? " show" : ""}`

    const difficultyBtnClass = () => {
        if (problemState.difficulty === "Easy") {
            return "btn btn-outline-success"
        }
        else if (problemState.difficulty === "Medium") {
            return "btn btn-outline-warning"
        }
        else if (problemState.difficulty === "Hard") {
            return "btn btn-outline-danger"
        }
        else return "btn btn-light"
    }


    const onChangeTagCheckbox = (e) => {
        tagList.map(tag => {
            if (tag.tagName === e.target.name && e.target.checked) {
                dispatch({type: ACTIONS.GET_PICKED_TAG, payload: [...pickedTags, tag]})
            }
            if (tag.tagName === e.target.name && !e.target.checked) {
                dispatch({type: ACTIONS.GET_PICKED_TAG, payload: pickedTags.filter(tag => tag.tagName !== e.target.name)})
            }
        })
    }

    const onChangeCheckBox = e => {
        dispatch({
            type: ACTIONS.ON_CHANGE, payload: {
                name: e.target.name,
                value: e.target.checked ? 'public' : 'private'
            }
        });
    }

    const onChangeInput = e => {
        dispatch({
            type: ACTIONS.ON_CHANGE, payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }

    const onChangeDifficulty = (difficulty) => {
        dispatch({type: ACTIONS.CHANGE_PROBLEM_ITEM, payload: {difficulty: difficulty}})
    }

    const saveProblem = async () => {
        if(!statement || !problemState.title) {
            return errorNotification("Please fill all the fields")
        }
        try {
            const problemRequest = new FormData()
            problemRequest.append("statement", statement)
            problemRequest.append("timeLimit", problemState.timeLimit)
            problemRequest.append("memoryLimit", problemState.memoryLimit)
            problemRequest.append("visibleMode", problemState.visibleMode)
            problemRequest.append("difficulty", problemState.difficulty)
            problemRequest.append("title", problemState.title)
            problemRequest.append("testDataURL", zipFile)
            problemRequest.append("problemTags", JSON.stringify(pickedTags))
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            const res =  id ? 
            await axios.patch(`/api/problem/${checkRole()}/${id}`, problemRequest,config) :  
            await axios.post('/api/problem', problemRequest,config)

            successNotification(res.data.message)
        } catch (error) {
            error.response && errorNotification(error.response.data.message)
        }
    }

    const deleteProblem = async () => {
        try {
            const res = await axios.delete(`/api/problem/${checkRole()}/${id}`)
            successNotification(res.data.message)
            history.push('/admin/problem')
        } catch (error) {
            error.response && errorNotification(error.response.data.message)
        }
    }

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div className="card card-body border-0 shadow ">
                    <div className="problem__row">
                        <label className="problem__col-lg-1">Problem ID</label>
                        <div className="me-3 col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                value={problemState.id}
                                disabled
                            />
                        </div>

                        <label className="problem__col-lg-1">Problem Title</label>
                        <div className=" me-3 col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                onChange={onChangeInput}
                                name="title"
                                value={problemState.title}
                            />
                        </div>
                    </div>

                    <div className="problem__row mt-3">
                        <label className="problem__col-lg-1">Author</label>
                        <div className="col-lg-4 me-3">
                            <input
                                type="text"
                                className="form-control"
                                value={problemState.author}
                                disabled
                            />
                        </div>
                        <label className="problem__col-lg-1">Created At</label>
                        <div className="col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                value={new Date(problemState.createdAt).toDateString()}
                                disabled
                            />
                        </div>
                    </div>

                    <label className="mt-4">Problem Body</label>

                    <MDEditor
                        height={400}
                        value={statement}
                        onChange={setStatement}
                    />

                    <div className="d-flex mt-4">
                        <label className="my-0 me-4">Problem Tag</label>

                        <div className="width-fit-content" >
                            <button type="button" className="btn btn-light dropdown-toggle " onClick={toggleOpen}>
                                {pickedTags.length > 0 ? pickedTags.map(tag => tag.tagName).join(', ') : "Select Tag"}
                            </button>
                            <ul className={menuClass}>
                                {tagList.map((tag) => {
                                    return (
                                        <li key={tag.id} className="dropdown-item d-flex justify-content-between align-items-center">
                                            <span>

                                                {tag.tagName}
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="text-end"
                                                name={`${tag.tagName}`}
                                                onChange={onChangeTagCheckbox}
                                                // check if pickedtag is already selected
                                                checked={pickedTags.some(pickedTag => pickedTag.tagName === tag.tagName)}
                                            />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="d-flex mt-4">
                        <label className="my-0 me-4">Difficulty</label>

                        <div className="width-fit-content" >
                            <button type="button" className={`${difficultyBtnClass()} dropdown-toggle`} onClick={toggleOpenDificulty}>
                                {problemState.difficulty ? problemState.difficulty : "Select Difficulty"}
                            </button>
                            <ul className={difficultyClass}>
                                <li className="dropdown-item" onClick={() => onChangeDifficulty(null)}>
                                    Select Difficulty
                                </li>
                                {difficultyList.map((difficulty, index) => {
                                    return (
                                        <li key={index} className="dropdown-item" onClick={() => onChangeDifficulty(difficulty)}>
                                            {difficulty}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <label className="me-2 mt-4">Constraint</label>
                    <div className="row px-5">
                        <div className="col-lg-6">
                            <label className="me-3">Time Limit (s)</label>
                            <input
                                type="number"
                                className="form-control problem__form-input-custom"
                                onChange={onChangeInput}
                                name="timeLimit"
                                value={problemState.timeLimit}
                            />
                        </div>

                        <div className="col-lg-6">
                            <label className="me-3">Memory Limit (MB)</label>
                            <input
                                type="number"
                                className="form-control problem__form-input-custom"
                                onChange={onChangeInput}
                                name="memoryLimit"
                                value={problemState.memoryLimit}
                            />
                        </div>
                    </div>

                    <div className="d-flex mt-4">
                        <label className="problem__col-lg-1">Test Data</label>

                        <form className="d-flex">
                            {isShowZipFileLink && zipFile ? 
                            <a
                                href={zipFile}
                                className="me-5"
                            >{zipFile}</a> : 
                            
                            <input
                                type="file"
                                name="zipFile"
                                className="form-control problem__form-input-custom me-5"
                                onChange={handleChangeFile}
                            ></input>}

                            <div>
                                <input
                                    type="reset"
                                    className="btn btn-danger me-2"
                                    onClick={deleteFile}
                                    value="Delete?"
                                ></input>

                                <input
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={validateFile}
                                    value="Validate?"
                                ></input>

                            </div>
                        </form>
                    </div>

                    <div className="mt-3 d-flex justify-content-between">
                        <div className="form-check form-switch">
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Visible</label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                onChange={onChangeCheckBox}
                                name="visibleMode"
                                checked={problemState.visibleMode === 'public' ? true : false}

                            />
                        </div>
                        
                        {
                            user.role === 'Admin' || user.username === problemState.author ? 
                            <div>
                                    {id ? <button className="btn btn-outline-danger me-3" onClick={deleteProblem}>Delete</button> : null}
                                    <button className="btn btn-outline-dark" onClick={saveProblem}>Save</button>
                            </div> :
                            null
                        }

                    </div>
                </div>
            </div>
        </div>

    )
}

export default AdminProblemCreating
