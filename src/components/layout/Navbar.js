import React from 'react'
import { Link } from 'react-router-dom'
import tweeter from '../../img/tweeter.png'
import discord from '../../img/discord.png'
import logo from '../../img/logo.png'
import WalletConnect from './WalletConnect'

function Navbar() {
  return (
    <div className='top-navbar'>
      <div className='bg-top'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12 text-right py-1'>
              <img alt='SETIMAGE' src={tweeter} className='img-fluid mx-2' />
              <img alt='SETIMAGE' src={discord} className='img-fluid mx-2' />
            </div>
          </div>
        </div>
      </div>
      <div className='bg-nav p-1'>
        <div className='container'>
          <div className='d-flex align-items-center justify-content-between py-1'>
            <div>
              <Link to='/'>
                <img alt='SETIMAGE' src={logo} className='img-fluid' />
              </Link>
            </div>
            <div className='web-nav'>
              <Link to='/' className='mx-3'>Home</Link>
              <Link to='/beehive' className='mx-3'>Beehive</Link>
              <Link to='/honeyjar' className='mx-3'>Honey Jar</Link>
              <Link to='/metamorphosis' className='mx-3'>Metamorphosis</Link>
              <Link to='/tokenomics' className='mx-3'>Tokenomics</Link>
              <Link to='/roadmap' className='mx-3'>Roadmap</Link>
              <WalletConnect />
            </div>
            <div className='mobile-nav'>
              <div className='dropdown'>
                <button type='button' className='btn dropdown-toggle' data-toggle='dropdown'>
                  <i className='fa fa-bars h1'></i>
                </button>
                <div className="dropdown-menu">
                  <p className="dropdown-item"><Link to='/' className='mx-2'>Home</Link></p>
                  <p className="dropdown-item"><Link to='/beehive' className='mx-2'>Beehive</Link></p>
                  <p className="dropdown-item"><Link to='/honeyjar' className='mx-2'>Honey Jar</Link></p>
                  <p className="dropdown-item"><Link to='/metamorphosis' className='mx-2'>Metamorphosis</Link></p>
                  <p className="dropdown-item"><Link to='/tokenomics' className='mx-2'>Tokenomics</Link></p>
                  <p className="dropdown-item"><Link to='/roadmap' className='mx-2'>Roadmap</Link></p>
                  <p className="dropdown-item">
                    <WalletConnect />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
