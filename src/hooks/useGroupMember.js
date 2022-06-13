import useChain from "./useChain"
import { createClient } from 'urql'
export default function useGroupMember() {
  const { getChainInfo } = useChain()

  const getGroupMember = async(currentAddress) => {
    const networkInfo = await getChainInfo()
    const tokensQuery = `
    query{
      groupInfo(id: "`+ currentAddress.toLowerCase() + `"){
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