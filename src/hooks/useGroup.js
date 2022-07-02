import { getLocal } from '../utils/index'
import { createClient } from 'urql'
export default function useGroup() {
  const getGroupType = async(roomAddress) => {
    const tokensQuery = `
      query{
        groupInfo(id: "`+ roomAddress?.toLowerCase() + `"){
          id,
          _type
        }
      }
    `
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const res = await client.query(tokensQuery).toPromise()
    return res?.data?.groupInfo?._type
  }

  return {getGroupType}
}