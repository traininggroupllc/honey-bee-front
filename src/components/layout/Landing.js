import React from 'react'
import Web3 from 'web3'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FAQ from './FAQ'
import minusButton from '../../img/minus-button.png'
import plusButton from '../../img/plus-button.png'
import beeDiagram from '../../img/bee-diagram.png'
import beeQueen from '../../img/bee-queen.png'
import beeDemolition from '../../img/bee-demolition.png'
import beeTobi from '../../img/bee-tobi.png'
import beeBuzzy from '../../img/bee-buzzy.png'
import beeKaren from '../../img/bee-karen.png'
import beeExcavator from '../../img/bee-excavator.png'
import beeMiner from '../../img/bee-miner.png'
import digit1 from '../../img/digit1.png'
import digit2 from '../../img/digit2.png'
import digit3 from '../../img/digit3.png'
import digit4 from '../../img/digit4.png'
import digit5 from '../../img/digit5.png'
import digit6 from '../../img/digit6.png'
import digit7 from '../../img/digit7.png'
import digit8 from '../../img/digit8.png'
import digit9 from '../../img/digit9.png'
import landingBeeBG from '../../img/landing-bee-bg.png'
import {
  // HNYB_CONTRACT_ADDRESS,
  // HNYB_CONTRACT_ABI,
  // HONEYBANK_CONTRACT_ADDRESS,
  // HONEYBANK_CONTRACT_ABI,
  BCITY_CONTRACT_ADDRESS,
  BCITY_CONTRACT_ABI,
  NFT_PRICE,
  CHAIN_ID
} from '../../config'
import MetamaskConnect from './MetamaskConnect';

const bees = [
  {
    image: beeMiner,
    name: 'Miner Bee',
    desciption: '10 Honey Per Day',
    category: 'Common'
  },
  {
    image: beeExcavator,
    name: 'Excavator Bee',
    desciption: '10 Honey Per Day',
    category: 'Common'
  },
  {
    image: beeDemolition,
    name: 'Demolition Bee',
    desciption: '12 Honey Per Day',
    category: 'Common'
  },
  {
    image: beeTobi,
    name: 'Tobi Bee',
    desciption: '20 Honey Per Day',
    category: 'Rare'
  },
  {
    image: beeBuzzy,
    name: 'Buzzy Bee',
    desciption: '20 Honey Per Day',
    category: 'Rare'
  },
  {
    image: beeKaren,
    name: 'Karen Bee',
    desciption: '24 Honey Per Day',
    category: 'Rare'
  },
  {
    image: beeQueen,
    name: 'Queen Bee',
    desciption: '80 Honey Per Day',
    category: 'Epic'
  }
]

const Roadmap = [
  {
    image: digit1,
    title: 'Play-2-Earn',
    description: 'Become the most profitable Beekeeper! Earn honey to swap for Matic or in game rewards.',
    type: 'Live'
  },
  {
    image: digit2,
    title: 'Pollen Boost',
    description: 'Multiply the amount of $MATIC you receive for each $HNYb you sell. Holding your honey and selling at the right time may BEE worth your while.',
    type: 'Live'
  },
  {
    image: digit3,
    title: 'Burn Mechanisms',
    description: 'Ability to use $HNYb to purchase special honey bees, entry ticket into the metaverse and more!',
  },
  {
    image: digit4,
    title: 'Metaverse',
    description: 'Ability to explore Bee City, play games, socialize, buy land, earn rewards and more in the Metaverse.',
  },
  {
    image: digit5,
    title: 'Dashboard',
    description: 'See stats such as the number of bees in circulation, the amount of $HNYb burned, the total amount of $MATIC in LP and more.',
  },
  {
    image: digit6,
    title: 'Metamorphasis',
    description: 'Beekeepers can morph their NFT into something more at the end of season 1!',
  },
  {
    image: digit7,
    title: 'Marketplace',
    description: 'In-game marketplace for you to purchase metaverse items, NFTs and more with $HNYb.',
  },
  {
    image: digit8,
    title: 'Staking',
    description: 'Stake your $HNYb to maximize your honey yield.',
  },
  {
    image: digit9,
    title: 'Merchandise',
    description: 'Purchase murchandise such as shirts, hats, sweatshirts, computer mouse and much more!',
  }
]

var counter = 0
toast.configure()

const Landing = () => {
  // toast.configure()
  const [currentImage, setCurrentImage] = React.useState(bees[0].image)
  const [mintAmount, setMintAmount] = React.useState(1)
  const [balance, setBalance] = React.useState(0)
  const [currentAccount, setCurrentAccount] = React.useState('')
  const [isMinting, setIsMinting] = React.useState(false)
  const [totalSupply, setTotalSupply] = React.useState(1)
  
  const web3 = new Web3(Web3.givenProvider)
  const bcityContract = new web3.eth.Contract(BCITY_CONTRACT_ABI, BCITY_CONTRACT_ADDRESS)

  React.useEffect(() => {
    setInterval(async function () {
      counter++
      counter = counter % 7
      await setCurrentImage(bees[counter].image)
    }, 500)
    loadAccountData()
  }, [])

  const updateMintAmount = (offset) => {
    if (mintAmount + offset > 0) {
      setMintAmount(mintAmount + offset)
    } else {
      setMintAmount(1)
    }
  }

  const loadAccountData = async () => {
    if (Web3.givenProvider !== null) {
      const web3 = new Web3(Web3.givenProvider)
      const accounts = await web3.eth.getAccounts()
      web3.eth.net.getId()
      .then((res) => {
        const chainId = res.toString(16)
        if (accounts.length === 0 || '0x' + chainId !== CHAIN_ID) {
          setCurrentAccount('')
        } else {
          var balance = web3.eth.getBalance(accounts[0])
          balance.then( result => {
            balance = web3.utils.fromWei(result)
            balance = parseFloat(balance)
            setBalance(balance)
            setCurrentAccount(accounts[0])
          })
        }
      });
    }
  }

  const getTotalSupply = () => {
    bcityContract.methods.totalSupply().call({
      gas: 2100000,
      gasPrice: '32000000000'
    })
    .then(res => {
      setTotalSupply(res)
    })
  }

  const mint = async () => {
    if (currentAccount === '') {
      toast.warning('Please connect to metamask')
    } else {
      if (balance < mintAmount * NFT_PRICE) {
        toast.warning('Balance is not enough')
      } else {
        setIsMinting(true)
        bcityContract.methods.
        buy(mintAmount).send({
          from: currentAccount,
          value: Math.ceil(mintAmount * NFT_PRICE * 1000000000000000000),
          gas: 400000 * mintAmount,
          gasPrice: '32000000000'
        })
        .once("error", (err) => {
          console.log(err)
          setIsMinting(false)
          if (err.code === 4001) {
            toast.error('You canceled confirmation') 
          } else {
            toast.error('Minting failed.') 
          }
        })
        .then(res => {
          setIsMinting(false)
          toast.success('Successfully minted!')
        })
      }
    }
  }

  getTotalSupply()

  return (
    <div className='landing'>
      <div className='landing-1 container-fluid'>
        <div className='row'>
          <div className='col-lg-4'></div>
          <div className='col-lg-4 my-5'>
            <div className='text-center bg-yellow mint-box'>
              <div className='h3 font-weight-bold'>SEASON 1</div>
              <div className='h4 font-weight-bold'>Mint Your Honey Bee!</div>
              <div className='h0 font-weight-bold'>{totalSupply} / 9,999</div>
            </div>
            <div className='d-flex align-items-center justify-content-between'>
              <div>
                <img alt='SETIMAGE' src={minusButton} className='img-fluid mint-controller' onClick={() => updateMintAmount(-1)} />
              </div>
              <div>
                <img alt='SETIMAGE' src={currentImage} className='img-fluid hero-dynamic-img' />
              </div>
              <div>
                <img alt='SETIMAGE' src={plusButton} className='img-fluid mint-controller' onClick={() => updateMintAmount(1)} />
              </div>
            </div>
            <div className='text-center bg-yellow mint-box p-3'>
              <div className='h4'>Mint {mintAmount} Honey Bee NFT.</div>
              <div className='h4'>{NFT_PRICE} MATIC Each.</div>
              <div className='h3 font-weight-bold py-2'>Total: {mintAmount * NFT_PRICE} MATIC</div>
              <div>
                { 
                  currentAccount != '' ?
                    <button onClick={mint} className='black-btn btn px-4 h4 py-2'>
                    { isMinting && 
                      <Spinner as='span' animation='border' size='lg' role='status' aria-hidden='true'/>}
                    &nbsp;Mint
                    </button> :
                    <MetamaskConnect size='lg' type='black-btn btn px-4 h4 py-2' handleConnect={loadAccountData} handleDisconnect={loadAccountData} />
                }
              </div>
            </div>
          </div>
          <div className='col-lg-4'></div>
        </div>
      </div>
      <div className='landing-2 container'>
        <div className='row align-items-center'>
          <div className='col-md-7 py-4 px-4'>
            <div className='h1 font-weight-bold'>Welcome To Bee City! An NFT Game Where You Play-2-Earn!</div>
            <div className='py-2'>
              Bee City is a Play-2-Earn NFT game, where the goal is to collect the most amount of honey and bee the most profitable beekeeper! Get ready to mint some bees and put them to work.
            </div>
            <div className='h3 font-weight-bold pt-4'>How Does It Work?</div>
            <div className='py-2'>
              You mint a bee, your bee collects honey everyday, which you can exchange for matic or hold for future exclusive in game purchases.
            </div>
            <div>
              <button className='btn btn-sm yellow-btn'>Learn More</button>
            </div>
          </div>
          <div className='col-md-5 py-3 text-center'>
            <img alt='SETIMAGE' src={beeDiagram} className='img-fluid' />
          </div>
        </div>
      </div>
      <div className='landing-3 container-fluid'>
        <div className='h3 font-weight-bold text-center py-5'>Meet The Hardest Working Bees in the Hive</div>
        <div className='row'>
          <div className='col-lg-3'></div>
          <div className='col-lg-6 text-center pb-5'>
            {bees.map((item, index) =>
              <div key={index} className='d-inline-block text-center p-1'>
                <img alt='SETIMAGE' src={item.image} className='img-fluid bee-image' />
                <div className='font-weight-bold h6'>{item.name}</div>
                <div>{item.desciption}</div>
                <div className='text-success'>{item.category}</div>
              </div>
            )}
          </div>
          <div className='col-lg-3'></div>
        </div>
      </div>
      <div className='landing-4 container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='text-center'>
              <div className='h1 font-weight-bold mt-5'>Why Bee City?</div>
              <div>
                Most NFT project don't have any utility and developers reap the benefits. Bee City NFT's are more than just a collectable that sits in your wallet. They allow you to earn money, earn rewards and play games within the metaverse.
              </div>
            </div>
          </div>
          <div className='col-md-2'></div>
          <div className='col-md-8 m-3 p-3 bg-yellow text-center'>
            <div><span className='font-weight-bold'>Other NFT Projects </span>= 100% of mint funds + 100% of royalties go into devs wallet</div>
            <br />
            <div><span className='font-weight-bold'>Bee City NFTs </span>= 70% of mint funds + 100% of royalties go into the LP (Honey Jar)</div>
            <div><span className='font-weight-bold'>Bee City NFTs </span>= 30% of mint funds + 0% of royalties go into devs wallet</div>
          </div>
          <div className='col-md-2'></div>
        </div>
        <div className='row'>
          <div className='col-lg-12 text-center h1 font-weight-bold mt-5'>
            BeeCity Utility and Roadmap
          </div>
          {Roadmap.map((item, index) =>
            <div className='col-md-4 text-center p-3' key={index}>
              <img alt='SETIMAGE' src={item.image} className='img-fluid' />
              <div className='h4 font-weight-bold py-2'>{item.title}</div>
              <div>{item.description}</div>
              <div className='font-weight-bold'>{item.type}</div>
            </div>
          )}
        </div>
      </div>
      <FAQ />
      <div className='landing-5 container-fluid'>
        <div className='row'>
          <img alt='SETIMAGE' src={landingBeeBG} className='img-fluid w-100' />
        </div>
      </div>
    </div>
  )
}

export default Landing
