import React from 'react'
import Web3 from 'web3'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
import {
  HNYB_CONTRACT_ADDRESS,
  HNYB_CONTRACT_ABI,
  HONEYBANK_CONTRACT_ADDRESS,
  HONEYBANK_CONTRACT_ABI,
  // BCITY_CONTRACT_ADDRESS,
  // BCITY_CONTRACT_ABI,
  BUY_PRICE,
  SELL_PRICE,
  CHAIN_ID
} from '../../config'
import MetamaskConnect from './MetamaskConnect';
import beeTokenImage from '../../img/honey-token.png'
import polygonTokenImage from '../../img/polygon-token.png'

toast.configure()

const HoneyJar = () => {
  const web3 = new Web3(Web3.givenProvider)
  const honeyBankContract = new web3.eth.Contract(HONEYBANK_CONTRACT_ABI, HONEYBANK_CONTRACT_ADDRESS)
  const hnybContract = new web3.eth.Contract(HNYB_CONTRACT_ABI, HNYB_CONTRACT_ADDRESS)

  const [currentAccount, setCurrentAccount] = React.useState('')
  const [hnybBalance, setHnybBalance] = React.useState(0)
  const [maticBalance, setMaticBalance] = React.useState(0)
  const [isSwap, setIsSwap] = React.useState(false)

  const [honey, setHoney] = React.useState(0)
  const [matic, setMatic] = React.useState(0)
  const [tab, setTab] = React.useState('buy')

  React.useEffect(async () => {
    window.onbeforeunload = function() { return "Prevent reload" }
    if (window.ethereum !== undefined) {
        window.ethereum.on('chainChanged', chainChanged);
    }
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    if (Web3.givenProvider !== null) {
      const web3 = new Web3(Web3.givenProvider)
      if (Web3.givenProvider.chainId == CHAIN_ID) {
        const accounts = await web3.eth.getAccounts()
        web3.eth.net.getId()
        .then((res) => {
          const chainId = res.toString(16)
          if (accounts.length === 0 || '0x' + chainId !== CHAIN_ID) {
            setCurrentAccount('')
            setMaticBalance(0)
            setHnybBalance(0)
          } else {
            setCurrentAccount(accounts[0])
            var balance = web3.eth.getBalance(accounts[0])
            balance.then( result => {
              balance = web3.utils.fromWei(result)
              balance = parseFloat(balance).toFixed(4)
              console.log('balance', balance)
              setMaticBalance(balance)
              // setMatic(balance)
            })
            getHnybBalance(accounts[0])
            // getMaticBalance(currentAccount)
          }
        });
      } else {
        console.log('Switch network to polygon')
        switchNetwork()
      }
    }
  }

  const chainChanged = (_chainId) => {
    console.log('here', _chainId);
    loadAccountData()
  }

  const setMaticMax = () => {
    setMatic(maticBalance)
    maticChanged(maticBalance)
  }

  const setHnybMax = () => {
    setHoney(hnybBalance)
    honeyChanged(hnybBalance)
  }

  const maticChanged = (value) => {
    if (tab === 'buy') {
      setMatic(value)
      setHoney((value * BUY_PRICE).toFixed(5))
    } else {
      setMatic(value)
      setHoney((value * SELL_PRICE).toFixed(5))
    }
  }

  const honeyChanged = (value) => {
    if (tab === 'buy') {
      setHoney(value)
      setMatic((value / BUY_PRICE).toFixed(5))
    } else {
      setHoney(value)
      setMatic((value / SELL_PRICE).toFixed(5))
    }
  }

  const tabSelected = (tab) => {
    setTab(tab)
    setMatic(0)
    setHoney(0)
  }

  const getHnybBalance = (address) => {
    honeyBankContract.methods.HNYbBalanceOfUser().call({
      from: address,
      gas: 2100000
    })
    .then(res => {
      console.log('user hnyb balance', web3.utils.fromWei(res))
      setHnybBalance(web3.utils.fromWei(res))
    })
  }

  const getMaticBalance = (address) => {
    honeyBankContract.methods.MATICBalance().call({
      from: address,
      gas: 2100000
    })
    .then(res => {
      console.log('bank matic balance', web3.utils.fromWei(res))
    })
  }

  const switchNetwork = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      // params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
      params: [{ chainId: CHAIN_ID }], // Test net
    });
  }

  const swap = () => {
    setIsSwap(true)
    if (tab === 'buy') {
      buy()
    } else {
      sell()
    }
  }

  const buy = () => {
    if (currentAccount === '') {
      toast.warning('Please connect to metamask')
    } else {
      if (matic > 0 && matic <= maticBalance) {
        honeyBankContract.methods.buy().send({
          from: currentAccount,
          value: web3.utils.toWei(matic),
          gas: 2100000
        })
        .then(res => {
          setIsSwap(false)
          toast.success('You bought Honey bee successfully')
          getHnybBalance(currentAccount)
        })
        .catch(err => {
          setIsSwap(false)
          toast.error('Buy Token failed.')
        })
      } else {
        setIsSwap(false)
        toast.warning('Amount is not available')
      }
    }
  }

  const sell = () => {
    if (currentAccount === '') {
      toast.warning('Please connect to metamask')
    } else {
      if (honey > 0 && honey <= parseFloat(hnybBalance)) {
        // var hn = parseFloat(web3.utils.toWei(honey));
        // console.log('formated honey', hn)
        hnybContract.methods.approve(HONEYBANK_CONTRACT_ADDRESS, web3.utils.toWei(honey)).send({
          from: currentAccount,
          gas: 2100000
        })
        .then(res => {
          if (res) {
            honeyBankContract.methods.sell(web3.utils.toWei(honey)).send({
              from: currentAccount,
              gas: 2100000
            })
            .then(res => {
              setIsSwap(false)
              toast.success('You sold Honey bee successfully')
              getHnybBalance(currentAccount)
            })
            .catch(err => {
              console.log('err', err);
              setIsSwap(false)
              toast.error('Sell Token failed.')
            })
          } else {
            setIsSwap(false)
            toast.error('Not approved to transfer')
          }
        })
        .catch(err => {
          console.log('err', err);
          setIsSwap(false)
          toast.error('Not approved to transfer')
        })
      } else {
        setIsSwap(false)
        toast.warning('Amount is not available')
      }
    }
  }

  return (
    <div className='honeyjar'>
      <div className='container'>
        <div className='row py-5'>
          <div className='col-lg-3'></div>
          <div className='col-lg-6 text-center my-5'>
            <div className='honeyjar-box p-4'>
              <div className='h3 pt-3'>Honey Jar (Liquidity Pool)</div>
              <div className='text-left pt-3'>
                <button className={'btn mr-2 ' + (tab === 'buy' ? 'black-btn' : '')} onClick={() => tabSelected('buy')}>Buy</button>
                <button className={'btn mr-2 ' + (tab === 'sell' ? 'black-btn' : '')} onClick={() => tabSelected('sell')}>Sell Honey</button>
                <div className='honey-balance'>{hnybBalance} $HNYB</div>
              </div>

              {tab === 'buy'
                ?
                <>
                  <div className='my-2 border px-3 py-1'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='swap-input'>
                        <input type='number' value={matic} onChange={e => maticChanged(e.target.value)} min="0"/>
                      </div>
                      <div className='swap-symbol'>
                        <span className='mr-2'>$MATIC</span>
                        <img alt='SETIMAGE' src={polygonTokenImage} className='img-fluid' />
                      </div>
                    </div>
                  </div>
                  <div className='my-2'>
                    <div className='d-flex justify-content-between'>
                      <div className='text-danger btn-max' onClick={setMaticMax}>MAX</div>
                      <div className='mr-4'>exchange for</div>
                      <div className='text-danger'></div>
                    </div>
                  </div>
                  <div className='my-2 border px-3 py-1'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='swap-input'>
                        <input type='number' value={honey} onChange={e => honeyChanged(e.target.value)} />
                      </div>
                      <div className='swap-symbol'>
                        <span className='mr-2'>$HNYB</span>
                        <img alt='SETIMAGE' src={beeTokenImage} className='img-fluid' />
                      </div>
                    </div>
                  </div>
                </>
                :
                <>
                  <div className='my-2 border px-3 py-1'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='swap-input'>
                        <input type='number' value={honey} onChange={e => honeyChanged(e.target.value)}  min="0"/>
                      </div>
                      <div className='swap-symbol'>
                        <span className='mr-2'>$HNYB</span>
                        <img alt='SETIMAGE' src={beeTokenImage} className='img-fluid' />
                      </div>
                    </div>
                  </div>
                  <div className='my-2'>
                    <div className='d-flex justify-content-between'>
                      <div className='text-danger btn-max' onClick={setHnybMax}>MAX</div>
                      <div className='mr-4'>exchange for</div>
                      <div className='text-danger'></div>
                    </div>
                  </div>
                  <div className='my-2 border px-3 py-1'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='swap-input'>
                        <input type='number' value={matic} onChange={e => maticChanged(e.target.value)} min="0"/>
                      </div>
                      <div className='swap-symbol'>
                        <span className='mr-2'>$MATIC</span>
                        <img alt='SETIMAGE' src={polygonTokenImage} className='img-fluid' />
                      </div>
                    </div>
                  </div>
                </>
              }

              <div className='mt-5 mb-4'>
                { 
                  currentAccount != '' ?
                    <button className='btn black-btn px-5' onClick={swap}>
                    { isSwap && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>}
                    &nbsp;Swap
                    </button> :
                    <MetamaskConnect type='btn black-btn px-5' handleConnect={loadAccountData} handleDisconnect={loadAccountData}/>
                }
              </div>
            </div>
          </div>
          <div className='col-lg-3'></div>
        </div>
      </div>
    </div>
  )
}

export default HoneyJar