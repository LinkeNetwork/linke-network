import { getLocal, getClient } from '../utils/index'
import useGlobal from './useGlobal'
export default function useGroupList() {
  const { setState } = useGlobal()
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
    setState({
      groupLists: groupInfos
    })
    return res?.data?.groupUser
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

  return { getPublicGroupList, formatGroup, formatPrivateGroup }
}