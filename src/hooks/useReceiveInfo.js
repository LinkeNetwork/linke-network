import { createClient } from 'urql'
export default function useReceiveInfo() {
  const getReceiveInfo = async(currentRedEnvelopId, giveawayVersion, graphUrl, version) => {
    const tokensQuery = `
    {
      ${giveawayVersion}(where: {id: "`+  currentRedEnvelopId + `"}){
        sender,
        token,
        lastCount,
        amount,
        content,
        count,
        ${giveawayVersion === "giveaways" ? "" : "haveToken,"}
        ${giveawayVersion === "giveaways" ? "" : "haveAmount,"}
        ${giveawayVersion === "giveaways" ? "" : "scoreToken,"}
        ${version === "v3" ? "scoreAmount," : ""}
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
    const client = createClient({
      url: graphUrl
    })
    const res = await client.query(tokensQuery).toPromise()
    const giveawayInfos = giveawayVersion === 'giveawayV2S' ? (res?.data?.giveawayV2S[0]) : (res?.data?.giveaways[0])
    return giveawayInfos
  }

  return { getReceiveInfo}
}
