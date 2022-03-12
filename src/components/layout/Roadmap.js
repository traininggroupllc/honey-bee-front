import React from 'react'
import digit1 from '../../img/digit1.png'
import digit2 from '../../img/digit2.png'
import digit3 from '../../img/digit3.png'
import digit4 from '../../img/digit4.png'
import digit5 from '../../img/digit5.png'
import digit6 from '../../img/digit6.png'
import digit7 from '../../img/digit7.png'
import digit8 from '../../img/digit8.png'
import digit9 from '../../img/digit9.png'

const images = [
  {
    image: digit1,
  },
  {
    image: digit2,
  },
  {
    image: digit3,
  },
  {
    image: digit4,
  },
  {
    image: digit5,
  },
  {
    image: digit6,
  },
  {
    image: digit7,
  },
  {
    image: digit8,
  },
  {
    image: digit9,
  }
]

const Roadmap = () => {

  return (
    <div className='roadmap'>
      <div className='container py-4 mb-4'>
        <div className='h3 py-3 px-4'>Roadmap</div>
        {images.map((item, index) =>
          <div className={'d-flex ' + (index % 2 === 1 ? 'justify-content-end' : '')} key={index}>
            <div className='col-md-8'>
              <div className='row'>
                <div className='col-md-3 text-center py-3'>
                  <img alt='SETIMAGE' src={item.image} className='img-fluid' />
                </div>
                <div className='col-md-9 py-3'>
                  <div className='h4'>Item #{index + 1}</div>
                  <div className='text-justify'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Roadmap