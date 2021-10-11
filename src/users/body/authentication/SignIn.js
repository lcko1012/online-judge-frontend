import React from 'react'

function SignIn() {

    return (
        <div>
            SignIn
        </div>
    )
}

export default SignIn
// import React, { useContext, useState } from 'react'
// import { Link, useHistory } from 'react-router-dom'
// import "./auth.css"
// import { isEmpty, isLength } from '../../../utils/validation/Validation'
// import { errorNotification } from '../../../utils/notification/ToastNotification'
// import axios from 'axios'

// const initialState = {
//     username: "",
//     password: "",
// }

// function SignIn() {

//     const [dataForm, setDataForm] = useState(initialState)
//     const { username, password } = dataForm

//     const onChangeInput = e => {
//         const { name, value } = e.target
//         setDataForm({ ...dataForm, [name]: value })
//     }

//     const submitForm = async (e) => {
//         e.preventDefault()
//         if (isEmpty(username) || isEmpty(password)) return errorNotification("Please fill all fields")
//         if (isLength(password)) return errorNotification("Password is greater than 6 and less than 32 characters")

//         console.log(username, password)

//         try {
//             const res = await axios.post("http://localhost:8080/api/auth/login", {
//                 username: username,
//                 password: password
//             })

//             console.log(res.data)
//         } catch (err) {
//             errorNotification(err.response.data.message)
//         }

//     }
//     return (
//         <section className="vh-100 bg-image gradient-custom-2">
//             <div className="mask d-flex align-items-center h-100 gradient-custom-3">
//                 <div className="container h-100">
//                     <div className="row d-flex justify-content-center align-items-center h-100">
//                         <div className="col-12 col-md-9 col-lg-7 col-xl-6">
//                             <div className="card signin__form" style={{ borderRadius: '15px' }}>
//                                 <div className="card-body py-5">
//                                     <h2 className="text-uppercase text-center mb-5">Sign In</h2>
//                                     <form
//                                         className="ms-5 me-5"
//                                         onSubmit={submitForm}
//                                     >
//                                         <div className="form-outline mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control form-control-lg"
//                                                 value={username}
//                                                 name="username"
//                                                 onChange={onChangeInput}
//                                             />

//                                             <label className="form-label">
//                                                 Username
//                                             </label>
//                                         </div>
//                                         <div className="form-outline mb-2">
//                                             <input
//                                                 type="password"
//                                                 className="form-control form-control-lg"
//                                                 value={password}
//                                                 name="password"
//                                                 onChange={onChangeInput}
//                                             />

//                                             <label className="form-label">
//                                                 Password
//                                             </label>
//                                         </div>
//                                         <div className="d-flex justify-content-center">
//                                             <button
//                                                 type="submit"
//                                                 className="btn btn-success btn-block btn-lg gradient-custom-2"
//                                             >
//                                                 Sign in
//                                             </button>
//                                         </div>
//                                         <p className="text-center text-muted mt-4 mb-0">Don't have an account yet? <Link to="/signup" className="fw-bold text-body"><u>Sign up here</u></Link></p>
//                                         <p className="text-center text-muted mb-0"><Link to="/signup" className="text-body"><u>Forgot Password</u></Link></p>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default SignIn
