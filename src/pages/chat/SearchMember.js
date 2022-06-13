import { useState } from "react"
export default function SearchMember(props) {
  const [roomAddress,setRoomAddress] = useState()
  const changeInput = (e) => {
    setRoomAddress(e.target.value)
  }
  const handleSearchMember = () => {

  }
  return (
    <div>
       <div className="input-group mb-3">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder=""
          value={roomAddress}
          onChange={changeInput}
        />
      </div>
      <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={handleSearchMember}>
        <i className="iconfont icon-search me-1"></i>Search Member
      </button>
    </div>
  )
}