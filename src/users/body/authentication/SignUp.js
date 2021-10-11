import React from 'react'
import axios from 'axios';
import "./auth.css";
import { useState } from 'react'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { isEmail, isEmpty, isLength, isMatch } from '../../utils/validation/Validation'
import { GoogleLogin } from 'react-google-login'
import authApis from './enum/authentication-apis'

function SignUp() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        matchedPassword: '',
        err: '',
        success: ''
    })

    const { name, email, password, matchedPassword, err, success } = user

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (isEmpty(email) || isEmpty(password) || isEmpty(matchedPassword) || isEmpty(name)) {
            return setUser({ ...user, err: 'Hãy điền đầy đủ thông tin', success: '' })
        }

        if (!isEmail(email)) {
            return setUser({ ...user, err: 'Email không đúng định dạng', success: '' })
        }

        if (isLength(password)) {
            return setUser({ ...user, err: "Mật khẩu phải lớn hơn 6 ký tự", success: '' })
        }

        if (!isMatch(matchedPassword, password)) {
            return setUser({ ...user, err: "Mật khẩu không giống nhau", success: '' })
        }

        try {
            var registerForm = new FormData()
            registerForm.append('name', name)
            registerForm.append('email', email)
            registerForm.append('password', password)
            registerForm.append('matchedPassword', matchedPassword)

            const res = await axios.post(authApis.register, registerForm)
            if (res.status === 202) {
                setUser({ ...user, err: '', success: 'Kiểm tra email để kích hoạt tài khoản' })
            }
        } catch (err) {
            if (err.response.status === 423) {
                setUser({ ...user, err: ' Email đã đăng ký nhưng chưa kích hoạt', success: '' })
            }
            else if (err.response.status === 409) {
                setUser({ ...user, err: 'Email đã tồn tại', success: '' })
            }
            else if (err.response.status === 400) {
                setUser({ ...user, err: 'Thông tin không hợp lệ', success: '' })
            }
            else {
                setUser({ ...user, err: 'Đã có lỗi xảy ra', success: '' })
            }
        }
    }

    const responseGoogle = async (response) => {
        console.log(response)
        try {
            const google_token = response.tokenId
            var registerForm = new FormData()
            registerForm.append('google_token', google_token)

            const res = await axios.post(authApis.registerByGoogle, registerForm)
            setUser({ ...user, err: '', success: 'Mật khẩu đã được gửi tới gmail của bạn' })
        } catch (err) {
            if (err.response.status === 401) {
                setUser({ ...user, err: 'Sai email hoặc password', success: '' })
            }
            else if (err.response.status === 400) {
                setUser({ ...user, err: 'Email hoặc password không hợp lệ', success: '' })
            }
            else {
                setUser({ ...user, err: 'Đã có lỗi xảy ra', success: '' })
            }
        }

    }
    return (

        <>
            <section class="vh-100 Signup-bg-image" >
                <div class="mask d-flex align-items-center h-100 Signup-gradient-custom-3">
                    <div class="container h-100">
                        <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                                <div class="card Signup-bogoc" >
                                    <div class="card-body p-3">
                                        <h2 class="text-uppercase text-center mb-4">Create an account</h2>

                                        <form onSubmit={handleSubmit}>

                                            <div class="form-outline mb-3">
                                                <input type="text" id="form3Example1cg" class="form-control form-control-lg" onChange={handleChangeInput} />
                                                <label class="form-label" for="form3Example1cg">Your Name</label>
                                            </div>

                                            <div class="form-outline mb-3">
                                                <input type="email" id="form3Example3cg" class="form-control form-control-lg" onChange={handleChangeInput} />
                                                <label class="form-label" for="form3Example3cg">Your Email</label>
                                            </div>

                                            <div class="form-outline mb-3">
                                                <input type="password" id="form3Example4cg" class="form-control form-control-lg" onChange={handleChangeInput} />
                                                <label class="form-label" for="form3Example4cg">Password</label>
                                            </div>

                                            <div class="form-outline mb-3">
                                                <input type="password" id="form3Example4cdg" class="form-control form-control-lg" onChange={handleChangeInput} />
                                                <label class="form-label" for="form3Example4cdg">Repeat your password</label>
                                            </div>
                                            <div class="d-flex justify-content-center">
                                                <button type="submit" class="btn btn-success btn-block btn-lg Signup-gradient-custom-4 text-body" >Register</button>
                                            </div>

                                            <p class="text-center text-muted mt-5 mb-0">Have already an account?<a href="./SignIn" class="fw-bold text-body"><u>Login here</u></a></p>

                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SignUp
// class SignUp extends React.Component {
//     state = {
//         Yourname: "",
//         Youremai: "",
//         Yourpassword: "",
//         Yourpasswordrepeat: ""
//     }
//     handleOnChangeName = (event) => {
//         this.setState({
//             Yourname: event.target.value
//         })

//     }
//     handleOnChangeEmail = (event) => {
//         this.setState({
//             Youremai: event.target.value
//         })
//         console.log(Object.keys(this.state).length)
//     }
//     handleOnChangePassword = (event) => {
//         this.setState({
//             Yourpassword: event.target.value
//         })
//     }
//     handleOnChangePasswordRepeat = (event) => {
//         this.setState({
//             Yourpasswordrepeat: event.target.value
//         })
//     }
//     // submitForm = () => {
//     //     console.log(this.state)

//     // }
//     submitForm = async (e) => {
//         // e.preventDefault()
//         // if (isEmpty(username) || isEmpty(password)) return errorNotification("Please fill all fields")
//         // if (isLength(password)) return errorNotification("Password is greater than 6 and less than 32 characters")

//         // console.log(username, password)

//         try {
//             const res = await axios.post("./SignIn", {
//                 Yourname: this.state.Yourname,
//                 Youremail: this.state.Youremai
//             })

//             console.log(res.data)
//         } catch (err) {
//             // errorNotification(err.response.data.message)
//             console.log("ngu ghe")
//         }

//     }
//     render() {
//         return (
//             <>
//                 <section class="vh-100 Signup-bg-image" >
//                     <div class="mask d-flex align-items-center h-100 Signup-gradient-custom-3">
//                         <div class="container h-100">
//                             <div class="row d-flex justify-content-center align-items-center h-100">
//                                 <div class="col-12 col-md-9 col-lg-7 col-xl-6">
//                                     <div class="card Signup-bogoc" >
//                                         <div class="card-body p-3">
//                                             <h2 class="text-uppercase text-center mb-4">Create an account</h2>

//                                             <form onSubmit={() => this.submitForm()}>

//                                                 <div class="form-outline mb-3">
//                                                     <input type="text" id="form3Example1cg" value={this.state.Yourname} onChange={(event) => this.handleOnChangeName(event)} class="form-control form-control-lg" />
//                                                     <label class="form-label" for="form3Example1cg">Your Name</label>
//                                                 </div>

//                                                 <div class="form-outline mb-3">
//                                                     <input type="email" id="form3Example3cg" value={this.state.Youremai} onChange={(event) => this.handleOnChangeEmail(event)} class="form-control form-control-lg" />
//                                                     <label class="form-label" for="form3Example3cg">Your Email</label>
//                                                 </div>

//                                                 <div class="form-outline mb-3">
//                                                     <input type="password" id="form3Example4cg" value={this.state.Yourpassword} onChange={(event) => this.handleOnChangePassword(event)} class="form-control form-control-lg" />
//                                                     <label class="form-label" for="form3Example4cg">Password</label>
//                                                 </div>

//                                                 <div class="form-outline mb-3">
//                                                     <input type="password" id="form3Example4cdg" value={this.state.Yourpasswordrepeat} onChange={(event) => this.handleOnChangePasswordRepeat(event)} class="form-control form-control-lg" />
//                                                     <label class="form-label" for="form3Example4cdg">Repeat your password</label>
//                                                 </div>
//                                                 <div class="d-flex justify-content-center">
//                                                     <button type="submit" class="btn btn-success btn-block btn-lg Signup-gradient-custom-4 text-body" >Register</button>
//                                                 </div>

//                                                 <p class="text-center text-muted mt-5 mb-0">Have already an account?<a href="./SignIn" class="fw-bold text-body"><u>Login here</u></a></p>

//                                             </form>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </>
//         )
//     }
// }
// export default SignUp;
