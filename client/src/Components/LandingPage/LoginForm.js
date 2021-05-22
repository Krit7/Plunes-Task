import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BASE_URL } from '../../config/serverUrl'
import './form.css'


const LoginForm = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')

    useEffect(() => {
        setTimeout(() => {
            setOpen(false)
        }, 1500)
    }, [open])
    const emailChangeHandler = event => {
        setEmail(event.target.value)
    }

    const passwordChangeHandler = event => {
        setPassword(event.target.value)
    }

    const onLoginHandler = event => {
        event.preventDefault()
        if (email !== '' && password !== '') {
            const userObject = {
                email: email,
                password: password
            };
            axios.post(`${BASE_URL}user/auth/login`, userObject)
                .then(res => {
                    localStorage.setItem('token', res.data.token)
                    window.location.href = '/dashboard'
                    setEmail('')
                    setPassword('')
                }).catch(err => {
                    if (err.response) {
                        setMessage(err.response.data.msg)
                        setOpen(true);
                    } else if (err.request) {
                        console.log(err.request)
                    } else {
                        console.log(err)
                    }
                })
        } else {
            setMessage('Please Enter Email Id and Password!')
            setOpen(true);
        }
    }
    const displayMessage = () => {
        if (open === true) {
            return <div className='error'>
                {message}
            </div>
        }
    }

    const resetPasswordHandler = () => {
        window.location.href = '/user/auth/sendResetLink'
    }
    const signUpHandler = () => {
        window.location.href = '/user/auth/signUp'
    }

    return (
        <div className='formWrapper'>
            <div className='form'>
                <p className='formTitle'>User Login</p>
                <input type='text' placeholder='Email' value={email} className='input' onChange={emailChangeHandler}></input>
                <input type='password' placeholder='Password' value={password} className='input' onChange={passwordChangeHandler}></input>
                {displayMessage()}
                <div className='formButtons'>
                    <button className='formButton' onClick={onLoginHandler}>Login</button>
                    <p>Or</p>
                    <button className='textButton' onClick={signUpHandler} >New User? Create Account</button>
                </div>
            </div>
            <div className='resetPasswordWrapper'>
                <button className='textButton' onClick={resetPasswordHandler}>Forgot Password?</button>
            </div>
        </div>
    );
}

export default LoginForm;