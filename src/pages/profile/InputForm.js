import styled from "styled-components"
import { create } from 'ipfs-http-client'
// import { Buffer } from 'buffer/';
import { useHistory } from 'react-router-dom'
import {PROFILE_ABI} from '../../abi'
import UploadImage from './UploadImage'
import { useState } from "react"
import UserInfo from './UserInfo'
import Loading from '../../component/Loading'
import multiavatar from '@beeprotocol/beemultiavatar/esm'
import { getContractConnect, getLocal } from '../../utils'
import useGlobal from "../../hooks/useGlobal"

// const projectId = '2DCSZo1Ij4J3XhwMJ2qxifgOJ0P';
// const projectSecret = '2979fb1378a5ec0a0dfec5f97a4fba96';
// const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = create('https://ipfs.linke.network')

export default function InputForm(props) {
    const { myAddress, showNav, roomAddress } = props
    const { currentNetworkInfo } = useGlobal()
    const history = useHistory()
    // const [bgImage, setBgImage] = useState()
    const [showLoading, setShowLoading] = useState(false)

    const handleSave = async() => {
    setShowLoading(true)
    const info = await client.add(multiavatar(myAddress))

    const avatarUrl = `https://ipfs.linke.network/ipfs/${info.path}`
    const expandInfo = []
    try {
        const address = currentNetworkInfo?.ProfileAddress
       // string memory name, string memory description, string memory image, MapInfo[] memory attribute, string memory avatar, string memory name_, string memory symbol_
        const tx = await getContractConnect(address, PROFILE_ABI).register(name, describe, expandInfo, avatarUrl, "FOLLOW", "FOLLOW")
        console.log(tx, 'tx====')
        await tx.wait()
        setName('')
        setDescribe('')
        setShowLoading(false)
        if(!showNav){
          const network = getLocal('network')
          history.push({
            pathname: `/chat/${roomAddress}/${network}?share=1`,
            state: {
              share: 1,
              hasProfile: true
            }
          })
        } else {
          window.location.reload()
          history.push('/profile')
        }
   } catch {
        setShowLoading(false)
   }
  }
  const [name, setName] = useState()
  const [describe, setDescribe] = useState()
  const changeNameInput = (e) => {
    setName(e.target.value)
  }
  const changeDescribeInput = (e) => {
    setDescribe(e.target.value)
  }
  return(
    <InputFormContainer>
      <div className="create-box">
        <UploadImage myAddress={myAddress} />
        <UserInfo myAddress={myAddress}/>
        <div className="theme-wrap"></div>
      </div>
      <div className="form-wrap">
        <legend className="name">Name
          <span>Required</span>
        </legend>
        <div className="name-info">What do you want to be known as? This can be either you personally, or the name of a project you’re looking to create.</div>
        <input
          type="text"
          placeholder=""
          value={name}
          onChange={val => changeNameInput(val)}
        />
      </div>
      <div className="form-wrap">
        <legend className="name">Describe
          <span>Required</span>
        </legend>
        <div className="name-info">You can briefly describe yourself, your description will also be deployed on the NFT, and these descriptions will increase your trust.</div>
        <input
          type="text"
          placeholder=""
          value={describe}
          onChange={val => changeDescribeInput(val)}
        />
      </div>
      <button className="submit-btn" onClick={handleSave}>Save</button>
      {
        showLoading && <Loading />
      }

    </InputFormContainer>
  )
}
const InputFormContainer = styled.div`
// padding-top: 2rem;
.form-wrap {
  margin-bottom: 2.5rem;
}
input {
  width: 100%;
  outline: none;
  border: 0.125rem solid rgba(0,0,0,.075);
  width: 100%;
  height: 3rem;
  border-radius: 1rem;
  padding: 0 1rem;
  color: rgba(0,0,0,.8);
  font-weight: bold;
  font-size: 1.0625rem;
}
.name {
  display: flex;
  align-items: center;
  &-info {
    padding-left: 10px;
    font-size: 1.0625rem;
    margin: 0.8rem 0;
    color: rgba(0,0,0,.6);
  }
}
legend {
  padding-left: 10px;
  font-weight: 500;
  font-size: 1.3125rem;
  span {
    margin-left: 10px;
    background: rgba(0,0,0,.125);
    border-radius: 20px;
    padding: 0 0.5rem;
    font-size: .9375rem;
    font-weight: 500;
  }
}
.submit-btn{
  background-color: #FFCE00;
  width: 100%;
  padding: 15px;
  font-weight: bold;
  font-size: 1.0625rem;
  border-radius: 15px;
  color: #fff;
}
@media (min-width: 640px) {
  legend {
    font-size: 1.875rem;
  }
}
`
