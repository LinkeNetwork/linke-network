import styled from "styled-components"
import { create } from 'ipfs-http-client'
import { useEffect, useRef, useState } from 'react'
import multiavatar from '@beeprotocol/beemultiavatar/esm'
const client = create('https://ipfs.linke.network')
export default function UploadImage(props) {
  const { uploadBg, myAddress } = props
  const avatarRef = useRef()
  const [showLoading, setShowLoading] = useState(false)
  const [fileUrl, updateFileUrl] = useState('')
  const onChange = async (e) => {
    const file = e.target.files[0]
    try {
      setShowLoading(true)
      const added = await client.add(file)
      const url = `https://ipfs.linke.network/ipfs/${added.path}`
      setShowLoading(false)
      updateFileUrl(url)
      uploadBg(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  useEffect(() => {
    if(myAddress) {
      if(avatarRef && avatarRef?.current) {
        avatarRef.current.innerHTML = multiavatar(myAddress)
      }
    }
  }, [myAddress])
  return (
    <UploadImageContainer>
      <div className="bg-wrap">
        {
          showLoading &&
          <div className="iconfont icon-loading"></div>
        }
        {/* {
          !fileUrl && !showLoading &&
          <div className="iconfont icon-shangchuan"></div>
        }
        <input
          type="file"
          onChange={onChange}
        /> */}
        {
          fileUrl &&
          <img src={fileUrl} alt=""/>
        }
      </div>
      <div className="user-image-wrap">
        {/* <div className="iconfont icon-shangchuan"></div> */}
        <div ref={avatarRef}>
        </div>
      </div>
    </UploadImageContainer>
  )
}
const UploadImageContainer = styled.div`
.bg-wrap {
  z-index: 1;
  position: relative;
  background-color: rgba(0,0,0,.033);
  height: 10.125rem;
  border-top-right-radius: 0.9rem;
  border-top-left-radius: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: rgba(0,0,0,.075);
  }
  .iconfont{
    font-size: 24px;
    position: absolute;
    right: 30px;
    top: 30px;
    color: rgba(0,0,0,.4);
  }
  input {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.user-image-wrap {
  position: relative;
  width: 10rem;
  height: 10rem;
  border-radius: 100%;
  background: #fff;
  border: 0.5rem solid #fff;
  margin: calc(5rem * -1) auto 0;
  z-index: 2;
  div {
    background: rgba(0,0,0,.033);
    width: 100%;
    height: 100%;
    border-radius: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: rgba(0,0,0,.4);
    &:hover {
      background-color: rgba(0,0,0,.075);
    }
  }
}
`
