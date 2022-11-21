import React, { Component, useEffect, useState } from 'react'
import imgURL from '../../assets/images/logo.png';
import QRCode from 'qrcode.react'
import html2canvas from 'html2canvas'
import { detectMobile, getLocal } from '../../utils';
import useGlobal from '../../hooks/useGlobal';
export default function ShareInfo(props) {
  const { closeShareInfo, currentAddress, shareTextInfo, currentNetwork } = props
  const { showShareContent, clientInfo } = useGlobal()
  const [canvasImage, setCanvasImage] = useState()
  const [shareInfoStyle, setShareInfoStyle] = useState({})
  const getCanvasStyle = async () => {
    if (!currentAddress?.toLowerCase()) return
    const tokensQuery = `
      query{
        groupInfo(id: "`+ currentAddress?.toLowerCase() + `"){
          id,
          description,
          name,
          avatar,
          userCount,
          chatCount,
          style
        }
      }
    `
    const res = await clientInfo.query(tokensQuery).toPromise()
    let fetchData = res?.data?.groupInfo
    console.log(fetchData, '===fetchDatafetchData=>>>>')
    if(fetchData?.style) {
      const shareInfoStyle = JSON.parse(fetchData.style)
      setShareInfoStyle(shareInfoStyle)
    }
  }
  const canvasToHtml = () => {
    html2canvas(document.querySelector("#shareText"), {
      backgroundColor: shareInfoStyle.backgroundColor,
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
    if (showShareContent && detectMobile()) {
      canvasToHtml()
    }
  }, [showShareContent])
  useEffect(() => {
    getCanvasStyle()
  }, [currentAddress])
  return (
    <div className='mask' id='imageMask' onClick={() => closeShareInfo()}>
      <div className={`share-wrapper ${detectMobile() ? 'share-wrapper-client' : ''}`} style={{backgroundColor: `${shareInfoStyle.backgroundColor}`}}>
        <div id="shareText" className='share-text-wrapper'>
          {
            !shareInfoStyle.avatar &&
            <div className='share-title-wrapper'>
              <img src={imgURL} className="logo-icon" alt="" />
              <div className='share-title'>
                {
                  currentAddress?.toLowerCase() === '0x8e3687d008571189c21d72b5f27a7f8cda6248d1'
                    ? <div className='title-wrapper'>
                      <span>币</span>
                      <span>头</span>
                      <span>条</span>
                    </div>
                    : <div className='title-wrapper'>
                      <span>消</span>
                      <span>息</span>
                      <span>快</span>
                      <span>讯</span>
                    </div>
                }
              </div>
            </div>
          }
          {
            shareInfoStyle.avatar &&
            <div className='logo-wrapper'>
              <img src={shareInfoStyle.avatar} />
            </div>
          }

          <div className='share-info'>{shareTextInfo}</div>
          <div className='info-wrapper'>
            <div className='title-wrapper'>
              <div className='bottom-title'>{shareInfoStyle?.title}</div>
              <div className='bottom-sub-title'>{shareInfoStyle?.subTitle}</div>
            </div>
            <div className='qrcode-dom' style={{backgroundImage: `url(${shareInfoStyle?.qrCodeBg})`}}>
              <QRCode
                renderAs="svg"
                value={`https://www.linke.network/chat/${currentAddress}/${getLocal('network')}`}
                size={60}
                fgColor="#000"
              />
            </div>
          </div>
          {
            shareInfoStyle?.footerTips &&
            <div className='share-tips'>{shareInfoStyle?.footerTips}</div>
          }
        </div>
        <div onClick={() => canvasToHtml()} className="save-image-btn">保存图片</div>
      </div>
      {
        canvasImage && detectMobile() &&
        <div className='share-wrapper'>
          <img src={canvasImage} className="canvas-image" alt='' />
        </div>
      }
    </div>
  )
}