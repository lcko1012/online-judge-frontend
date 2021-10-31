import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification';
import AuthContext from '../../../context/authentication/authContext'
import './adminGroup.scss'
import { isEmpty } from '../../../utils/validation/Validation';

function AdminGroupDetail() {
    const { id } = useParams()
    const history = useHistory()
    const [groupData, setGroupData] = useState({
        id: "",
        name: "",
        description: "",
        delFlag: false,
        users: [],
        createdAt: "",
    })
    const [userList, setUserList] = useState([])

    const authContext = useContext(AuthContext)
    const { user } = authContext

    const checkRole = () => {
        return user.role === 'Admin' ? 'admin' : 'teacher'
    }

    useEffect(() => {
        const getGroup = async () => {
            try {
                const res = await axios.get(`/api/group/${id}`)
                setGroupData(res.data)
            } catch (error) {
                console.log(error)
            }
        }

        const getUserList = async () => {
            try {
                const res = await axios.get(`/api/group/${id}/get_users`)
                setUserList(res.data.users)
            } catch (error) {
                
            }
        }
        getGroup()
        getUserList()
    }, [])

    const deleteGroup = async () => {
        try {
            const res = await axios.delete(`/api/group/${checkRole()}/${id}`)
            successNotification(res.data.message)
            history.push("/admin/group")
        } catch (error) {
            console.log(error)
        }
    }

    const saveGroup = async () => {
        if(isEmpty(groupData.name)) return errorNotification("Please fill in the name field")
        try {
            const res = await axios.put(`/api/group/${checkRole()}/${id}`, {
                name: groupData.name,
                description: groupData.description
            })
            successNotification(res.data.message)
            history.push("/admin/group")
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const checkOwner = () => {
        return  groupData.users.length > 0 ? groupData.users[0].username === user.username : null
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
                                value={new Date(groupData.createdAt).toLocaleDateString()}
                                disabled
                            />
                        </div>

                    </div>

                    <div className="group__row mt-3">
                        <label className="group__group-id-label">Group Name</label>
                        <div className="col-lg-6">
                            <input
                                type="text"
                                className="form-control"
                                value={groupData.name}
                                name="name"
                                onChange={checkOwner() ? onChangeInput : null}
                            />
                        </div>
                    </div>

                    <div className="group__row mt-3">
                        <label className="group__group-id-label">Description</label>
                        <textarea 
                            className="group__description-text-area col-lg-6"
                            value={groupData.description}
                            name="description"
                            onChange={checkOwner() ? onChangeInput : null}
                        ></textarea>
                    </div>

                    <div className="group__members">
                        <label>Members</label>
                        <div className="d-flex">
                            <span className="search-members-span">Search Members:</span>
                            <div className="input-group me-2 me-lg-3 ">
                                <span className="input-group-text">
                                    <i className="fal fa-search"></i>
                                </span>
                                <form>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type something"
                                    />
                                </form>
                            </div>
                        </div>


                    </div>

                    <div className="card card-body border-0 shadow table-wrapper table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Type</th>
                                    <th>Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map(user =>
                                    <tr>
                                    <td>1</td>
                                    <td>{user.username}</td>
                                    <td>{user.group_user.type}</td>
                                    <td>31 Oct 2021</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="card-footer px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination mb-0">
                                    <li className="page-item">
                                        <button
                                            className="page-link"
                                            onClick
                                            disabled
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    <li className="page-item">
                                        <button className="page-link">1</button>
                                    </li>
                                    <li className="page-item">
                                        <button
                                            className="page-link"
                                            onClick
                                            disabled
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div>
                        </div>
                    </div>
                    {
                        user.role === 'Admin' || checkOwner() ? 
                        <div className="mt-3 text-end">
                                <button className="btn btn-outline-danger me-3" onClick={deleteGroup}>Delete</button>
                                <button className="btn btn-outline-dark" onClick={saveGroup}>Save</button>
                        </div> :
                       null
                    }
                </div>
            </div>
        </div>

    )
}

export default AdminGroupDetail
