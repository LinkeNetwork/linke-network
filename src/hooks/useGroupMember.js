import { createClient } from 'urql'
import useGlobal from "./useGlobal"
import { getLocal } from '../utils/index'
import { useCallback } from 'react'
export default function useGroupMember() {
  const { currentTabIndex, currentAddress } = useGlobal()
  const getGroupMember = useCallback(async(address) => {
    if(currentTabIndex === 1 || !address) return
    const tokensQuery = `
    query{
      groupInfo(id: "`+ address?.toLowerCase() + `"){
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
  }, [currentAddress])

  return { getGroupMember}
}