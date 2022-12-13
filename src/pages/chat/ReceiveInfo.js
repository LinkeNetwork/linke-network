import styled from "styled-components"
import { Jazzicon } from '@ukstv/jazzicon-react'
import useGlobal from "../../hooks/useGlobal"
import { useEffect } from "react"
export default function ReceiveInfo(props) {
  const { currentRedEnvelopId } = props
  const { clientInfo } = useGlobal()
  const getReceiveInfo = async() => {
    const tokensQuery = `
    query{
      giveawayReceive(id: "`+  currentRedEnvelopId + `"){
        id,
        sender,
        count,
        amount,
        profile
      }
    }
    `
    const res = await clientInfo?.query(tokensQuery).toPromise()
    console.log(res, '=====>>>.')
  }
  useEffect(() => {
    getReceiveInfo()
  }, [])
  return(
    <ReceiveInfoContanier>
      <div className="top-cover"></div>
      <div className="sender-info">
        {/* <Jazzicon address={currentAddress} className="group-image" /> */}
        <span>Send by</span><span className="sender-name"></span>
        <div className="wishes-text">Best wishes</div>
        <div className="receive-num"></div>
      </div>
      <div className="receive-list">
        <div className="receive-list-item">
          <div className="left">
            <span className="avatar"></span>
            <span className="name"></span>
          </div>
          <div className="right"></div>
        </div>
      </div>
    </ReceiveInfoContanier>
  )
}

const ReceiveInfoContanier = styled.div`
.top-cover {
  background: rgb(200, 62,43);
}
`