import styled from "styled-components"
import ProfileSvg from './ProfileSvg'
import ProfileInfo from './ProfileInfo'
import CollectionImage from './CollectionImage'
import { detectMobile } from "../../utils"
import './index.scss'
export default function ViewProfile(props) {
  const { urlParams, currentNetwork, profileId } = props
  return (
    <ViewProfileContaniner>
      <div className={`profile-wrap ${detectMobile() ? 'profile-wrap-client' : ''}`}>
        <div className={`profile-content ${detectMobile() ? 'profile-content-client' : ''}`}>
          <div className="profile-left">
            <ProfileSvg urlParams={urlParams} profileId={profileId}/>
            <CollectionImage />
          </div>
          <div className="profile-right">
            <ProfileInfo urlParams={urlParams} currentNetwork={currentNetwork}/>
          </div>
        </div>
      </div>
    </ViewProfileContaniner>
  )
}
const ViewProfileContaniner = styled.div`
// overflow-y: scroll;
// height: 100vh;
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
background: #fff;
// margin: 0 auto 70px;
// padding: 0 0 50px;
width: 100%;
@media (max-width: 1023px) {
  padding-top: 10px;
  }
`