import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useHistory, useParams } from 'react-router';
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification';
import AuthContext from '../../../context/authentication/authContext'
import { isEmpty } from '../../../utils/validation/Validation';



function AdminPostDetail() {
    const { id } = useParams()
    const history = useHistory()
    const [value, setValue] = useState("**Hello world!!!**");
    const [postData, setPostData] = useState({
        author: "",
        title: "",
        createdAt: "",
        visibleMode: ""
    })
    const authContext = useContext(AuthContext)
    const { user } = authContext

    const checkRole = () => {
        return user.role === 'Admin' ? 'admin' : 'teacher'
    }

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await axios.get(`/api/post/${checkRole()}/${id}`)
                setValue(res.data.content)
                setPostData({
                    author: res.data.author,
                    title: res.data.title,
                    createdAt: res.data.createdAt,
                    visibleMode: res.data.visibleMode
                })
            } catch (error) {
                console.log(error)
            }
        }
        getPost()
    }, [id])

    const savePost = async () => {
        if(isEmpty(postData.title) || isEmpty(value) || isEmpty(postData.visibleMode)) {
            return errorNotification("Please fill in all fields")
        }
        try {
            const res = await axios.put(`/api/post/${checkRole()}/${id}`, {
                title: postData.title,
                content: value,
                visibleMode: postData.visibleMode
            })

            successNotification(res.data.message)

        } catch (error) {
            errorNotification(error.response.data.message)
        }
    }

    const deletePost = async () => {
        try {
            const res = await axios.delete(`/api/post/${checkRole()}/${id}`)
            successNotification(res.data.message)
            history.push("/admin/post")
        } catch (error) {
            console.log(error)
        }
    }

    const onChangeInput = e => {
        const { name, value } = e.target
        setPostData({ ...postData, [name]: value })
    }

    const onChangeCheckBox = e => {
        setPostData({ ...postData, [e.target.name]: e.target.checked ? 'public' : 'private' })
    }
    return (
        <div className="h-100">
            <div className="container mt-5 mb-5">
                <div className="card card-body border-0 shadow ">
                    <div className="form-group d-flex mb-4 justify-content-between row">
                        <div className="col-4 d-flex">
                            <label className="control-label fw-bold mb-0 me-4">Post ID</label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={id}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-4 d-flex">
                            <label className="control-label fw-bold mb-0 me-3">Created At</label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={new Date(postData.createdAt).toDateString()}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-4 d-flex">
                            <label className="control-label fw-bold mb-0 me-4">Author</label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={postData.author}
                                    disabled
                                />
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className="form-group mb-4 ">
                        <label className="control-label fw-bold mb-2 me-4">Title<span className="text-danger">*</span></label>
                        <div className="">
                            <input
                                type="text"
                                className="form-control"
                                onChange={onChangeInput}
                                value={postData.title}
                                name="title"
                            />
                        </div>
                    </div>
                    <MDEditor
                        height={450}
                        value={value}
                        onChange={setValue}
                    />
                    <div className="mt-4 d-flex justify-content-between">
                        <div className="form-check form-switch">
                            <label className="form-check-label">Visible</label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                checked={postData.visibleMode === 'public' ? true : false}
                                onChange={onChangeCheckBox}
                                name="visibleMode"
                            />
                        </div>

                        {
                            user.role === 'Admin' || user.username === postData.author ? 
                            <div>
                                    <button className="btn btn-outline-danger me-3" onClick={deletePost}>Delete</button>
                                    <button className="btn btn-outline-dark" onClick={savePost}>Save</button>
                            </div> :
                            null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPostDetail
