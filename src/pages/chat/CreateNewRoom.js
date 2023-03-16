import { useState } from "react"
import { create } from 'ipfs-http-client'
import styled from "styled-components"
import useGlobal from '../../hooks/useGlobal'
import { getDaiWithSigner, getLocal } from '../../utils'
import { GROUP_FACTORY_ABI } from '../../abi'
import Loading from '../../component/Loading'
import multiavatar from '@beeprotocol/beemultiavatar/esm'
import { ethers } from "ethers";
import Select from 'react-select'
import Message from "../../component/Message"
import { Buffer } from 'buffer/';
import { useHistory } from 'react-router-dom'

const projectId = '2DCSZo1Ij4J3XhwMJ2qxifgOJ0P';
const projectSecret = '2979fb1378a5ec0a0dfec5f97a4fba96';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

export default function CreateNewRoom(props) {
  const { setState, currentNetworkInfo } = useGlobal()
  const { createNewRoom, hiddenCreateInfo } = props
  const history = useHistory()
  const [name, setName] = useState()
  const [shoMask, setShoMask] = useState(false)
  const [describe, setDescribe] = useState('')
  const [currentGroup, setCurrentGroup] = useState()
  const [currentGroupType, setCurrentGroupType] = useState()
  const [groupLogo, setGroupLogo] = useState('')
  const [showLoading, setShowLoading] = useState(false)
  const [showSubLoading, setShowSubLoading] = useState(false)
  const [currentColor, setCurrentColor] = useState('#ffffff')
  const [subTitle, setSubTitle] = useState('')
  const [footerTitle, setFooterTitle] = useState('')
  const [footerTips, setFooterTips] = useState('')
  const [qrCodeBg, setQrCodeBg] = useState('')
  const [contentHeight, setContentHeight] = useState('auto')
  const [showExplain1, setShowExplain1] = useState(false)
  const [showExplain2, setShowExplain2] = useState(false)
  const [showExplain3, setShowExplain3] = useState(false)
  const [showTypeError, setShowTypeError] = useState(false)
  const [showNameError, setShowNameError] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [transactionHash, setTransactionHash] = useState()
  const typeList = [
    {
      label: 'Public Group',
      value: 4
    },
    {
      label: 'Subscribe Group',
      value: 3
    },
  ]
  const handleShowExplain = (type) => {
    switch(type) {
      case 1:
        setShowExplain1(true)
        setTimeout(() => {
          setShowExplain1(false)
        }, 2000);
         break;
      case 2:
        setShowExplain2(true)
        setTimeout(() => {
          setShowExplain2(false)
        }, 2000);
         break;
      case 3:
        setShowExplain3(true)
        setTimeout(() => {
          setShowExplain3(false)
        }, 2000);
        break;
    }
  }
  const handleCreate = async () => {
    if(!currentGroup) {
      setShowTypeError(true)
    }
    if(handleBlur()) {
      setMessageText('Please fill in the required fields')
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
      }, 2000)
      return
    }
    setShoMask(true)
    const avatar = getLocal('account') + name
    const info = await client.add(multiavatar(avatar))
    const avatarUrl = `https://linke.infura-ipfs.io/ipfs/${info.path}`
    const style = {
      avatar: groupLogo,
      backgroundColor: currentColor,
      title: footerTitle,
      subTitle: subTitle,
      footerTips: footerTips,
      qrCodeBg: qrCodeBg
    }
    const name_ = 'group'
    const symbol_ = 'GROUP'
    debugger
    const styleList = JSON.stringify(style)
    try {
      debugger
      const params = ethers.utils.defaultAbiCoder.encode(["string", "string", "string", "string", "string", "string"], [name, describe, avatarUrl, styleList, name_, symbol_]);
      const tx = await getDaiWithSigner(currentNetworkInfo?.GroupProfileAddress, GROUP_FACTORY_ABI).mint(currentGroupType, params)
      setTransactionHash(tx.hash)
      let callback = await tx.wait()
      history.push(`/chat/${callback.logs[0].address}`)
      hiddenCreateInfo()
      setState({
        groupType: currentGroupType,
        hasCreateRoom: true,
        transactionRoomHash: callback?.transactionHash
      })
      createNewRoom(callback.logs[0].address, name, currentGroupType)
      console.log('callback', callback, callback.logs[0].address)
      console.log(tx)
    } catch (error) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const receipt = await provider.getTransactionReceipt(transactionHash)
      const hash = receipt?.logs[1]?.transactionHash
      if(hash) {
        hiddenCreateInfo()
        setState({
          hasCreateRoom: true
        })
        createNewRoom(receipt?.logs[1]?.address, name)
      }
      setShoMask(false)
    }

  }
  const handleSelectChange = (val) => {
    console.log(val, 'handleSelectChange')
    if (val.value == 3) {
      setContentHeight('500px')
    }
    setCurrentGroup(val)
    setCurrentGroupType(val.value)
    setShowTypeError(false)
  }
  const uploadLogo = async (e, type) => {
    const file = e.target.files[0]
    try {
      setShowLoading(true)
      const added = await client.add(file)
      const url = `https://linke.infura-ipfs.io/ipfs/${added.path}`
      if (type === 1) {
        setGroupLogo(url)
        setShowLoading(false)
      } else {
        setQrCodeBg(url)
        setShowSubLoading(false)
      }
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  const handleBlur = () => {
    if(!name) {
      setShowNameError(true)
      return true
    } else {
      setShowNameError(false)
      return false
    }
  }
  return (
    <CreateNewRoomContainer>
      {
        showMessage &&
        <Message messageText={messageText}/>
      }
      <div className="form-content" style={{ height: `${contentHeight}` }}>
        <div className="form-wrap">
          <legend className="name">Room Type
            <span>Required</span>
          </legend>
          <Select
            value={currentGroup}
            onChange={handleSelectChange}
            // onBlur={handleSelectBlur}
            options={typeList}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: '#dee2e6',
                primary: '#333',
              },
            })}
          />
          {
            showTypeError &&
            <div className="error-tip">Name Can't be empty</div>
          }
        </div>
        <div className="form-wrap">
          <legend className="name">Name
            <span>Required</span>
          </legend>
          <input
            type="text"
            placeholder=""
            className="form-control form-control-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleBlur}
          />
          {
            showNameError &&
            <div className="error-tip">Name Can't be empty</div>
          }
        </div>
        {
          currentGroupType == 3 &&
          <div>
            <div className="form-wrap">
              <legend className="name">Logo
              </legend>

              {
                showLoading && <div className="iconfont icon-loading"></div>
              }
              <div style={{ position: 'relative' }}>
                {
                  !groupLogo && !showLoading && <div className="iconfont icon-shangchuan">Upload</div>
                }
                <input
                  type="file"
                  className="upload-logo"
                  onChange={(e) => uploadLogo(e, 1)}
                />
                {
                  groupLogo &&
                  <img src={groupLogo} style={{ width: '100%' }} />
                }
              </div>
            </div>
            <div className="form-wrap">
              <legend className="name">BackgroundColor
              </legend>
              <input
                type="color"
                placeholder=""
                onChange={(e) => setCurrentColor(e.target.value)}
                value={currentColor}
              />
            </div>
            <div className="form-wrap">
              <div className="legend-wrapper">
                <legend className="name">Footer Title
                </legend>
                <span className="iconfont icon-prompt" onClick={() => handleShowExplain(1)}></span>
                {
                  showExplain1 &&
                  <img src="https://linke.infura-ipfs.io/ipfs/QmZk1Rd98aeVUCGtPe9uT5iKXFgobLjfdNBERf3msDAud1" />
                }
              </div>
              <input
                type="text"
                placeholder=""
                className="form-control form-control-lg"
                value={footerTitle}
                onChange={(e) => setFooterTitle(e.target.value)}
              />
            </div>
            <div className="form-wrap">
              <div className="legend-wrapper">
                <legend className="name">Footer Sub Title
                </legend>
                <span className="iconfont icon-prompt" onClick={() => handleShowExplain(2)}></span>
                {
                  showExplain2 &&
                  <img src="https://linke.infura-ipfs.io/ipfs/QmdJQKnqvSeDAiyyBAxExjQSPdkYL6eo4yDEAMk1m6iaEG" />
                }
              </div>
              <input
                type="text"
                placeholder=""
                className="form-control form-control-lg"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
              />
            </div>
            <div className="form-wrap">
              <div className="legend-wrapper">
                <legend className="name">Footer Tips
                </legend>
                <span className="iconfont icon-prompt" onClick={() => handleShowExplain(3)}></span>
                {
                  showExplain3 &&
                  <img src="https://linke.infura-ipfs.io/ipfs/Qme2MXxFhnFRMFT6yfrz7GvVabPKkHHaQXvmbZF2g2KYET" />
                }
              </div>
              <input
                type="text"
                placeholder=""
                className="form-control form-control-lg"
                value={footerTips}
                onChange={(e) => setFooterTips(e.target.value)}
              />
            </div>
          </div>
        }
        <div className="form-wrap">
          <legend className="name">Describe
          </legend>
          <textarea
            type="text"
            className="form-control form-control-lg"
            placeholder=""
            value={describe}
            onChange={(e) => { setDescribe(e.target.value) }}
          />
        </div>
      </div>

      <button className="submit-btn btn btn-lg btn-primary" onClick={() => handleCreate()}>
        Create New Room
      </button>
      {
        shoMask &&
        <Loading />
      }
    </CreateNewRoomContainer>
  )
}
const CreateNewRoomContainer = styled.div`
padding-bottom: 20px;
.form-content {
  overflow: auto;
  // height: 500px;
  margin-bottom: 20px;
  padding-right: 20px;
}
.form-wrap {
  position: relative;
  margin: 15px 0;
  .upload-logo {
    opacity: 0;
    width: 100%;
  }
  .upload-logo {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
}
  }
  .icon-shangchuan{
    width: 140px;
    color: #fff;
    background-color: #FFCE00;
    border-color: #FFCE00;
    text-align: center;
    padding: 4px 0;
    border-radius: 0.375rem;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    span {
      margin-left: 10px;
      background: rgba(0,0,0,.125);
      border-radius: 20px;
      padding: 0 0.5rem;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.submit-btn{
  width: 100%;
}
.legend-wrapper {
  position: relative;
  display: flex;
  img {
    width: 200px;
    position: absolute;
    z-index: 10;
    right: 0;
    top: -120px;
  }
}
.error-tip {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
`
