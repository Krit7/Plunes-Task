import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'

import axios from 'axios';
import { BASE_URL } from '../../config/serverUrl'
import './form.css'

const LoginForm = () => {
    const location = useLocation().pathname


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [userId, setUserId] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')

    useEffect(() => {
        setUserId(location.split('/')[4])
        setResetToken(location.split('/')[5])
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

    const newPasswordChangeHandler = event => {
        setNewPassword(event.target.value)
    }

    const onChangePasswordHandler = event => {
        event.preventDefault()
        if (email !== '' && password !== '' && newPassword !== '') {
            if (password === newPassword) {
                const userObject = {
                    email: email,
                    password: password,
                    password2: newPassword
                };

                axios.post(`${BASE_URL}user/auth/resetPassword/${userId}/${resetToken}`, userObject)
                    .then(res => {
                        window.location.href = '/'
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
                setMessage('Passwords Do Not Match!')
                setOpen(true);
            }
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

    const backToLoginHandler = () => {
        window.location.href = '/'
    }

    return (
        <div className='formWrapper'>
            <div className='form'>
                <p className='formTitle'>Reset Password</p>
                <input type='text' placeholder='Email' value={email} className='input' onChange={emailChangeHandler}></input>
                <input type='password' placeholder='Password' value={password} className='input' onChange={passwordChangeHandler}></input>
                <input type='password' placeholder='Re-Enter Password' value={newPassword} className='input' onChange={newPasswordChangeHandler}></input>
                {displayMessage()}
                <div className='formButtons'>
                    <button className='formButton' onClick={onChangePasswordHandler}>Reset</button>
                </div>
            </div>
            <div className='resetPasswordWrapper'>
                <button className='textButton' onClick={backToLoginHandler}>Back To Login</button>
            </div>
        </div>
    );
}

export default LoginForm;