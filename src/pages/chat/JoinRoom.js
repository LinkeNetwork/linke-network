import { useState } from "react"

export default function JoinRoom(props) {
  const {showTips, getCurrentRoomInfo} = props
  const [roomAddress,setRoomAddress] = useState()
  const changeInput = (e) => {
    setRoomAddress(e.target.value)
  }
  const chatWithNewAddress = () => {
    getCurrentRoomInfo(roomAddress)
  }
  return (
    <div>
      <p>Enter an address (or .eth name) below to start a new chat</p>
      <div className="tips-wrapper">
        {
          showTips &&
          <font color="red">Tip: Please enter a valid 0x.. address or .eth name</font>
        }
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="e.g. 0x... or yourname.eth"
          value={roomAddress}
          onChange={changeInput}
        />
      </div>
      <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={chatWithNewAddress}>
        <i className="iconfont icon-liaotian me-1"></i>Start Chatting
      </button>
    </div>
  )
}