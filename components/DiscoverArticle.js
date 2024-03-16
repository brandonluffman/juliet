import Link from 'next/link'
import React from 'react'
import { FaCcDiscover, FaConnectdevelop } from 'react-icons/fa'
import { BsBrowserSafari, BsClock, BsEye } from 'react-icons/bs'

const DiscoverArticle = ({ id }) => {
  return (
    <Link className='discover-grid-link' href={`/discover/${id}`}>
    <div className='discover-article-item'>
        <div className='discover-article-img-container'>
        <img src='/favicon.ico'></img>
        </div>
        <div className='discover-article-content-container'>
          <h4>Apple Acquires DarwinAI</h4>
          <h6>Apple Inc. has acquired the Canadian artificial intelligence startup DarwinAI. The acquisition is part of Apple&apos;s broader strategy to enhance it&apos;s AI... </h6>
          <div className='discover-article-stats'>
            <div><BsEye /> 19,447</div>
            <div><FaConnectdevelop /> 1,952</div>
            <div><BsClock /> 12 hours ago</div>
          </div>
        </div>
    </div>
    </Link>
  )
}

export default DiscoverArticle