import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification'

function ForgotPassword() {
	const [dataForm, setDataForm] = useState({email: "", username: ""})
	const {email, username} = dataForm

	const submitForm = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post("/api/auth/forgot", {
				email,
				username
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
									<div className="mb-2 mt-md-0">
										<h1 className="mb-2 h3">Forgot your password?</h1>
										<p>Just type in your email and we will send you a code to reset your password!</p>
									</div>

									<form onSubmit={submitForm}>
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
													placeholder="naruto"
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
													placeholder="naruto@gmail.com"
													required
													name="email"
													value={email}
													onChange={onChangeInput}
												/>
											</div>
										</div>

										<div className="d-grid">
											<button type="submit" className="btn btn-dark">Recover password</button>
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

export default ForgotPassword
