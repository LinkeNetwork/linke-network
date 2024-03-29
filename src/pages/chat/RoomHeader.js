import { Jazzicon } from '@ukstv/jazzicon-react';
import { detectMobile } from '../../utils';
import Image from "../../component/Image"
import intl from "react-intl-universal"
export default function RoomHeader(props) {
  const {showChat, currentRoomName, currentAddress, hiddenChat, getGroupMember, memberCount, roomAvatar, currentTabIndex} = props
  return (
    <div className={`right-header-content ${showChat ? 'translate-header-content' : ''}`}>
      {
        showChat && detectMobile() && window?.ethereum &&
        <i className='iconfont icon-arrow-left-circle' onClick={hiddenChat}></i>
      }

      <div className='right-header-left'>
        {
          currentAddress && 
          <div className='user-image rounded-circle'>
            {
              !roomAvatar 
                ?  <Jazzicon address={currentAddress} className="chat-image" /> 
                : <Image src={roomAvatar} size={35}/>
            }
          </div>
        }
        <div className='text-left'>
          <div className='room-name'>{currentRoomName}
            {
              memberCount > 0 &&
              <span className='member-num'>({memberCount}{intl.get('Members')})</span>
            }
          </div>
        </div>
      </div>
      {
        +currentTabIndex === 0 &&
        <div className={`group-more ${detectMobile() ? 'group-more-client': ''}`} onClick={getGroupMember}>
          <span className='iconfont icon-more'></span>
        </div>
      }
    </div>
  )
}