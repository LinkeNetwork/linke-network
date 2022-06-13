import React, { Component, useEffect, useState } from 'react'
import imgURL from '../../assets/images/logo.png';
import QRCode  from 'qrcode.react'
import html2canvas from 'html2canvas'
import { detectMobile } from '../../utils';
import useGlobal from '../../hooks/useGlobal';

export default function ShareInfo(props) {
  const { closeShareInfo, currentAddress, shareTextInfo } = props
  const { showShareContent } = useGlobal()
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
        if(!detectMobile()) {
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
    if(showShareContent) {
      canvasToHtml()
    }
  }, [showShareContent])
  return(
    <div className='mask' id='imageMask' onClick={() => closeShareInfo()}>
    <div className={`share-wrapper ${detectMobile() ? 'share-wrapper-client' : ''}`}>
      <div id="shareText" className='share-text-wrapper'>
        <div className='share-title-wrapper'>
          <img src={imgURL} className="logo-icon" alt="" />
          <div className='share-title'>
            <span>消</span>
            <span>息</span>
            <span>快</span>
            <span>讯</span>
          </div>
        </div>
        <div className='share-info'>{shareTextInfo}</div>
        <div className='qrcode-dom'>
          <QRCode
            renderAs="svg"
            value={`https://beeprotocol.xyz/${currentAddress}`}
            size={60}
            fgColor="#000"
          />
        </div>
        <div className='share-tips'>投资有风险，入市需谨慎。本资讯不作为投资理财建议。</div>
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