import React from 'react'
import LoginComponent from '../components/Login'
import Sidebar from '../components/Sidebar'

const login = () => {
  return (
    <div>
      <Sidebar />
      <LoginComponent />
    </div>
  )
}

export default login