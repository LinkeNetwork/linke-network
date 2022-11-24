import QRCode from 'qrcode.react'
import styled from 'styled-components'
import { getLocal } from '../../utils/index'
import { detectMobile } from "../../utils"
export default function ShareGroupCode(props) {
  const { currentAddress } = props
  return(
    <ShareGroupCodeContainer className={detectMobile() ? 'code-wrapper-client': ''}>
      <div className='code-wrapper'>
        <QRCode
          renderAs="svg"
          value={`https://www.linke.network/chat/${currentAddress}/${getLocal('network')}`}
          size={200}
          fgColor="#000"
        />
      </div>
    </ShareGroupCodeContainer>
  )
}
const ShareGroupCodeContainer = styled.div`
&.code-wrapper-client {
  left: 0;
}
position: fixed;
right: 0;
left: 70%;
height: 100%;
background: rgb(237,236,238);
z-index: 101;
.code-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 50%;
  margin-left: -130px;
  top: 50%;
  margin-top: -130px;
  width: 260px;
  height: 260px;
  background: #fff;
}
`