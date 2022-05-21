import React from 'react'
import './Navbar.scss'
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
        <Link to='/find'><h2 className='navbar__find'>Find</h2></Link>
        <Link to='/'><h1 className='navbar__title'>Buildnow</h1></Link>
        <Link to='/check'><h2 className='navbar__check'>Check</h2></Link>
    </div>
  )
}

