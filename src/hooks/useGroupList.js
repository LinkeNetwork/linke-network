import { getLocal, getClient } from '../utils/index'
import useGlobal from './useGlobal'
import localForage from "localforage"
export default function useGroupList() {
  const { currentNetworkInfo } = useGlobal()
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

  const compareGroup = async(currentGroupList, cacheGroupList) => {
    const hasNewMsgGroup = []
    const result = currentGroupList?.map(group => {
      const cachedGroup = cacheGroupList.find(cached => cached.id === group.id)
      if (cachedGroup) {
        const newChatCount = parseInt(group.chatCount) - parseInt(cachedGroup.chatCount)
        let chatCountChanged = +group.chatCount === +cachedGroup.chatCount ? false : true
        const chatCount = cachedGroup ? group.chatCount : cachedGroup.chatCount
        if(+group.chatCount !== +cachedGroup.chatCount) {
          hasNewMsgGroup.push(group.id)
        }
        return {...group, newChatCount, hasDelete: cachedGroup.hasDelete, chatCount, chatCountChanged}
      } else {
        return group
      }
    }).concat(cacheGroupList.filter(group => !currentGroupList.find(current => current.id === group.id)))
    return { result, hasNewMsgGroup }
  }
  return { getPublicGroupList, formatGroup, formatPrivateGroup, getCachePublicGroup, compareGroup }
}