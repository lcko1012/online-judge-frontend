import React, { useState, useContext, useEffect } from 'react'
import { Editprofile } from './EditProfile'
import './Profile.scss'
import AuthContext from '../../../context/authentication/authContext'
import { isImgFormat, isImgSize } from '../../../utils/validation/Validation'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification'
import { axiosInstance } from '../../../services/config'

function Profile() {
    const authContext = useContext(AuthContext)
    const { user } = authContext
    const [tab, setActiveTab] = useState(0)
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl)
    const [isUpdated, setIsUpdated] = useState(false)

    const activeTab = (index) => {
        setActiveTab(index)
    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
            if (!file) {
                return 
            }

            if (!isImgFormat(file)) return errorNotification("Wrong image format")

            if (!isImgSize(file)) return errorNotification("Image size is less than 2MB")

            var formImage = new FormData()
            formImage.append('file', file)

            const res = await axiosInstance.post("/api/upload_image", formImage)

            if (res) {
                setAvatarUrl(res.data.url)
                setIsUpdated(true)
            }
        } catch (error) {
            errorNotification(error.response.data.message)
        }
    }

    const updateAvatar = async () => {
        try {
            const res = await axiosInstance.put("/api/user/update/avatar", {
                avatarUrl: avatarUrl
            })
            successNotification(res.data.message)
            setIsUpdated(false)
        } catch (error) {
            errorNotification(error.response.data.message)
        }
    }

    return (
        <div className="background__color profile__container">
            <div className="container">
                <div className="view-account">
                    <section className="module">
                        <div className="module-inner">
                            <div className="side-bar">
                                <div className="user-info">
                                    <button className="btn btn-dark profile__save-img-btn p-1" 
                                    style={{visibility: !isUpdated ? 'hidden' : 'inherit'}}
                                    onClick={updateAvatar}
                                    >Save</button>
                                    <div className="profile__avatar">
                                        <img className="img-profile img-circle img-responsive center-block" src={avatarUrl} alt="" />

                                        <span>
                                            <i className="fas fa-camera"></i>
                                            <input type="file" name="file" id="file_up" onChange={(e) => handleChangeAvatar(e)} />
                                        </span>
                                    </div>
                                    <label>{user.username}</label>
                                </div>
                                <nav className="side-menu">
                                    <ul className="nav">
                                        <li className={tab === 0 ? "active" : null} onClick={() => activeTab(0)}><a className="cursor-pointer"><span className="fa fa-user"></span> Profile</a></li>
                                        <li className={tab === 1 ? "active" : null} onClick={() => activeTab(1)}><a className="cursor-pointer"><span className="fa fa-cog"></span> Settings</a></li>
                                    </ul>
                                </nav>
                            </div>
                            {tab === 0 ?
                                <div className="content-panel">
                                    <form className="form-horizontal">
                                        <fieldset className="fieldset">
                                            <h2 className="fieldset-title">Information</h2>
                                            <div className="ps-4">
                                                <div className="form-group row">
                                                    <label className="col-md-3 col-sm-3 col-xs-12 control-label fw-bold">Username</label>
                                                    <p className="col-md-8 col-sm-3 col-xs-12 control-label">{user.username}</p>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-3 col-sm-3 col-xs-12 control-label fw-bold">Email</label>
                                                    <p className="col-md-8 col-sm-3 col-xs-12 control-label">{user.email}</p>
                                                </div>

                                                <div className="form-group row">
                                                    <label className="col-md-3 col-sm-3 col-xs-12 control-label fw-bold">First Name</label>
                                                    <p className="col-md-8 col-sm-3 col-xs-12 control-label">{user.firstName ? user.firstName : ""}</p>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-3 col-sm-3 col-xs-12 control-label fw-bold">Last Name</label>
                                                    <p className="col-md-8 col-sm-3 col-xs-12 control-label">{user.lastName ? user.lastName : ""}</p>
                                                </div>
                                            </div>

                                        </fieldset>
                                    </form>
                                    <hr></hr>
                                    <div>
                                        <fieldset className="fieldset">
                                            <h3 className="fieldset-title mb-5 mt-2">My Group</h3>
                                            <div className="ps-4">
                                                <div className="profile__group-container">
                                                    <p>Class C++</p>
                                                    <p>Class abc</p>
                                                    <p>My Group 123</p>
                                                    <p>Class ITJP2</p>
                                                    <p>Class abc</p>
                                                    <p>My Group 123</p>
                                                    <p>Class ITJP2</p><p>Class abc</p>
                                                    <p>My Group 123</p>
                                                    <p>Class ITJP2</p>

                                                    <p>Class abc</p>
                                                    <p>My Group 123</p>
                                                    <p>Class ITJP2</p><p>Class abc</p>
                                                    <p>My Group 123</p>
                                                    <p>Class ITJP2</p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                : <Editprofile />
                            }
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Profile
