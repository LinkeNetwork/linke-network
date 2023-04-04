import useGlobal from "./useGlobal"
import { REGISTER_ABI, SIGN_IN_ABI } from '../abi/index'
import { getDaiWithSigner } from '../utils/index'
import { tokenListInfo } from '../constant/tokenList'
export default function useCheckIn() {
  const { signInAddress, currentAddress } = useGlobal()
  const getCheckInToken = async() => {
    const res = await getDaiWithSigner(signInAddress, REGISTER_ABI).registers(currentAddress)
    const tx = await getDaiWithSigner(res.nft.toLocaleLowerCase(), SIGN_IN_ABI).token()
    const tokenList = [...tokenListInfo]
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() == tx.toLocaleLowerCase())
    const { symbol } = selectedToken.length && selectedToken[0]
    return symbol
  }
  return { getCheckInToken }
}