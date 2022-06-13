import Modal from  '../../component/Modal'
import styled from "styled-components"
import { useState } from 'react'
import { PUBLIC_GROUP_ABI } from '../../abi'
import { getDaiWithSigner } from '../../utils'
import useGlobal from '../../hooks/useGlobal'
import Loading from '../../component/Loading'
export default function JoinGroupButton(props) {
  const { setState } = useGlobal()
  const { currentAddress, changeJoinStatus } = props
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [name, setName] = useState()
  const changeNameInput = (e) => {
    setName(e.target.value)
  }
  const handleJoinRoom = async() => {
    setShowLoading(true)
    const tx = await getDaiWithSigner(currentAddress, PUBLIC_GROUP_ABI).joinRoom(name)
    console.log(tx, 'tx====')
    await tx.wait()
    setState({
      hasCreateRoom: true
    })
    setShowLoading(false)
    changeJoinStatus()
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