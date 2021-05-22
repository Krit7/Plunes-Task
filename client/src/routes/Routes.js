import React from 'react';
import { Route } from 'react-router-dom';

//COMPONENTS
import LandingPage from '../Components/LandingPage/LandingPage';
import Dashboard from '../Components/Dashboard/Dashboard'

const Routes = () => {
    return (
        <div>
            <Route path="/" component={LandingPage} exact />
            <Route path="/user/auth/signUp" component={LandingPage} exact />
            <Route path="/user/auth/sendResetLink" component={LandingPage} exact />
            <Route path="/user/auth/resetPassword/:id/:token" component={LandingPage} exact />
            <Route path="/dashboard" component={Dashboard} exact />
        </div>
    )
}


export default Routes

