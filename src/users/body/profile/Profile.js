import React, { useState } from 'react'
import '../profile/Profile.css'

function Profile() {

    const [tab, setActiveTab] = useState(1)

    const activeTab = (index) => {
        setActiveTab(index)
    }

    return (
        <div>
            <div className="container" style={{ width: 1000 }}>
                <div className="view-account">
                    <section className="module">
                        <div className="module-inner">
                            <div className="side-bar">
                                <div className="user-info">
                                    <img className="img-profile img-circle img-responsive center-block" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
                                </div>
                                <nav className="side-menu">
                                    <ul className="nav">
                                        <li><a className={tab === 0 ? "tabs active-tabs" : "tabs"} onClick={() => activeTab(0)}><span className="fa fa-user"></span> Profile</a></li>
                                        <li><a className={tab === 1 ? "tabs active-tabs" : "tabs"} onClick={() => activeTab(1)}><span className="fa fa-cog"></span> Settings</a></li>
                                    </ul>
                                </nav>  

                    
                            </div>
                            <div className="content-panel">
                                <form className="form-horizontal">
                                    <fieldset className="fieldset">
                                        <h2 className="fieldset-title">Information</h2>
                                        <div className="form-group">
                                            <label className="col-md-2 col-sm-3 col-xs-12 control-label fw-bold">Email</label>
                                            <div className="col-md-10 col-sm-9 col-xs-12">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="col-md-2 col-sm-3 col-xs-12 control-label fw-bold">First Name</label>
                                            <div className="col-md-10 col-sm-9 col-xs-12">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-2 col-sm-3 col-xs-12 control-label fw-bold">Last Name</label>
                                            <div className="col-md-10 col-sm-9 col-xs-12">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-md-10 col-sm-9 col-xs-12 col-md-push-2 col-sm-push-3 col-xs-push-0 mt-3">
                                            <input className="btn btn-primary" type="submit" value="Save" />
                                        </div>
                                    </fieldset>
                                    <fieldset className="fieldset">
                                        <h3 className="fieldset-title mt-5">Edit Password</h3>
                                        <div className="form-group">
                                            <label className="col-md-4 col-sm-3 col-xs-12 control-label fw-bold">Current Password</label>
                                            <div className="col-md-10 col-sm-9 col-xs-12">
                                                <input type="email" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-2  col-sm-3 col-xs-12 control-label mt-2 fw-bold">New Password</label>
                                            <div className="col-md-10 col-sm-9 col-xs-12">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-4  col-sm-3 col-xs-12 control-label mt-2 fw-bold">Comfirm PassWord</label>
                                            <div className="col-md-10 col-sm-9 col-xs-12">
                                                <input type="url" className="form-control" />
                                            </div>
                                        </div>
                                    </fieldset>
                                </form>

                                <div className="col-md-10 col-sm-9 col-xs-12 col-md-push-2 col-sm-push-3 col-xs-push-0 mt-3">
                                    <input className="btn btn-primary" type="submit" value="Save" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Profile
