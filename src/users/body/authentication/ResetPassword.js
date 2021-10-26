import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification'
import { isEmpty, isLength, isMatch } from '../../../utils/validation/Validation'

function ResetPassword() {
  const { accessToken } = useParams()
  const [dataForm, setDataForm] = useState(
    {
      password: "",
      matchedPassword: ""
    })

  const { password, matchedPassword } = dataForm

  const submitForm = async (e) => {
    e.preventDefault()
    if(isEmpty(password) || isEmpty(matchedPassword)) return errorNotification("Please fill in all fields")
    if(!isMatch(password, matchedPassword)) return errorNotification("Passwords do not match")
    if(isLength(password) || isLength(matchedPassword)) return errorNotification("Password is greater than 6 and less than 32 characters")

    try {
      const res = await axios.post("/api/auth/reset", {
        password,
        matchedPassword
      }, 
      {
        headers: {
          "Authorization": accessToken
        }
      })
      successNotification(res.data.message)
    } catch (error) {
      errorNotification(error.response.data.message)
    }
  }

  const onChangeInput = e => {
    const { name, value } = e.target
    setDataForm({ ...dataForm, [name]: value })
  }


  return (
    <section className="vh-100 bg-image gradient-custom-2 background__color">
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card signin__form">
                <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100  fmxw-500">
                  <div className="mb-4 mt-md-0">
                    <h1 className="mb-2 h3">Reset password</h1>
                  </div>

                  <form onSubmit={submitForm}>
                    <div className="form-group mb-4">
                      <label>Password</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fas fa-envelope"></i>
                          <svg className="icon icon-xs text-gray-600" viewBox="0 0 20 20"></svg>
                        </span>
                        <input
                          type="password"
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
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fas fa-envelope"></i>
                          <svg className="icon icon-xs text-gray-600" viewBox="0 0 20 20"></svg>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          required
                          name="matchedPassword"
                          value={matchedPassword}
                          onChange={onChangeInput}
                        />
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-dark">Reset password</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword
