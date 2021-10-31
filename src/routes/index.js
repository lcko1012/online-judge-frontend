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
import AdminHome from '../admin/body/home/AdminHome'
import AdminPost from '../admin/body/post/AdminPost'
import AdminPostDetail from '../admin/body/post/AdminPostDetail'
import AdminLayout from '../layouts/AdminLayout'
import _403 from '../utils/page/_403'
import ResetPassword from '../users/body/authentication/ResetPassword'
import AdminPostCreating from '../admin/body/post/AdminPostCreating'
import AdminGroup from '../admin/body/group/AdminGroup'
import AdminGroupDetail from '../admin/body/group/AdminGroupDetail'


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

export default () => {
    const authContext = useContext(AuthContext)
    const {isAuthenticated, user} = authContext
    const role = user ? user.role :  "Regular User"

    const checkRole = () => {
        return role === 'Admin' || role === 'Teacher' ? true : false
    }

    return (
        <Switch>            
            <AppRoute exact path="/"  component={Home} layout={UserLayout}/>
            <AppRoute exact path="/signup" component={isAuthenticated ? Home : SignUp} layout={UserLayout} />
            <AppRoute exact path="/signin" component={isAuthenticated ? Home : SignIn} layout={UserLayout} />
            <AppRoute exact path="/profile" component={user ? Profile : SignIn} layout={UserLayout} />
            <AppRoute exact path="/forgot_password" component={ForgotPassword} layout={UserLayout} />
            <AppRoute exact path="/reset_password/:accessToken" component={ResetPassword} layout={UserLayout} />
            <AppRoute exact path="/user/activate/:activationToken" component={SignUpActivation} layout={UserLayout} />

            <AppRoute exact path="/admin/home" component={checkRole() ? AdminHome: _403 } layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/post" component={checkRole() ? AdminPost : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/post/new" component={checkRole() ? AdminPostCreating : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/post/:id/detail" component={checkRole() ? AdminPostDetail : _403} layout={checkRole() ? AdminLayout : UserLayout} />

            <AppRoute exact path="/admin/group" component={checkRole() ? AdminGroup : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/group/new" component={checkRole() ? AdminGroup : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/group/:id/detail" component={checkRole() ? AdminGroupDetail : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/groupTest" component={AdminGroupDetail} layout={AdminLayout}/>

        </Switch>
    )
}