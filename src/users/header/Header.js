import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/authentication/authContext'
import "./header.scss"

function Header() {
  const authContext = useContext(AuthContext)
  const {  user, logout } = authContext
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
      <div className="container-fluid container">
        <img className="header__logo-img" src="https://res.cloudinary.com/dgp6k8yir/image/upload/v1635686282/avatar/ezhl0mkkxn7oawpgdz9j.png"/>
        <Link className="navbar-brand" to="/">OnlineJudge</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">


          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex">
            <li className="nav-item me-3">
              <a className="nav-link" href="#">Contest</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link" href="#">Problem</a>
            </li>

            {
              user ?
                <>
                  <li className="nav-item me-3">
                    <a className="nav-link " href="#">Submission</a>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {user ? user.username : null}
                    </a>
                    <ul className="dropdown-menu header__drop-box" aria-labelledby="navbarDropdown">
                      {user.role === "Regular User" ? null :
                      <li><Link className="dropdown-item" to="/admin/home">Admin page</Link></li>
                      }
                      <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><p className="pe-auto dropdown-item mb-0 cursor-pointer" onClick={logout}>Log out</p></li>
                    </ul>
                  </li>
                </>
                :
                <li className="nav-item">
                  <Link className="nav-link" to='/signin'>Sign in</Link>
                </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
