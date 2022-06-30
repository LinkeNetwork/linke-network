import React, { Component, useEffect, useState } from 'react'
import imgURL from '../../assets/images/logo.png';
import QRCode from 'qrcode.react'
import html2canvas from 'html2canvas'
import { detectMobile, getLocal } from '../../utils';
import useGlobal from '../../hooks/useGlobal';
import { createClient } from 'urql'
export default function ShareInfo(props) {
  const { closeShareInfo, currentAddress, shareTextInfo, currentGroupType } = props
  const { showShareContent } = useGlobal()
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
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const res = await client.query(tokensQuery).toPromise()
    let fetchData = res?.data?.groupInfo
    const data = { //https://infura-ipfs.io/ipfs/QmcFkvsVyPphrUjNzfK9mJcK7b9aTxiXdnFzySxShJsWxL e96836
      avatar: "https://infura-ipfs.io/ipfs/QmWJdE2SyewFJFkE1pSPaXFZB256HqfYxkYJMKCJ9d6ywW",
      chatCount: "0",
      description: "。。。",
      id: "0xbd66f2c64094c40bf0af22196bfb27753a254f27",
      name: "快讯5",
      style: "{\"avatar\":\"\",\"backgroundColor\":\"#eee\",\"title\":\"7X24h获取最新最热的资讯\",\"footerTips\":\"投资有风险，入市需谨慎。本资讯不作为投资\",\"qrCodeBg\":\"https://infura-ipfs.io/ipfs/Qma1B5337SKNDCMTps62zdSsZoe9WW9Zvz6SnpHHGVKa7r\",\"subTitle\":\"全球数字经济领先媒体\"}",
      userCount: "1",
      __typename: "GroupInfo",
    }
    const shareInfoStyle = JSON.parse(data.style)
    setShareInfoStyle(shareInfoStyle)
    console.log(shareInfoStyle, shareInfoStyle.avatar, '00100===>>>')

    // const shareInfoStyle = JSON.parse(fetchData.style)
    // setShareInfoStyle(shareInfoStyle)
    console.log(fetchData, '===fetchDatafetchData=>>>>')
  }
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
                value={`https://www.linke.network/${currentAddress}`}
                size={60}
                fgColor="#000"
              />
            </div>
          </div>
          {
            shareInfoStyle?.footerTips &&
            <div className='share-tips'>{shareInfoStyle?.footerTips}</div>
          }
          {
            currentGroupType != 3 && <div className='share-tips'>投资有风险，入市需谨慎。本资讯不作为投资理财建议。</div>
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