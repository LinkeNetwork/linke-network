import { useState } from "react"
import intl from "react-intl-universal"
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
      <p>{intl.get('JoinInRoomTips')}</p>
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
          placeholder={intl.get('JoinInRoomPlaceholder')}
          value={roomAddress}
          onChange={changeInput}
        />
      </div>
      <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={chatWithNewAddress}>
        <i className="iconfont icon-liaotian me-1"></i>{intl.get('StartChatting')}
      </button>
    </div>
  )
}