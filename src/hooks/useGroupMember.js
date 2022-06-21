import useChain from "./useChain"
import { createClient } from 'urql'
import useGlobal from "./useGlobal"
export default function useGroupMember() {
  const { getChainInfo } = useChain()
  const { currentTabIndex } = useGlobal()
  const getGroupMember = async(currentAddress) => {
    console.log(currentTabIndex, 'currentTabIndex====>>.')
    if(currentTabIndex === 1) return
    const networkInfo = await getChainInfo()
    const tokensQuery = `
    query{
      groupInfo(id: "`+ currentAddress?.toLowerCase() + `"){
        id,
        description,
        name,
        avatar,
        userCount,
        users {
          id,
          name,
          label,
          state,
          tokenId,
          profile {
            avatar,
            name,
          }
        }
      }
    }
    `
    const client = createClient({
      url: networkInfo?.APIURL
    })

    const res = await client.query(tokensQuery).toPromise()
    console.log(res, 'getGroupMember=====res')
    const data = res?.data?.groupInfo
    return data
  }

  return { getGroupMember}
}