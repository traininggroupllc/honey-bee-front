import React from 'react'
import Web3 from 'web3'
import axios from "axios";
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import beeQueen from '../../img/bee-queen.png'
import beeDemolition from '../../img/bee-demolition.png'
import beeTobi from '../../img/bee-tobi.png'
import beeBuzzy from '../../img/bee-buzzy.png'
import beeKaren from '../../img/bee-karen.png'
import beeExcavator from '../../img/bee-excavator.png'
import beeMiner from '../../img/bee-miner.png'
import MetamaskConnect from './MetamaskConnect'
import TimerCounter from './TimeCounter'
import {
  // HNYB_CONTRACT_ADDRESS,
  // HNYB_CONTRACT_ABI,
  // HONEYBANK_CONTRACT_ADDRESS,
  // HONEYBANK_CONTRACT_ABI,
  BCITY_CONTRACT_ADDRESS,
  BCITY_CONTRACT_ABI,
  // BUY_PRICE,
  // SELL_PRICE,
  CHAIN_ID,
  SYMBOL
} from '../../config'
import secondsToHms from '../../utils/secondsToHms'
import BeeStatusButton from './BeeStatusButton'

const bees = [
  {
    image: beeMiner,
    name: '10 $HNYb',
    description: '10h 22m 13s',
    category: 'Working'
  },
  {
    image: beeExcavator,
    name: '10 $HNYb',
    description: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeDemolition,
    name: '12 $HNYb',
    description: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeTobi,
    name: '20 $HNYb',
    description: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeBuzzy,
    name: '20 $HNYb',
    description: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeKaren,
    name: '22 $HNYb',
    description: '0h 0m 0s',
    category: 'Collect'
  },
  {
    image: beeQueen,
    name: '70 $HNYb',
    description: '0h 0m 0s',
    category: 'Collect'
  }
]

toast.configure()

const BeeHive = () => {
  const tempBees = []
  var tempLoadCount = 0
  var tempBalance = 0
  const web3 = new Web3(Web3.givenProvider)
  const bcityContract = new web3.eth.Contract(BCITY_CONTRACT_ABI, BCITY_CONTRACT_ADDRESS)

  const [bees, setBees] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [currentAccount, setCurrentAccount] = React.useState('')
  const [loadCount, setLoadCount] = React.useState(0)
  const [balance, setBalance] = React.useState(0)

  React.useEffect(async () => {
      loadAccountData()
  }, [currentAccount])

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
          setCurrentAccount(accounts[0])
          setLoading(true)
          getBees()
        }
      });
    }
  }

  const getBees = () => {
    setBees([])
    getBalanceOf()
  }

  const getBalanceOf = () => {
    if (currentAccount != '') {
      bcityContract.methods.balanceOf(currentAccount).call({
        from: currentAccount,
        gas: 2100000
      })
      .then(res => {
        setBalance(res)
        tempBalance = res
        for (var i = 0; i < res; i++) {
          getTokenByIndex(i)
        }
      })
    }
  }

  const getTokenByIndex = (index) => {
    bcityContract.methods.tokenOfOwnerByIndex(currentAccount, index).call({
      from: currentAccount,
      gas: 2100000
    })
    .then(res => {
      // getTokenURI(res)
      getBeeInfo(res)
    })
  }

  const getBeeInfo = (token) => {
    bcityContract.methods.bees(token).call({
      from: currentAccount,
      gas: 2100000
    })
    .then(res => {
      var image;
      switch(res.shape) {
        case "0":
          image = beeQueen;
          break;
        case "1":
          image = beeKaren;
          break;
        case "2":
          image = beeBuzzy;
          break;
        case "3":
          image = beeTobi;
          break;
        case "4":
          image = beeDemolition;
          break;
        case "5":
          image = beeExcavator;
          break;
        default:
          image = beeMiner;
          break;
      }
      const lastCollect = parseInt(res.honeyCollectedLast)
      const date = new Date();
      const seconds = date.getTime() / 1000;
      const diff = parseInt(seconds) - lastCollect;
      const bee = {
        image: image,
        name: web3.utils.fromWei(res.honeyPerDay) + ' ' + SYMBOL,
        tokenId: token,
        lastCollect: lastCollect,
        honeyPerDay: parseInt(web3.utils.fromWei(res.honeyPerDay))
      }
      tempBees.push(bee)
      
      if (tempLoadCount <= tempBalance - 1) {
        tempLoadCount++
        setLoadCount(tempLoadCount)
      }
      if (tempLoadCount == tempBalance) {
        for (var j = 0; j < tempBees.length; j++){
          for(var k = j + 1; k < tempBees.length; k++){
            if (tempBees[j].honeyPerDay > tempBees[k].honeyPerDay) {
              var temp = tempBees[j]
              tempBees[j] = tempBees[k]
              tempBees[k] = temp
            }
          }
        }
        setBees(tempBees)
        setLoadCount(tempLoadCount)
        setLoading(false)
        tempLoadCount = 0
        tempBalance = 0
      }
    })
  }

  const getTokenURI = (token) => {
    bcityContract.methods.tokenURI(token).call({
      from: currentAccount,
      gas: 2100000
    })
    .then(res => {
      console.log('uri', res)
      getTokenMetaData(res)
    })
    .catch(err => {
      toast.error('Buy Token failed.')
    })
  }

  const getTokenMetaData = (uri) => {
    axios
    .get(uri)
    .then((response) => {
      console.log('response', response)
    })
    .catch((err) => setLoading(false));
  }

  const collectHoney = (tokenId) => {
    console.log('clicked', tokenId)
    bcityContract.methods.collectHoney(tokenId).send({
      from: currentAccount,
      gas: 210000
    })
    .then(res => {
      console.log('collect result', res)
      toast.success('You collect honey successfully')
    })
    .catch(err => {
      console.log(err)
      toast.error('Collecting failed')
    })
  }

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
            { 
              loading ?
                <>
                  <div className='text-center py-4'>
                    <Spinner as='span' animation='border' size='lg' role='status' aria-hidden='true' style={{padding: '1.3rem'}}/>
                  </div>
                  <div className='text-center'>
                    <h5>Loading bees {loadCount} / {balance}</h5>
                  </div>
                </>
              :
              <></> 
            }
          </div>
        </div>
        <div className='row'>
          <div className='col-md-10 pb-3'>
            { 
              bees.length > 0 && currentAccount != '' ? 
              bees.map((item, index) =>
                <div key={index} className='d-inline-block text-center p-1 pb-3'>
                  <img alt='SETIMAGE' src={item.image} className='img-fluid' />
                  <div>{item.name}</div>
                  <div><TimerCounter time={item.lastCollect}/></div>
                  <BeeStatusButton time={item.lastCollect} handleClicked={ (tokenId) => collectHoney(tokenId)} beeId={item.tokenId}/>
                </div>
              ) :
                currentAccount == '' ?
                <MetamaskConnect type='black-btn btn px-4 h4 py-2' handleConnect={loadAccountData} handleDisconnect={loadAccountData} /> :
                loading ?
                <></> :
                <></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeeHive