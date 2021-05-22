import React, { useState, useEffect } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const navBarWrapper={
  backgroundColor: '#1168ab',
  width: '100%',
  border: '1px solid #1168ab',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}
const logoWrapper={
  color: 'white',
  fontSize: '1.25em',
  fontWeight: '600',
  margin: '0.5em 1em 0.75em'
}
const logoutButton={
  color: 'white',
  fontSize: '1.25em',
  margin: '0.75em 1em'
}
export default function NavBar() {
  const [isAuth, setIsAuth] = useState(false)
  const [token, setToken] = useState()

  useEffect(() => {
    setToken(localStorage.getItem('token'))
    if (token != null) {
      setIsAuth(true)
    }
  }, [token])


  const logoutHandler = () => {
    setToken(null)
    localStorage.removeItem('token')
    window.location.href = '/'
  };

  const displayAuthButton = () => {
    const userBtn = <div style={logoutButton} onClick={logoutHandler}>
      <ExitToAppIcon></ExitToAppIcon>
    </div>

    if (isAuth) {
      return userBtn
    }
  }

  return (
    <div style={navBarWrapper}>
      <div style={logoWrapper}>
        Music Rating App
      </div>
      {displayAuthButton()}
    </div>
  );
}