import useGlobal from "./useGlobal"

export default function useReceiveInfo() {
  const { clientInfo } = useGlobal()
  const getReceiveInfo = async(currentRedEnvelopId, giveawayVersion) => {
    const tokensQuery = `
    {
      ${giveawayVersion}(where: {id: "`+  currentRedEnvelopId + `"}){
        sender,
        token,
        lastCount,
        amount,
        content,
        count,
        haveToken,
        haveAmount,
        scoreToken,
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
    const giveawayInfos = giveawayVersion === 'giveawayV2S' ? (res?.data?.giveawayV2S[0]) : (res?.data?.giveaways[0])
    return giveawayInfos
  }

  return { getReceiveInfo}
}
