import { getLocal, getClient } from '../utils/index'
import useGlobal from './useGlobal'
import localForage from "localforage"
export default function useGroupList() {
  const { setState, currentNetworkInfo } = useGlobal()
  const getPublicGroupList = async() => {
    const address = getLocal('account')
    if (!address) return
    const tokensQuery = `
    query{
      groupUser(id: "`+ address.toLowerCase() + `"){
        id,
        groupInfos{
          id,
          name,
          chatCount,
          _type
        }
      }
    }
    `
    const clientInfo =  await getClient()
    const res = await clientInfo?.query(tokensQuery).toPromise()
    let groupInfos = res?.data?.groupUser?.groupInfos
    groupInfos?.forEach((group) => {
      group.hasDelete = false
    })
    return res?.data?.groupUser?.groupInfos || []
  }

  const formatGroup = (publicGroup, cachePublicGroup) => {
    const result = publicGroup?.map(group => {
      const cachedGroup = cachePublicGroup.find(cached => cached.id === group.id)
      const newChatCount = cachedGroup ? group.chatCount - cachedGroup.chatCount : 0
      const hasDelete = cachedGroup ? cachedGroup.hasDelete : group.hasDelete
      return {
        ...group,
        newChatCount,
        hasDelete,
      }
    })
    return result
  }

  const formatPrivateGroup = (privateGroup, cachePrivateGroup) => {
    const result = privateGroup?.map(group => {
      const cachedGroup = cachePrivateGroup.find(cached => cached.id === group.id)
      const hasDelete = cachedGroup ? cachedGroup.hasDelete : group.hasDelete
      return {
        ...group,
        hasDelete
      }
    })
    return result
  }

  const getCachePublicGroup = async () => {
    const currNetwork = currentNetworkInfo?.name || getLocal('network')
    let cachePrivateGroup = []
    await localForage.getItem('chatListInfo').then(res => {
      if (currNetwork && getLocal('isConnect')) {
        const account = res && res[currNetwork] ? res[currNetwork][getLocal('account')] : null
        const publicRooms = account ? account['publicRooms'] : []
        cachePrivateGroup = [...publicRooms]
      }
    });
    return cachePrivateGroup
  }

  return { getPublicGroupList, formatGroup, formatPrivateGroup, getCachePublicGroup }
}