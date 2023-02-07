import Modal from  '../../component/Modal'
import styled from "styled-components"
import { useEffect, useState } from 'react'
import { PUBLIC_GROUP_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI } from '../../abi'
import { getDaiWithSigner } from '../../utils'
import useGroupMember from '../../hooks/useGroupMember'
import useGlobal from '../../hooks/useGlobal'
import Loading from '../../component/Loading'
import { ethers } from "ethers"
import { useLocation, useHistory } from 'react-router-dom'
import useProfile from '../../hooks/useProfile'
export default function JoinGroupButton(props) {
  const { setState, accounts } = useGlobal()
  const locations = useLocation()
  const history = useHistory()
  const { getProfileStatus } = useProfile()
  const { getGroupMember } = useGroupMember()
  const { currentAddress, changeJoinStatus, hasAccess } = props
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState()
  const [name, setName] = useState()
  const [showCanJoinTips, setCanJoinTips] = useState(false)
  const skip = 0
  const changeNameInput = (e) => {
    setName(e.target.value)
  }
  const handleJoinRoom = async() => {
    const groupInfo = await getGroupMember(currentAddress, skip)
    const groupType = groupInfo?._type
    setShowLoading(true)
    try {
      if(groupType) {
        const abi = groupType == 3 ?  PUBLIC_SUBSCRIBE_GROUP_ABI : PUBLIC_GROUP_ABI
        const tx = await getDaiWithSigner(currentAddress, abi).joinRoom(name)
        setTransactionHash(tx.hash)
        console.log(tx, 'tx====')
        await tx.wait()
        setState({
          hasCreateRoom: true
        })
        setShowLoading(false)
        changeJoinStatus(groupType)
      }
    } catch (error) {
      debugger
      console.log(error, '==error=======')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const receipt = await provider.getTransactionReceipt(transactionHash)
      console.log(receipt, 'receipt======')
      const hash = receipt?.logs[1]?.transactionHash
      if(hash) {
        setState({
          hasCreateRoom: true
        })
        setShowLoading(false)
        changeJoinStatus(groupType)
      }
    }
  }
  const handleJoinRoomPermissions = async() => {
    const hasCreateProfile = await getProfileStatus(accounts)
    const isShare = locations.search.split('share=')[1]
    if(isShare && !hasCreateProfile) {
      setCanJoinTips(true)
    } else {
      setShowJoinRoom(true)
    }
  }
  const handleJumpProfile = () => {
    history.push({
      pathname: `/profile/${accounts}`,
      state: {
        room: currentAddress,
        share: 1
      }
    })
  }
  return (
    <JoinGroupButtonContainer>
      {
        <Modal title="Tips" visible={showCanJoinTips} onClose={() => { setCanJoinTips(false) }}>
          <div>You should create profile first</div>
          <div className='btn-operate-award' style={{marginTop: '16px'}}>
            <div className='btn btn-primary' onClick={handleJumpProfile}>Confirm</div>
            <div className='btn btn-light' onClick={() => { setCanJoinTips(false) }}>Cancel</div>
          </div>
        </Modal>
      }
      <Modal title="Join Room" visible={showJoinRoom} onClose={() => setShowJoinRoom(false)}>
      <div className="form-wrap">
          <legend className="name" style={{fontSize: '13px', fontWeight: 'bold'}}>Nick Name
            {/* <span>Required</span> */}
          </legend>
          <input
            type="text"
            placeholder=""
            className="form-control form-control-lg"
            style={{margin: '10px 0'}}
            value={name}
            onChange={val => changeNameInput(val)}
          />
        </div>
        <button className="submit-btn btn btn-lg btn-primary" onClick={handleJoinRoom} style={{width: '100%', margin: '10px 0'}}>
          Join Room
        </button>
      </Modal>
      {
        hasAccess!== undefined &&
        <div onClick={handleJoinRoomPermissions}>
          Join
        </div>
      }
      {
        showLoading && <Loading />
      }
    </JoinGroupButtonContainer>
  )
}
const JoinGroupButtonContainer = styled.div`
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
  color: #FFCE00;
  cursor: pointer;
  
`