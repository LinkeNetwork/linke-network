import QRCode from 'qrcode.react'
import styled from 'styled-components'
import { detectMobile, getLocal } from "../../utils"
import { Jazzicon } from '@ukstv/jazzicon-react'
import GroupImage from '../../component/Image'
import html2canvas from 'html2canvas'
import { useEffect, useState } from 'react'
export default function ShareGroupCode(props) {
  const { currentAddress, currentRoomName, roomAvatar, closeShareGroup } = props
  const [canvasImage, setCanvasImage] = useState()
  const canvasToHtml = () => {
    html2canvas(document.querySelector("#shareText"), {
      backgroundColor: '#fff',
      scale: 2,
      useCORS: true,
    })
      .then((canvas) => {
        const dataImg = new Image()
        dataImg.src = canvas.toDataURL('image/png')
        const alink = document.createElement("a")
        alink.href = dataImg.src
        if (!detectMobile()) {
          document.body.appendChild(alink)
          alink.download = "share.jpg"
          alink.click()
          document.body.removeChild(alink)
        } else {
          setCanvasImage(dataImg.src)
        }
      })
      .catch((err) => {
        console.log('error:', err)
      })
  }
  useEffect(() => {
    if (detectMobile()) {
      canvasToHtml()
    }
  }, [])
  return (
    <ShareGroupCodeContainer className={detectMobile() ? 'code-wrapper-client' : ''}>
      <div className='code-header'>
        <i className='iconfont icon-arrow-left-circle' onClick={closeShareGroup}></i>
        <span className='name'>QR Code</span>
      </div>
      <div className='code-wrapper' id='shareText'>
        <div className='group-info'>
          <div className='user-image rounded-circle'>
            {
              !roomAvatar
                ? <Jazzicon address={currentAddress} className="group-image" />
                : <GroupImage src={roomAvatar} size={50} />
            }
          </div>
          <div className='name'>{currentRoomName}</div>
        </div>
        {
          canvasImage && detectMobile() &&
          <div className='share-wrapper'>
            <img src={canvasImage} className="canvas-image" alt='' />
          </div>
        }
        <QRCode
          renderAs="svg"
          value={`https://www.linke.network/chat/${currentAddress}/${getLocal('network')}`}
          size={240}
          fgColor="#000"
        />
      </div>
      {
        !detectMobile() && <div className='btn btn-lg btn-primary save-btn' onClick={() => canvasToHtml()}>Save QR Code</div>
      }
    </ShareGroupCodeContainer>
  )
}
const ShareGroupCodeContainer = styled.div`
&.code-wrapper-client {
  left: 0;
}
.save-btn {
  width: 300px;
  margin: 14px 0;
  position: relative;
  top: 51%;
  left: 50%;
  margin-left: -150px;
}
position: fixed;
right: 0;
left: 70%;
height: 100%;
background: rgb(237,236,238);
z-index: 101;
.code-header {
  width: 100%;
  background: #fff;
  justify-content: center;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  .iconfont {
    font-size: 28px;
    cursor: pointer;
  }
  .icon-more {
    transform: rotate(90deg);
  }
  .name {
    font-weight: bold;
  }
  .icon-arrow-left-circle {
    display: inherit;
    position: absolute;
    left: 14px;
  }
}
.group-info {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 20px;
  margin-bottom: 10px;
  .name {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
  }
  .group-image{
    width: 50px;
  }
}
.code-wrapper{
  border-radius: 10px;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 50%;
  margin-left: -150px;
  top: 50%;
  margin-top: -240px;
  width: 300px;
  height: 360px;
  background: #fff;
}
`