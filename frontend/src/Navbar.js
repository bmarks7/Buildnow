import React from 'react'
import './Navbar.scss'
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
        <Link to='/find'><h2 className='navbar__find'>Websites</h2></Link>
        <Link to='/findvideo'><h2 className='navbar__findvideo'>Videos</h2></Link>
        <Link to='/'><h1 className='navbar__title'>Buildnow</h1></Link>
        <Link to='/repo'><h2 className='navbar__repo'>Collection</h2></Link>
        <Link to='/updates'><h2 className='navbar__updates'>Updates</h2></Link>
    </div>
  )
}

