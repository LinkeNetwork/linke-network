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
      <div className="receive-wrapper">
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
      </div>
    </ReceiveInfoContanier>
  )
}

const ReceiveInfoContanier = styled.div`
position: fixed;
left: 0;
right: 0;
top: 0;
bottom: 0;
display: flex;
justify-content: center;
background: rgba(0, 0, 0, 0.6);
z-index: 99999;
transition: 0.4s;
.receive-wrapper {
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  width: 360px;
  height: 500px;
  background-size: 100%;
  background-repeat: no-repeat;
  border-radius: 10px;
  top: 50%;
  margin-top: -250px;
  animation: bounceIn .3s ease;
}
.top-cover {
  background: rgb(224,96,76);
  border-radius: 0 0 185px 185px;
  width: 420px;
  height: 80px;
  margin-left: -30px;
}
`