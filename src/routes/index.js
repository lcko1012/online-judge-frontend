import React from 'react'
import {Route, Switch} from 'react-router-dom'
import UserLayout from '../layouts/UserLayout'
import SignIn from '../users/body/authentication/SignIn'
import SignUp from '../users/body/authentication/SignUp'
import Home from '../users/body/home/Home'
import Profile from '../users/body/profile/Profile'


const AppRoute = ({component: Component, layout: Layout, ...rest}) => {
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
    return (
        <Switch>
            <AppRoute exact path="/"  component={Home} layout={UserLayout}/>
            <AppRoute exact path="/signup" component={SignUp} layout={UserLayout} />
            <AppRoute exact path="/signin" component={SignIn} layout={UserLayout} />
            <AppRoute exact path="/profile" component={Profile} layout={UserLayout} />
        </Switch>
    )
}