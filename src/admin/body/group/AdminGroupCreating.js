import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification';
import AuthContext from '../../../context/authentication/authContext'
import './adminGroup.scss'
import { isEmpty } from '../../../utils/validation/Validation';

function AdminGroupCreating() {
    const { id } = useParams()
    const history = useHistory()
    const [groupData, setGroupData] = useState({
        id: "",
        name: "",
        description: "",
        createdAt: new Date().toUTCString().slice(4,16),
    })


    const authContext = useContext(AuthContext)
    const { user } = authContext

    const saveGroup = async () => {
        if(isEmpty(groupData.name)) return errorNotification("Please fill in the name field")
        try {
            const res = await axios.post("/api/group", {
                name: groupData.name,
                description: groupData.description
            })
            successNotification(res.data.message)
            history.push("/admin/group")
        } catch (error) {
            console.log(error)
        }
    }

    const onChangeInput = e => {
        const { name, value } = e.target
        setGroupData({ ...groupData, [name]: value })
    }

    return (
        <div className="min-vh-100">
            <div className="container mt-5 mb-5">
                <div className="card card-body border-0 shadow ">
                    <div className="group__row">
                        <label className="group__group-id-label">Group ID</label>
                        <div className="col-lg-4 me-3 ">
                            <input
                                type="text"
                                className="form-control"
                                value={id}
                                disabled
                            />
                        </div>
                        <label className="group__created-label me-3 ">Created</label>
                        <div className="col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                value={groupData.createdAt}
                                disabled
                            />
                        </div>

                    </div>

                    <div className="group__row mt-3">
                        <label className="group__group-id-label">Group Name<span className="text-danger">*</span></label>
                        <div className="col-lg-6">
                            <input
                                type="text"
                                className="form-control"
                                value={groupData.name}
                                name="name"
                                onChange={onChangeInput}
                            />
                        </div>
                    </div>

                    <div className="group__row mt-3">
                        <label className="group__group-id-label">Description</label>
                        <textarea 
                            className="group__description-text-area col-lg-6"
                            value={groupData.description}
                            name="description"
                            onChange={onChangeInput}
                        ></textarea>
                    </div>

                    <div className="group__members">
                        <label>Members</label>
                    </div>

                    <div className="card card-body border-0 shadow table-wrapper table-responsive ">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Type</th>
                                    <th>Join Date</th>
                                </tr>
                            </thead>
                           
                        </table>
                        <div className="group-creating__user-table d-flex align-items-center justify-content-center">
                                <p>This group has no members</p>
                        </div>
                       
                    </div>
                        <div className="mt-3 text-end">
                                <button className="btn btn-outline-dark me-3" onClick={saveGroup}>Save</button>
                               
                        </div> 
                </div>
            </div>
        </div>

    )
}

export default AdminGroupCreating