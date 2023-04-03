import intl from "react-intl-universal"
export default function AddChatRoom(props) {
  const {showSettingList, onClickSetting, onClickSelect} = props
  const dropdownList = [
    {
      name: intl.get('JoinInNewRoom'),
      id: 'new'
    },
    {
      name: intl.get('CreateChattingRoom'),
      id: 'creat'
    }
  ]
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