import useGlobal from "./useGlobal"
import { getLocal } from "../utils"
import { createClient } from 'urql'
export default function useReceiveInfo() {
  const { networks } = useGlobal()
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
    const item = networks.filter(i=> i.symbol === getLocal('network'))[0]
    if(!item) return
    const client = createClient({
      url: item?.APIURL
    })
    const res = await client.query(tokensQuery).toPromise()
    const giveawayInfos = giveawayVersion === 'giveawayV2S' ? (res?.data?.giveawayV2S[0]) : (res?.data?.giveaways[0])
    return giveawayInfos
  }

  return { getReceiveInfo}
}
