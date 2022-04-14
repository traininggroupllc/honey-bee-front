import React from 'react'
import Web3 from 'web3'
import { Spinner } from 'react-bootstrap'
import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CHAIN_ID, NETWORKS } from '../../config';

toast.configure()
function MetamaskConnect(props) {
    const [currentAccount, setCurrentAccount] = useState('')
    const [isLogged, setIsLogged] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [balance, setBalance] = useState(0)
    const [currentChainID, setCurrentChainID] = useState(-1)

    const connect = async () => {
        //Detect Provider
        setIsConnecting(true)
        const provider = await detectEthereumProvider()
        // const web3 = new Web3(provider)

        if(!provider || provider == null) {
            setIsConnecting(false)
            alert('Please install metamask')
            window.open('https://metamask.io/', '_blank');
        } else {
            const address = await ConnectWallet()
        }
    }

    const connected = (account) => {
        setCurrentAccount(account)
        setIsLogged(true)
        props.handleConnect()
    }

    const disconnected = () => {
        setIsLogged(false)
        setCurrentAccount('')
        props.handleDisconnect()
    }

    const ConnectWallet = async () => {
        // console.log("Try Connect");
        try {
            await window.ethereum.enable();

            const id = await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                // params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
                params: [{ chainId: CHAIN_ID }], // Test net
            });

            setCurrentChainID(() => parseInt(id, 16))

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                connected(accounts[0])
                setIsConnecting(false)
                return accounts[0]
            } catch(err) {
            if (err.code === 4001) {
                setIsConnecting(false)
                console.log('Please connect to MetaMask.')
                toast.info('Please connect to MetaMask.')
            } else if(err.code === -32002) {
                // console.log('Please unlock MetaMask.')
                setIsConnecting(false)
                console.log('Please unlock MetaMask.')
                toast.info('Please unlock MetaMask.')
            } else if(err.code === 4902 || err.code === -32603) {
                addNetwork("polygon");
            } else {
                console.error(err);
            }
        }
    }

    const handleAccountsChanged = (accounts) => {
        // console.log('handleAccountsChanged');
        //if(!isLogged) return
        if (accounts.length === 0) {
            disconnected()
        } else if (accounts[0] !== currentAccount) {
            connected(accounts[0])
        }
    }

    const chainChanged = (_chainId) => {
        setCurrentChainID(() => parseInt(_chainId, 16))
        if (_chainId != CHAIN_ID) {
            disconnect()
        }
        loadAccountData()
        //window.location.reload()
        // connect()
    }

    const loadAccountData = async () => {
        if (Web3.givenProvider !== null) {
            const web3 = new Web3(Web3.givenProvider)
            const accounts = await web3.eth.getAccounts()
            web3.eth.net.getId()
            .then((res) => {
                const chainId = res.toString(16)
                if (accounts.length === 0 || '0x' + chainId !== CHAIN_ID) {
                    // disconnected()
                    setIsLogged(false)
                    setCurrentAccount('')
                    props.handleDisconnect()
                } else {
                    setCurrentAccount(accounts[0])
                    setIsLogged(true)
                    props.handleConnect()
                    // connected(accounts[0])
                    // var balance = web3.eth.getBalance(accounts[0])
                    // balance.then( result => {
                    //     balance = web3.utils.fromWei(result)
                    //     balance = parseFloat(balance)
                    //     setBalance(balance)
                    // })
                }
            });
        }
    }


    useEffect(async () => {
        window.onbeforeunload = function() { return "Prevent reload" }
        if (window.ethereum !== undefined) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', chainChanged);
        }
        loadAccountData()
    }, []);

    const disconnect = async () => {
        // await window.ethereum.request({
        //     method: "wallet_requestPermissions",
        //     params: [
        //       {
        //         eth_accounts: {}
        //       }
        //     ]
        // });

        setIsLogged(false)
        setCurrentAccount('')
    }

    const shortAddr = () => {
        return `${currentAccount.substr(0,4)}...${currentAccount.substring(currentAccount.length - 4, currentAccount.length)}`
    }

    const addNetwork = (network) => {
        const params = [NETWORKS[network]];
        window.ethereum.request({ method: 'wallet_addEthereumChain', params })
        .then(() => {
            console.log('Success')
            setIsConnecting(false)
        })
        .catch((error) => {
            console.log("Error", error.message)
            setIsConnecting(false)
        })
    }

    // const Chain = (props) => {
    //     const chainId = props.chainId

    //     let chainLogo
    //     let variant
    //     let chainName

    //     switch (chainId) {
    //     case 1: //ETH
    //         // chainLogo = ChainLogo.eth
    //         variant = "light"
    //         chainName = "Ethereum Network"
    //         break;
    //     case 56: //BNB
    //         // chainLogo = ChainLogo.bnb
    //         variant = "secondary"
    //         chainName = "Binance Smart Chain"
    //         break;
    //     case 128: //HT
    //         // chainLogo = ChainLogo.ht
    //         variant = "light"
    //         chainName = "Heco"
    //         break;
    //     case 100: //xDai
    //         // chainLogo = ChainLogo.xdai
    //         variant = "light"  
    //         chainName = "xDai Stable Chain"
    //         break;
    //     case 137: //Polygon
    //         // chainLogo = ChainLogo.polygon
    //         variant = "light"
    //         chainName = "Polygon Network"
    //         break;
    //     default: // Unknown network
    //         // chainLogo = ChainLogo.unknown
    //         variant = "light"
    //         chainName = "Unknown network?"
    //         break;
    //     }

    //     return(
    //     <OverlayTrigger
    //         key="left"
    //         placement="left"
    //         overlay={
    //         <Tooltip id={`tooltip-left`}>
    //             {chainName}
    //         </Tooltip>
    //         }
    //     >
    //         <Button variant={variant} >
    //         {/* <img src={chainLogo} width={14} alt={chainName} /> */}
    //         </Button>
    //     </OverlayTrigger>
    //     )
    // }

    return (
        <>
            {/* <Chain chainId={currentChainID} />{' '} */}
            {
                isLogged ?
                <button id="disconnect" onClick={disconnect} className={props.type}>
                    &nbsp;{shortAddr()}
                </button> :
                <button id="connect" onClick={connect} className={props.type}>
                    { isConnecting && <Spinner as="span" animation="border" size={props.size} role="status" aria-hidden="true" />}
                    &nbsp;Connect Wallet
                </button>
            }
            {/* <button id="connect" onClick={connect} disabled={isLogged} className={props.type}>
                { isConnecting && <Spinner as="span" animation="border" size={props.size} role="status" aria-hidden="true" />}
                &nbsp;{isLogged ? shortAddr() : "Connect Wallet"}
            </button>{' '} */}
            {/* <button onClick={disconnect} style={{visibility: isLogged ? "visible" : "hidden"}} className='btn btn-sm text-warning mx-3'>X</button> */}
        </>
    )
}

export default MetamaskConnect
