import { createClient } from 'urql'
import useGlobal from "./useGlobal"
import { getLocal } from '../utils/index'
import { useCallback } from 'react'
export default function useGroupMember() {
  const { currentTabIndex, networks } = useGlobal()
  const getGroupMember = useCallback(async(address, skip = 0) => {
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
        users(first:50,skip:`+ skip + `){
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
    const item = networks.filter(i=> i.symbol === getLocal('network'))[0]
    if(!item) return
    const client = createClient({
      url: item?.APIURL
    })
    const res = await client.query(tokensQuery).toPromise()
    const data = res?.data?.groupInfo
    return data
  }, [currentTabIndex, networks])

  return { getGroupMember}
}