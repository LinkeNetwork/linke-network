import styled from "styled-components"
import Image from "../../component/Image"
import moreImage from '../../assets/images/more.svg'
import hoverImage from '../../assets/images/hover-more.svg'
import { detectMobile, getDaiWithSigner } from '../../utils'
import { PROFILE_ABI } from '../../abi'
import useGlobal from '../../hooks/useGlobal'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import React, { useState, useEffect } from 'react'
import 'react-photo-view/dist/react-photo-view.css'

export default function CollectionImage() {
  const {tokenId, currentNetworkInfo} = useGlobal()
  const [isHover, setIsHover] = useState(false)
  const [avatarUrl, setAvatar] = useState()
  const collectionList = [1, 2, 3]
  const getProfileBaseUrl = async (profileId) => {
    if(!profileId) return
    const res = await getDaiWithSigner(currentNetworkInfo?.ProfileAddress, PROFILE_ABI).tokenURI(profileId)
    const {image} = JSON.parse(res)
    setAvatar(image)
  }
  useEffect(() => {
    getProfileBaseUrl(tokenId)
  }, [tokenId])
  return (
    <CollectionImageContainer>
      <ul className="nft-wrap">
        <li>
          {
            avatarUrl && 
            <PhotoProvider className={`${!detectMobile() ? 'photo-provider-pc' : ''}`}>
              <PhotoView src={avatarUrl}>
                <Image src={avatarUrl} size={60.9}/> 
              </PhotoView>
            </PhotoProvider>
          }
        </li>
        {
          collectionList.map((item) => {
            return (
              <li key={item}>
              </li>
            )
          })
        }
      </ul>
      <div className="more-wrap" 
          onMouseEnter={() => { setIsHover(true) }}
          onMouseLeave={() => { setIsHover(false) }}
          >
        {
          !isHover && 
          <Image size={60.9} src={moreImage} />
        }
        {
          isHover && 
          <Image size={60.9} src={hoverImage} />
        }
      </div>
    </CollectionImageContainer>
  )
}
const CollectionImageContainer = styled.div`
 display: flex;
 margin-top: 10px;
 ul {
   display: flex;
 }
 li {
  border-radius: 4px;
  height: 60.9px;
  width: 60.9px;
  margin-right: 10px;
  animation: animation-c7515d 1.5s ease-in-out 0.5s infinite;
  background-color: rgba(0, 0, 0, 0.11);
  img {
    border-radius: 4px;
  }
 }
 .more-wrap {
  cursor: pointer;
 }
`