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
import AdminGroupCreating from '../admin/body/group/AdminGroupCreating'
import AdminProblem from '../admin/body/problem/AdminProblem'
import AdminProblemCreating from '../admin/body/problem/AdminProblemCreating'
import AdminProblemDetail from '../admin/body/problem/AdminProblemDetail'
import Submission from '../users/body/submission/Submission'
import Problem from '../users/body/problem/Problem'
import ProblemDetail from '../users/body/problem/ProblemDetail'
import SubmissionDetail from '../users/body/submission/SubmissionDetail'
import AdminSubmission from '../admin/body/submission/AdminSubmission'
import AdminSubmissionDetail from '../admin/body/submission/AdminSubmissionDetail'
import AdminUser from '../admin/body/user/AdminUser'


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

            <AppRoute exact path="/submission" component={Submission} layout={UserLayout} />
            <AppRoute exact path="/submission/:id/detail" component={SubmissionDetail} layout={UserLayout} />
            <AppRoute exact path="/problem" component={Problem} layout={UserLayout} />
            <AppRoute exact path="/problem/:id/detail" component={ProblemDetail} layout={UserLayout} />


            <AppRoute exact path="/admin/home" component={checkRole() ? AdminHome: _403 } layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/post" component={checkRole() ? AdminPost : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/post/new" component={checkRole() ? AdminPostCreating : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/post/:id/detail" component={checkRole() ? AdminPostDetail : _403} layout={checkRole() ? AdminLayout : UserLayout} />

            <AppRoute exact path="/admin/group" component={checkRole() ? AdminGroup : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/group/new" component={checkRole() ? AdminGroupCreating : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/group/:id/detail" component={checkRole() ? AdminGroupDetail : _403} layout={checkRole() ? AdminLayout : UserLayout} />

            <AppRoute exact path="/admin/problem" component={checkRole() ? AdminProblem : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/problem/new" component={checkRole() ? AdminProblemCreating : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            <AppRoute exact path="/admin/problem/:id/detail" component={checkRole() ? AdminProblemCreating : _403} layout={checkRole() ? AdminLayout : UserLayout} />

            <AppRoute exact path="/admin/submission" component={checkRole() ? AdminSubmission : _403} layout={checkRole() ? AdminLayout : UserLayout} />
            {/* <AppRoute exact path="/admin/problem/new" component={checkRole() ? AdminProblemCreating : _403} layout={checkRole() ? AdminLayout : UserLayout} /> */}
            <AppRoute exact path="/admin/submission/:id/detail" component={checkRole() ? AdminSubmissionDetail : _403} layout={checkRole() ? AdminLayout : UserLayout} />

            <AppRoute exact path="/admin/user/" component={checkRole() ? AdminUser : _403} layout={checkRole() ? AdminLayout : UserLayout} />
        </Switch>
    )
}