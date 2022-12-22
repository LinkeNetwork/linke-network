import useGlobal from "./useGlobal"

export default function useReceiveInfo() {
  const { clientInfo } = useGlobal()
  const getReceiveInfo = async(currentRedEnvelopId) => {
    const tokensQuery = `
    {
      giveaways(where: {id: "`+  currentRedEnvelopId + `"}){
        sender,
        token,
        lastCount,
        amount,
        content,
        count,
        profile {
          name,
          avatar
        }
        token,
        receiveProfile{
          id,
          gid,
          sender,
          count,
          amount,
          profile{
            name, 
            avatar
          }
        }
      }
    }
    `
    const res = await clientInfo?.query(tokensQuery).toPromise()
    return res?.data?.giveaways[0].lastCount
  }

  return { getReceiveInfo}
}