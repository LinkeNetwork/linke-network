import { Jazzicon } from '@ukstv/jazzicon-react';
import { detectMobile } from '../../utils';
import Image from "../../component/Image"
export default function RoomHeader(props) {
  const {showChat, currentRoomName, currentAddress, userCount, hiddenChat, getGroupMember, memberCount, roomAvatar} = props
  return (
    <div className={`right-header-content ${showChat ? 'translate-header-content' : ''}`}>
      {
        showChat &&
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
              <span className='member-num'>({memberCount})</span>
            }
          </div>
        </div>
      </div>
      <div className={`group-more ${detectMobile() ? 'group-more-client': ''}`} onClick={getGroupMember}>
        <span className='iconfont icon-more'></span>
      </div>
    </div>
  )
}