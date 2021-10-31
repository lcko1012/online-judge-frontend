import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router'
import './adminGroup.scss'

function AdminGroupDetail() {

    const { id } = useParams()
    const history = useHistory()
    const [groupData, setGroupData] = useState({
        username: "",
        type: "",
        joinDate: '' 
    })

    return (
        <div className="adminGroupDetail">
            <div className="groupInfo">
                <div className="groupId_CreatedContainer">
                    <div className="groupID">
                        <label className="groupLabelID">Group ID</label>
                        <input className="groupInputID" type="text" disabled />
                    </div>

                    <div className="groupCreated">
                        <label className="groupCreatedLabel">Created</label>
                        <input type="text" className="groupCreatedInput" disabled />
                    </div>
                </div>

                <div className="groupName">
                    <label className="groupNameLabel">Group Name</label>
                    <input type="text" className="groupNameInput" />
                </div>

                <div className="groupDes">
                    <label className="groupDesLabel">Description</label>
                    <textarea className="groupDesTextarea"></textarea>
                </div>

                <div className="members">
                    <label className="membersLabel">Members</label>
                    <div className="">
                        <div className="container mt-5 mb-5">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fal fa-search"></i>
                                        </span>
                                        <form onSubmit>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Member's name"
                                                name="searchText"
                                                onChange
                                            />
                                        </form>
                                    </div>
                                </div>


                            </div>
                            <div className="card card-body border-0 shadow table-wrapper table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Type</th>
                                            <th>Join Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Admin</td>
                                            <td>Admin</td>
                                            <td>20 Oct 2021</td>
                                        </tr>
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
                                                <button className="page-link"></button>
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

                            <div className="buttonAction">
                                <button className="btnDelete btn btn-outline-danger" >Delete</button>
                                <button className="btnSave btn btn-outline-success">Save</button>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                {/*  */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default AdminGroupDetail
