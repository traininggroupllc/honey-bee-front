import React from 'react'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useState } from 'react'

function MetamaskConnect() {
    const networks = {
        'polygon': {
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/']
        }
    };

    const [currentAccount, setCurrentAccount] = useState('')
    const [isLogged, setIsLogged] = useState(false)
    const [currentChainID, setCurrentChainID] = useState(-1)

    const connect = async () => {
        //Detect Provider
        const provider = await detectEthereumProvider()
        console.log('provider', provider)
        // const web3 = new Web3(provider)

        if(!provider || provider == null) {
            alert('Please install MetaMask!')
            window.open('https://metamask.io/', '_blank');
            // setMessage(messages => [...messages, {head : "Wallet not found", body: `Please install MetaMask!`, variant: 'warning'}])
        } else {
            const address = await ConnectWallet()
            if (address)
                setMessage(messages =>[...messages, {head : "User Login", body: `addres: ${address}`, variant: 'success'}])
        }
    }

    const ConnectWallet = async () => {
        console.log("Try Connect");
        try {
            await window.ethereum.enable();

            const id = await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
            });

            setCurrentChainID(() => parseInt(id, 16))

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                setIsLogged(true)
                setCurrentAccount(accounts[0])
                return accounts[0]
            } catch(err) {
            if (err.code === 4001) {
                console.log('Please connect to MetaMask.')
                // setMessage(messages =>[...messages, {head : "User Rejected Request", body: 'Please connect to MetaMask.', variant: 'info'}])
            } else if(err.code === -32002) {
                console.log('Please unlock MetaMask.')
                // setMessage(messages =>[...messages, {head : "User Request Pending", body: 'Please unlock MetaMask and try agin.', variant: 'info'}])
            } else if(err.code === 4902 || err.code === -32603) {
                addNetwork("polygon");
            } else {
                console.error(err);
                setMessage(messages =>[...messages, {head : "Error", body: err.message, variant: 'info'}])
            }
        }
    }

    const handleAccountsChanged = (accounts) => {
        console.log('handleAccountsChanged');
        //if(!isLogged) return
        if (accounts.length === 0) {
            setIsLogged(false)
            setCurrentAccount('')
        } else if (accounts[0] !== currentAccount) {
            console.log(accounts[0])
            console.log(messages);
            setCurrentAccount(() => accounts[0])
            setMessage(messages => [...messages, {head : "Account Changed", body: `addres: ${accounts[0]}`, variant: 'warning'}])
        }
    }

    const chainChanged = (_chainId) => {
        console.log('here', _chainId);
        setCurrentChainID(() => parseInt(_chainId, 16))
        //window.location.reload()
        connect()
    }


    useEffect(() => {
        window.onbeforeunload = function() { return "Prevent reload" }
        console.log('ethereum', window.ethereum);
        if (window.ethereum !== undefined) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', chainChanged);
        }
    }, []);



    const disconnect = async () => {
        setIsLogged(false)
        setCurrentAccount('')
    }

    const shortAddr = () => {
        return `${currentAccount.substr(0,4)}...${currentAccount.substring(currentAccount.length - 4, currentAccount.length)}`
    }

    const addNetwork = (network) => {
        const params = [networks[network]];
        console.log(params);
        window.ethereum.request({ method: 'wallet_addEthereumChain', params })
        .then(() => console.log('Success'))
        .catch((error) => console.log("Error", error.message))
    }

    const [messages, setMessage] = useState([])

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
        <button id="connect" onClick={connect} disabled={isLogged} className='btn btn-sm text-warning mx-3'>{isLogged ? shortAddr() : "Connect Wallet"}</button>{' '}
        {/* <button onClick={disconnect} style={{visibility: isLogged ? "visible" : "hidden"}} className='btn btn-sm text-warning mx-3'>X</button> */}
      </>
  )
}

export default MetamaskConnect
