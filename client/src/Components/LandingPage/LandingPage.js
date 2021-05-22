import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'


import LandingPageBg from '../../assets/images/Face.jpg'

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgetLink from './ForgetLink'
import ResetForm from './ResetForm'

const wrapper = {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

}

const formHolder = {
    margin: '5em 0',
    width: '700px'
}


const LandingPage = () => {

    const [token, setToken] = useState()
    // const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const location = useLocation().pathname
    useEffect(() => {
        setToken(localStorage.getItem('token'))
        if (token != null) {
            window.location.href = '/dashboard'
        }
    }, [token])

    const renderForm = () => {
        if (location === '/user/auth/signUp') {
            console.log(location)
            return <SignUpForm />
        }
        else if (location === '/user/auth/sendResetLink') {
            return <ForgetLink />
        }
        else if (location === '/') {
            return <LoginForm />
        } else {
            return <ResetForm />
        }
    }
    return (
        <div style={wrapper}>
            <div style={formHolder}>
                {renderForm()}
            </div>
        </div>
    );
}

export default LandingPage;