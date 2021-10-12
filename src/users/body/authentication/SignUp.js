import React, { useState } from 'react'
import axios from 'axios';
import "./auth.scss";
import { successNotification, errorNotification } from '../../../utils/notification/ToastNotification'
import {isMatch, isLength} from '../../../utils/validation/Validation'
import { Link } from 'react-router-dom';

function SignUp() {
  const [dataForm, setDataForm] = useState({
    username: '',
    email: '',
    password: '',
    matchedPassword: '',
  })

  const { username, email, password, matchedPassword } = dataForm

  const onChangeInput = e => {
    const { name, value } = e.target
    setDataForm({ ...dataForm, [name]: value })
  }

  const submitForm = async e => {
    e.preventDefault()

    if (isLength(password)) {
        return errorNotification("Password is greater than 6 and less than 32 characters")
    }

    if (!isMatch(matchedPassword, password)) {
        return errorNotification("Passwords do not match")
    }

    try {
      const res = await axios.post("/api/auth/register", {
        username: username,
        email: email,
        password: password,
        matchedPassword: matchedPassword
      })
      if (res) {
        successNotification(res.data.message)
      }
    } catch (err) {
      errorNotification(err.response.data.message)
    }
  }

  return (
    <section className="bg-image gradient-custom-2 background__color">
      <div className="mask d-flex align-items-center h-100">
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card signin__form mt-5 mb-5">
                <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100  fmxw-500">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h1 className="mb-0 h3">Create Account</h1>
                  </div>

                  <form className="mt-4" onSubmit={submitForm}>
                    <div className="form-group mb-4">
                      <label>Your Username</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fas fa-user"></i>
                          <svg className="icon icon-xs text-gray-600" viewBox="0 0 20 20"></svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          required
                          name="username"
                          value={username}
                          onChange={onChangeInput}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label>Your Email</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fas fa-envelope"></i>
                          <svg className="icon icon-xs text-gray-600" viewBox="0 0 20 20"></svg>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Username"
                          required
                          name="email"
                          value={email}
                          onChange={onChangeInput}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label>Your Password</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon2">
                          <i className="fas fa-lock"></i>
                          <svg className="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20" ></svg>
                        </span>
                        <input
                          type="password"
                          placeholder="Password"
                          className="form-control"
                          required
                          name="password"
                          value={password}
                          onChange={onChangeInput}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label>Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon2">
                          <i className="fas fa-lock"></i>
                          <svg className="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20" ></svg>
                        </span>
                        <input
                          type="password"
                          placeholder="Password"
                          className="form-control"
                          required
                          name="matchedPassword"
                          value={matchedPassword}
                          onChange={onChangeInput}
                        />
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-dark">Sign up</button>
                    </div>
                  </form>

                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Already have an account? <Link to="/signin" className="fw-bold text-dark">Login here</Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp
