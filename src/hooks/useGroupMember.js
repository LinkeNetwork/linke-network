import { createClient } from 'urql'
import useGlobal from "./useGlobal"
import { getLocal } from '../utils/index'
export default function useGroupMember() {
  const { currentTabIndex } = useGlobal()
  const getGroupMember = async(currentAddress) => {
    console.log(currentTabIndex, 'currentTabIndex====>>.')
    debugger
    if(currentTabIndex === 1) return
    const tokensQuery = `
    query{
      groupInfo(id: "`+ currentAddress?.toLowerCase() + `"){
        id,
        description,
        name,
        avatar,
        userCount,
        chatCount,
        _type,
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
      url: getLocal('currentGraphqlApi')
    })

    const res = await client.query(tokensQuery).toPromise()
    console.log(res, 'getGroupMember=====res')
    const data = res?.data?.groupInfo
    return data
  }

  return { getGroupMember}
}