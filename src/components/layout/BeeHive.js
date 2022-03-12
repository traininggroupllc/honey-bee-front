import React from 'react'
import beeQueen from '../../img/bee-queen.png'
import beeDemolition from '../../img/bee-demolition.png'
import beeTobi from '../../img/bee-tobi.png'
import beeBuzzy from '../../img/bee-buzzy.png'
import beeKaren from '../../img/bee-karen.png'
import beeExcavator from '../../img/bee-excavator.png'
import beeMiner from '../../img/bee-miner.png'

const bees = [
  {
    image: beeMiner,
    name: '10 $HNYb',
    desciption: '10h 22m 13s',
    category: 'Working'
  },
  {
    image: beeExcavator,
    name: '10 $HNYb',
    desciption: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeDemolition,
    name: '12 $HNYb',
    desciption: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeTobi,
    name: '20 $HNYb',
    desciption: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeBuzzy,
    name: '20 $HNYb',
    desciption: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeKaren,
    name: '22 $HNYb',
    desciption: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeQueen,
    name: '70 $HNYb',
    desciption: '0h 0m 0s',
    category: 'Collect'
  }
]

const BeeHive = () => {

  return (
    <div className='beehive'>
      <div className='container py-4'>
        <div className='row'>
          <div className='col-md-6 py-3'>
            <div className='h1 py-2'>Collect Honey</div>
            <div className='h1 py-2'>Every Day!</div>
            <div className='text-justify py-2'>
              Once per day you will be able to send your honey bee to work and have him collect some honey. The honey that you earn can be exchanged for Matic at the honey jar or you can choose to hold your honey to claim exclusive rewards.
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-10 pb-3'>
            {bees.map((item, index) =>
              <div key={index} className='d-inline-block text-center p-1 pb-3'>
                <img alt='SETIMAGE' src={item.image} className='img-fluid' />
                <div>{item.name}</div>
                <div>{item.desciption}</div>
                <button className={'btn bg-yellow font-weight-bold px-4 ' + (item.category === 'Working' ? 'text-secondary' : null)}>{item.category}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeeHive