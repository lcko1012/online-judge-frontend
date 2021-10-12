import React, {useContext} from 'react'
import {Route, Switch} from 'react-router-dom'
import UserLayout from '../layouts/UserLayout'
import ForgotPassword from '../users/body/authentication/ForgotPassword'
import SignIn from '../users/body/authentication/SignIn'
import SignUp from '../users/body/authentication/SignUp'
import SignUpActivation from '../users/body/authentication/SignUpActivation'
import Home from '../users/body/home/Home'
import Profile from '../users/body/profile/Profile'
import AuthContext from '../context/authentication/authContext'


const AppRoute = ({ component: Component, layout: Layout, ...rest }) => {
    return (
        <Route {...rest} render={
            props => (
                <Layout>
                    <Component {...props} />
                </Layout>
            )
        } />
    )
}
console.log("index routes")

export default () => {
    const authContext = useContext(AuthContext)
    const {isAuthenticated} = authContext
    return (
        <Switch>            
            <AppRoute exact path="/"  component={Home} layout={UserLayout}/>
            <AppRoute exact path="/signup" component={isAuthenticated ? Home : SignUp} layout={UserLayout} />
            <AppRoute exact path="/signin" component={isAuthenticated ? Home : SignIn} layout={UserLayout} />
            <AppRoute exact path="/profile" component={isAuthenticated ? Profile : SignIn} layout={UserLayout} />
            <AppRoute exact path="/forgot_password" component={ForgotPassword} layout={UserLayout} />
            <AppRoute exact path="/user/activate/:activationToken" component={SignUpActivation} layout={UserLayout} />

        </Switch>
    )
}