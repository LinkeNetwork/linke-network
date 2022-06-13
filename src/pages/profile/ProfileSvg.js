import styled from "styled-components"
import useGlobal from "../../hooks/useGlobal"
import Image from "../../component/Image"
export default function ProfileSvg() {
  const { profileAvatar } = useGlobal()
  return (
    <ProfileSvgContanier>
      <div className="profile-avatar">
        <div className="svg-box">
          {
            profileAvatar && 
            <Image src={profileAvatar} size={345}/>
          }
        </div>
      </div>
    </ProfileSvgContanier>
  )
}
const ProfileSvgContanier = styled.div`
position: sticky;
  z-index: 1;
  width: 345px;
  height: 345px;
  position: relative;
.svg-box {
  // padding: 20px;
  width: 345px;
  height: 345px;
  background-color: rgba(0,0,0,0.11);
  border-radius: 100%;
}
.profile-avatar {
  position: relative;
  transition: all .3s ease;
  border-radius: 10px;
  overflow: hidden;
  &:hover {
    border-radius: 40px;
    transform: rotate(-5deg);
    box-shadow: 0 80px 120px rgb(0 0 0 / 50%);
  }
}
.edit-image {
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  &:hover {
    transform: rotate(20deg) scale(1.2);
  }
}
`