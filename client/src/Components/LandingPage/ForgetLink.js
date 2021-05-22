import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BASE_URL } from '../../config/serverUrl'
import './form.css'

const ForgetLink = () => {

    const [email, setEmail] = useState('')
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    useEffect(() => {
        setTimeout(() => {
            setOpen(false)
        }, 1500)
    }, [open])
    const emailChangeHandler = event => {
        setEmail(event.target.value)
    }

    const onResetLinkHandler = event => {
        event.preventDefault()
        if (email !== '') {
            const userObject = {
                email: email
            };

            axios.post(`${BASE_URL}user/auth/generateResetLink`, userObject)
                .then(res => {
                    setEmail('')
                    setMessage(`Reset Mail Sent To ${email}`)
                    setOpen(true);
                    setSeverity('success')
                }).catch(err => {
                    if (err.response) {
                        setMessage(err.response.data.msg)
                        setOpen(true);
                        setSeverity('error')
                    } else if (err.request) {
                        console.log(err.request)
                    } else {
                        console.log(err)
                    }
                })
        } else {
            setMessage('Please Enter Email Id')
            setOpen(true);
        }
    }
    const displayMessage = () => {
        if (open === true) {
            if (severity === 'success') {
                return <div className='success'>
                    {message}
                </div>
            }
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
                <p className='formTitle'>Send Reset Link</p>
                <input type='text' placeholder='Email' value={email} className='input' onChange={emailChangeHandler}></input>
                {displayMessage()}
                <div className='formButtons'>
                    <button className='formButton' onClick={onResetLinkHandler}>Send</button>
                </div>
            </div>
            <div className='resetPasswordWrapper'>
                <button className='textButton' onClick={backToLoginHandler}>Back To Login</button>
            </div>
        </div>
    );
}

export default ForgetLink;