import React from 'react'
import { Link } from 'react-router-dom'
import logoFooter from '../../img/logo-footer.png'
import tweeter from '../../img/tweeter.png'
import discord from '../../img/discord.png'

const Footer = () => {

  return (
    <div className='footer bg-black pt-4 pb-5 text-center'>
      <img alt='SETIMAGE' src={logoFooter} className='img-fluid' />
      <div className='py-2'>
        <div className='d-inline-block px-2'>
          <Link to='/' className='text-warning'>Home</Link>
        </div>
        <div className='d-inline-block px-2'>
          <Link to='/beehive' className='text-warning'>Beehive</Link>
        </div>
        <div className='d-inline-block px-2'>
          <Link to='/honeyjar' className='text-warning'>Honey Jar</Link>
        </div>
        <div className='d-inline-block px-2'>
          <Link to='/metamorphosis' className='text-warning'>Metamorphosis</Link>
        </div>
        <div className='d-inline-block px-2'>
          <Link to='/tokenomics' className='text-warning'>Tokenomics</Link>
        </div>
        <div className='d-inline-block px-2'>
          <Link to='/roadmap' className='text-warning'>Roadmap</Link>
        </div>
      </div>
      <div>
        <img alt='SETIMAGE' src={tweeter} className='img-fluid mx-2' />
        <img alt='SETIMAGE' src={discord} className='img-fluid mx-2' />
      </div>
    </div>
  )
}

export default Footer