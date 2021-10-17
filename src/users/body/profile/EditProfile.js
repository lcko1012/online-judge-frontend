import axios from 'axios'
import React, {useReducer, useContext} from 'react'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification'
import { isEmail, isEmpty, isLength, isMatch } from '../../../utils/validation/Validation'
import AuthContext from '../../../context/authentication/authContext'


function InforReducer(state, action) {
  switch (action.type) {
    case 'ON_CHANGE':
        return {...state, [action.payload.name]: action.payload.value}
    default:
      return state
  }
}

export function Editprofile() {
    const authContext = useContext(AuthContext)
    const {user, loadUser} = authContext
    const initialInfor = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: "",
        oldPassword: "",
        matchedPassword: ""
    }

    const [userInfor, dispatch] = useReducer(InforReducer, initialInfor)

    const submitPassword = async (e) => {
        e.preventDefault()
        try {
            const {password, oldPassword, matchedPassword} = userInfor
            if(isEmpty(password) || isEmpty(oldPassword) || isEmpty(matchedPassword)) return errorNotification("Please fill in all fields")
            if(isLength(password) || isLength(oldPassword) || isLength(matchedPassword)) return errorNotification("Password is greater than 6 and less than 32 characters")
            if(!isMatch(matchedPassword, password)) return errorNotification("Passwords do not match")
            

            const res = await axios.put("/api/user/update/password", {
                password: userInfor.password,
                matchedPassword: userInfor.matchedPassword,
                oldPassword: userInfor.oldPassword
            })

            if(res) {
                successNotification(res.data.message)
            }
        } catch (error) {
            errorNotification(error.response.data.message)
        }

    }

    const updateInfor = async (e) => {
        e.preventDefault()
        console.log("Update Information")

        try {
            const{email} = userInfor
            if(!email) return errorNotification("Please fill in email field")
            if(!isEmail(email)) return errorNotification("Please enter a valid email address!")

            const res = await axios.put("/api/user/update/information", {
                email: userInfor.email,
                firstName: userInfor.firstName,
                lastName: userInfor.lastName
            })

            if(res) {
                successNotification(res.data.message)
                loadUser()
            }
            
        } catch (error) {
            errorNotification(error.response.data.message)            
        }
    }

    const onChangeField = (event) => {
        dispatch({ type: "ON_CHANGE", payload: {
            name: event.target.name,
            value: event.target.value 
        }});
    };
    
    
    return (
        <>
            <div className="content-panel">
                <form className="form-horizontal" onSubmit={updateInfor}>
                    <fieldset className="fieldset">
                        <h2 className="fieldset-title">Information</h2>
                        <div className="ps-4"> 
                        <div className="form-group">
                            <label className="col-md-2 col-sm-3 col-xs-12 control-label fw-bold">Email<span className="text-danger">*</span></label>
                            <div className="col-md-10 col-sm-9 col-xs-12">
                                <input type="email" className="form-control" value={userInfor.email} name="email" onChange={onChangeField}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 col-sm-3 col-xs-12 control-label fw-bold">First Name</label>
                            <div className="col-md-10 col-sm-9 col-xs-12">
                                <input type="text" className="form-control"  value={userInfor.firstName} name="firstName" onChange={onChangeField} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-2 col-sm-3 col-xs-12 control-label fw-bold">Last Name</label>
                            <div className="col-md-10 col-sm-9 col-xs-12">
                                <input type="text" className="form-control"  value={userInfor.lastName} name="lastName" onChange={onChangeField} />
                            </div>
                        </div>

                        <div className="col-md-10 col-sm-9 col-xs-12 col-md-push-2 col-sm-push-3 col-xs-push-0 mt-3">
                            <input className="btn btn-dark" type="submit" value="Save" />
                        </div>
                        </div>
                    </fieldset>
                </form>

                <form onSubmit={submitPassword}>
                    <fieldset className="fieldset">
                            <h3 className="fieldset-title mt-5">Edit Password</h3>
                            <div className="ps-4"> 
                            <div className="form-group">
                                <label className="col-md-4 col-sm-3 col-xs-12 control-label fw-bold">Current Password<span className="text-danger">*</span></label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <input type="password" className="form-control" value={userInfor.oldPassword} name="oldPassword" onChange={onChangeField} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-3 col-xs-12 control-label mt-2 fw-bold">New Password<span className="text-danger">*</span></label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <input type="password" className="form-control" value={userInfor.password} name="password" onChange={onChangeField} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4  col-sm-3 col-xs-12 control-label mt-2 fw-bold">Comfirm Password<span className="text-danger">*</span></label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <input type="password" className="form-control" value={userInfor.matchedPassword} name="matchedPassword" onChange={onChangeField} />
                                </div>
                            </div>
                            <div className="col-md-10 col-sm-9 col-xs-12 col-md-push-2 col-sm-push-3 col-xs-push-0 mt-3">
                    <input className="btn btn-dark" type="submit" value="Save" />
                </div>
                            </div>
                        </fieldset>
                </form>

                
            </div>
        </>
    )
}
