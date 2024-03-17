import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import { UserContext } from '../context/UserContext';

const Account = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
        <Sidebar />
        <div className='account-container'>
          <h2>Account {user && user.user_metadata.username}</h2>
            
        </div>
    </div>
  )
}

export default Account