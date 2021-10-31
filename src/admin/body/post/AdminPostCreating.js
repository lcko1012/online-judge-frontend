import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios';
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification';
import { isEmpty } from '../../../utils/validation/Validation';
import { useHistory } from 'react-router';

function AdminPostCreating() {
    const history = useHistory()
    const [value, setValue] = useState("**Hello!!!**");
    const [postData, setPostData] = useState({
        title: "",
        visibleMode: "private"
    })
    
    const savePost = async () => {
        if(isEmpty(postData.title) || isEmpty(value) || isEmpty(postData.visibleMode)) {
            return errorNotification("Please fill in all fields")
        }
        try {
            const res = await axios.post("/api/post", {
                title: postData.title,
                content: value,
                visibleMode: postData.visibleMode
            })
            successNotification(res.data.message)
            history.push("/admin/post")
        } catch (error) {
            errorNotification(error.response.data.message)
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
                    <div className="form-group row mb-4">
                        <label className="col-md-1 col-sm-3 col-xs-12 control-label fw-bold mb-0">Title<span className="text-danger">*</span></label>
                        <div className="col-md-11 col-sm-9 col-xs-12">
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
                            <label className="form-check-label" for="flexSwitchCheckDefault">Visible</label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                onChange={onChangeCheckBox}
                                name="visibleMode"
                            />
                        </div>
                        <button className="btn btn-outline-dark" onClick={savePost}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPostCreating
