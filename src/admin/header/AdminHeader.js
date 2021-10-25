import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/authentication/authContext'

function AdminHeader() {
    const authContext = useContext(AuthContext)
    const { isAuthenticated, user, logout } = authContext
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
            <div className="container-fluid container">
                <img className="header__logo-img" src="http://1509.ddns.net:8080/static/media/Logo_dhbkdn.bccf89bd.jpg" />
                {/* <Link className="navbar-brand" to="/">OnlineJudge</Link> */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item ms-3 me-3">
                            <Link className="nav-link" to="/admin/post">Post</Link>
                        </li>
                        <li className="nav-item me-3">
                            <a className="nav-link" href="#">User</a>
                        </li>
                        <li className="nav-item me-3">
                            <a className="nav-link" href="#">Group</a>
                        </li>
                        <li className="nav-item me-3">
                            <a className="nav-link" href="#">Problem</a>
                        </li>
                        <li className="nav-item me-3">
                            <a className="nav-link" href="#">Contest</a>
                        </li>
                        <li className="nav-item me-3">
                            <a className="nav-link" href="#">Submission</a>
                        </li>

                    </ul>
                    <ul className="navbar-nav mb-2 mb-lg-0 d-flex">

                        <li className="nav-item me-3">
                            <a className="nav-link" href="#">Hello {user ? user.username : ""}</a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><i className="fas fa-home"></i> Home</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AdminHeader
