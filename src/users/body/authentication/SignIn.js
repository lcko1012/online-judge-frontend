import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import "./auth.scss"
import AuthContext from '../../../context/authentication/authContext'
import CookiesService from '../../../services/CookiesService'
import { isEmpty, isLength } from '../../../utils/validation/Validation'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import axios from 'axios'

const initialState = {
  username: "",
  password: "",
}

function SignIn() {

  const [dataForm, setDataForm] = useState(initialState)
  const { username, password } = dataForm
  const authContext = useContext(AuthContext)
  const cookiesService = CookiesService.getService()
  const history = useHistory()

  const onChangeInput = e => {
    const { name, value } = e.target
    setDataForm({ ...dataForm, [name]: value })
  }

  const submitForm = async (e) => {
    e.preventDefault()

    if (isEmpty(username) || isEmpty(password)) return errorNotification("Please fill all fields")
    if (isLength(password)) return errorNotification("Password is greater than 6 and less than 32 characters")

    try {
      const res = await axios.post("/api/auth/login", {
        username: username,
        password: password
      })

      cookiesService.setToken(res.data.accessToken)
      authContext.login()
      history.push("/")

    } catch (err) {
        errorNotification(err.response.data.message)
    }
  }
  return (
    <section className="vh-100 bg-image gradient-custom-2 background__color">
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card signin__form">
                <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100  fmxw-500">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h1 className="mb-0 h3">Sign in to OnlineJudge</h1>
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
                          autofocus 
                          required 
                          name="username"
                          value={username}
                          onChange={onChangeInput}  
                        />
                      </div>
                    </div>

                    <div className="form-group">
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
      
                      <div className="d-flex justify-content-between align-items-top mb-4">
                        <div><Link to="/forgot_password" className="small text-right text-dark ">Lost password?</Link></div>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-dark">Sign in</button>
                    </div>
                  </form>

                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Not registered? <Link to="/signup" className="fw-bold text-dark">Create account</Link>
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

export default SignIn
