import { ethers } from "ethers"
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import networks from '../context/networks'
import { TOKEN_ABI, SIGN_IN_ABI } from '../abi/index'
import { createClient } from 'urql'
import localForage from "localforage"
const { utils } = Web3
const { numberToHex } = utils
const PAGE_PATH = window.location.pathname.split('/chat/')[1]

export const formatAddress = (address, start, end) => {
  if (address) {
    return address.slice(0, start) + '...' + address.slice(-end)
  }
}

export const setLocal = (key, value) => {
  const isObj = Object.prototype.toString.call(value) === '[object Object]'
  if(isObj) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
}

export const getLocal = (key) => {
  if(localStorage.getItem(key) != 'undefined') {
    return localStorage.getItem(key)
  }
}

export const delLocal = (key) => {
  localStorage.removeItem(key)
}

export const clearLocal = () => {
  localStorage.clear()
}

export const debounce = function (fn, delay = 1000) {
  return (...rest) => {
    let args = rest
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const throttle = (fn, delay = 3000) => {
  let canRun = true
  return (...rest) => {
    if (!canRun) return;
    canRun = false
    setTimeout(() => {
      fn.apply(this, rest)
      canRun = true
    }, delay)
  }
}

export const detectMobile = () => {
  /* eslint-disable */
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check
}

export const isInstalledMetaMask = () => {
  if (typeof window.ethereum === 'undefined') {
    return false
  }
  return true
}

export const getDaiWithSigner = (address, abi) => {
  if(!window?.ethereum) return
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  if(address) {
    const daiContract = new ethers.Contract(address, abi, provider)
    const daiWithSigner = daiContract.connect(signer)
    return daiWithSigner
  }
}

export const getContract = (provider, address, abi = TOKEN_ABI, ) => {
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(
    abi,
    address,
  )
  return contract
}


export const getBalanceNumber = (balance, decimals = 18) => {
  if (balance) { 
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
    return displayBalance.toNumber()
  }
}

export const getBalance = async (  provider, tokenAddress, userAddress ) => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}

// tokenAddress :from token
// provider: from provider
// abi: tokenAbi
// spender: from router
export const allowance = async ({ spender, provider, tokenAddress,accounts }) => {
  let account = accounts || localStorage.getItem('account')
  const lpContract = getContract(provider, tokenAddress)
  try {
    const res = await lpContract.methods
      .allowance(account,spender)
      .call()
    return res
  } catch (error) {
    console.warn(error)
    return false
  }
}

// tokenAddress :from token
// provider: from provider
// abi: tokenAbi
// spender: from router
export const approve = async ({ spender, provider, tokenAddress, accounts }) => {
  console.log(spender, provider, tokenAddress, accounts, 'approve=====')
  const lpContract = getContract(provider, tokenAddress)
  try {
    const amount = numberToHex('115792089237316195423570985008687907853269984665640564039457584007913129639935')
    const res = await lpContract.methods
      .approve(spender,amount)
      .send({ from: accounts })
    console.log(res, 'approve-----')
    return res
  } catch (error) {
    console.log(error, '===erro2')
    throw error
  }
}

export const uniqueChatList = (arr,val) => {
   const res = new Map()
   return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
}

export const formatTimestamp = (date) => {
  const bigNumber = new BigNumber(Number(date))
  const decimalString = bigNumber.toString(10)
  const timestamp = Number(decimalString)
  return timestamp
}

export const getClient = async() => {
  let network = PAGE_PATH?.split('/')[1] || getLocal('network')
  if(!network) {
    const networkInfo = await getCurrentNetworkInfo()
    network = networkInfo?.symbol
  } 
  const item = networks.filter(i=> i.symbol === network?.toUpperCase())[0]
  if(!item) return
  const client = createClient({
    url: item?.APIURL
  })
  return client
}

export const handleDecimals = (num, decimalPlaces) => {
  let roundedNum = Math.ceil(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
  return roundedNum.toFixed(6)
}

export const getCurrentNetworkInfo = async() => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const item = networks.filter(i=> i.chainId === network.chainId)[0]
  return item
}

export const getTimestamp = (day) => {
  const now = new Date()
  const oneWeekLater = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
  const oneWeekLaterTimestamp = Math.floor(oneWeekLater.getTime() / 1000)
  return oneWeekLaterTimestamp
}

export const getStackedAmount = async(nftAddress) => {
  const account = getLocal('account')
  const registerUserInfos = await getDaiWithSigner(nftAddress, SIGN_IN_ABI).getRegisterUserInfo(account)
  const userAmount = ethers.utils.formatEther(registerUserInfos?.amount)
  return userAmount
}

export const setCacheGroup = (currentGroups, currentTabIndex) => {
  const currNetwork =  PAGE_PATH?.split('/')[1] || getLocal('network')
  localForage.getItem('chatListInfo').then(res => {
    let chatListInfo = res ? res : {}
    if(currentTabIndex === 0) {
      chatListInfo[currNetwork][getLocal('account')]['publicRooms'] = [...currentGroups]
    } else {
      chatListInfo[currNetwork][getLocal('account')]['privateRooms'] = [...currentGroups]
    }
    // console.log('chatListInfo====1')
    localForage.setItem('chatListInfo', chatListInfo)
  })
}