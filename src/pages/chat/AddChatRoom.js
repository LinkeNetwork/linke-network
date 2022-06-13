const dropdownList = [
  {
    name: 'Start New chat',
    id: 'new'
  },
  {
    name: 'Creat Chatting Room',
    id: 'creat'
  },
  // {
  //   name: 'Search Member',
  //   id: 'search'
  // }
]
export default function AddChatRoom(props) {
  const {showSettingList, onClickSetting, onClickSelect} = props
  return (
    <div className='add-icon-wrapper'>
      <div className="dropdown">
        <button className='btn btn-sm btn-light' onClick={onClickSetting} id="addBtns">
          <i className="iconfont icon-add btn-light" id="addIcon"></i>
        </button>
        {
          showSettingList &&
          <ul>
            {
              dropdownList.map(v => {
                return (
                  <li key={v.id} onClick={onClickSelect}>
                    <div className="dropdown-item" id={`${v.id}Item`}>
                      {/* <i className={`iconfont me-1 ${v.iconName}`} id={`${v.id}Icon`}></i> */}
                      <span className="icon-name" id={`${v.id}Name`}>{v.name}</span>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        }
      </div>
    </div>
  )
}