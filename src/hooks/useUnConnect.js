import { createClient } from 'urql'
import { getLocal } from '../utils'
import useGlobal from './useGlobal'
export default function useUnConnect() {
  const { networks, setState } = useGlobal()
  const getclientInfo = () => {
    if(!getLocal('network')) return
    const item = networks.filter(i=> i.name === getLocal('network'))[0]
    const client = createClient({
      url: item?.APIURL
    })
    setState({
      currentNetworkInfo:item,
      clientInfo: client
    })
  }
  return { getclientInfo }
}