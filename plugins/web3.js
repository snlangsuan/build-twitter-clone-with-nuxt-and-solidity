import { ethers } from 'ethers'
import Twitter from '../artifacts/contracts/TwitterContract.sol/TwitterContract.json'
export default ({ app, route, store, redirect }, inject) => {
  inject('ethers', ethers)
  // if (route.path === '/') return
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const getAccount = async () => {
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      const chainId = await signer.getChainId()
      return { address, chainId }
    }
    // const _updateAccount = async () => {
    //   store.commit('web3/REGISTER_WEB3', { address, chainId })
    // }
    const login = async () => {
      await provider.send('eth_requestAccounts', [])
      const { address, chainId } = await getAccount()
      store.commit('web3/REGISTER_WEB3', { address, chainId })
      window.ethereum.on('accountsChanged', (account) => {
        console.log('account change', account)
        window.location.reload()
      })
      window.ethereum.on('chainChanged', (chainId) => {
        console.log(chainId, app.$config.chainId)
        if (chainId !== app.$config.chainId) {
          redirect('/')
        }
      })
      window.ethereum.on('disconnect', () => {
        redirect('/')
      })
    }
    const twitterContract = () => {
      const signer = provider.getSigner()
      const twitterContract = new ethers.Contract(
        app.$config.contractAddress,
        Twitter.abi,
        signer
      )
      return twitterContract
    }
    inject('web3', {
      provider,
      login,
      getAccount,
      twitterContract
    })

    if (!window.ethereum.isConnected() && route.path === '/') return
    console.log(window.ethereum.isConnected())
    if (!window.ethereum.isConnected()) {
      console.log('redirect')
      window.location.replace('/')
    }
    login()
    // .then(() => {
    //   window.ethereum.on('accountsChanged', (account) => {
    //     console.log('account change', account)
    //   })
    //   window.ethereum.on('chainChanged', (chainId) => {
    //     console.log(chainId, app.$config.chainId)
    //     if (chainId !== app.$config.chainId) {
    //       redirect('/')
    //     }
    //   })
    //   window.ethereum.on('disconnect', () => {
    //     redirect('/')
    //   })
    // })
    .catch((error) => {
      if (error.code !== 4001) {
        console.error(error)
        return
      }
      if (route.path !== '/') redirect('/')
    })
    // instance.send('eth_requestAccounts', [])
    //   .then(async () => {
    //     inject('web3', instance)
    //     const signer = instance.getSigner()
    //     const address = await signer.getAddress()
    //     const chainId = await signer.getChainId()
    //     store.commit('web3/REGISTER_WEB3', { address, chainId})
    //   })
    //   .catch((eee) => {
    //     redirect('/')
    //     // error({ statusCode: 400, message: 'Please connect to your Ethereum address on Metamask before connecting to this website' })
    //   })
    // window.ethereum.on('accountsChanged', async () => {
    //   try {
    //     const signer = instance.getSigner()
    //     const address = await signer.getAddress()
    //     const chainId = await signer.getChainId()
    //     console.log('change account', address)
    //     store.commit('web3/REGISTER_WEB3', { address, chainId})
    //   } catch (error) {
    //     redirect('/')
    //   }
    // })
  } else if (route.path !== '/') redirect('/')
}
