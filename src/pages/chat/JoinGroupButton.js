import Modal from  '../../component/Modal'
import styled from "styled-components"
import { useState } from 'react'
import { PUBLIC_GROUP_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI } from '../../abi'
import { getDaiWithSigner } from '../../utils'
import useGroupMember from '../../hooks/useGroupMember'
import useGlobal from '../../hooks/useGlobal'
import Loading from '../../component/Loading'
import { ethers } from "ethers";
export default function JoinGroupButton(props) {
  const { setState } = useGlobal()
  const { getGroupMember } = useGroupMember()
  const { currentAddress, changeJoinStatus } = props
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState()
  const [name, setName] = useState()
  const changeNameInput = (e) => {
    setName(e.target.value)
  }
  const handleJoinRoom = async() => {
    const groupInfo = await getGroupMember(currentAddress)
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
  return (
    <JoinGroupButtonContainer>
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
      <div onClick={() => setShowJoinRoom(true)}>
        Join
      </div>
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