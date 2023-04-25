import useGlobal from "./useGlobal"
import { REGISTER_ABI, SIGN_IN_ABI } from '../abi/index'
import { getContractConnect } from '../utils/index'
import { tokenListInfo } from '../constant/tokenList'
export default function useCheckIn() {
  const { signInAddress } = useGlobal()
  const getCheckInToken = async(currentAddress) => {
    if(!window?.ethereum) return
    const res = await getContractConnect(signInAddress, REGISTER_ABI).registers(currentAddress)
    if(+res?.nft === 0) return
    const tx = await getContractConnect(res?.nft, SIGN_IN_ABI).token()
    const tokenList = [...tokenListInfo]
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() === tx?.toLocaleLowerCase())
    const { symbol, decimals } = selectedToken.length && selectedToken[0]
    return { symbol, decimals}
  }
  return { getCheckInToken }
}