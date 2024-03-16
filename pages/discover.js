import React, {useEffect} from 'react'
import Sidebar from '../components/Sidebar'
import Discover from '../components/Discover';


const discover = () => {
  return (
    <div>
      <Sidebar />
      <Discover />
    </div>
  )
}

export default discover