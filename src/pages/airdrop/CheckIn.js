
import intl from "react-intl-universal"
import styled from "styled-components"
import { Link } from 'react-router-dom'
import { detectMobile } from "../../utils"
import './index.scss'
export default function CheckIn(props) {
  const checkInGroups = [
    {
      name: 'DOGE',
      link: '/chat/0xa7bb8869680d8d8ded6763ffb6167e68ca0c4dcf/ETHF'
    },
    {
      name: 'ETHF',
      link: '/chat/0xb0f36626a524012918374c1239ed241ffe7d9051/ETHF'
    },
    {
      name: 'FCZZ',
      link: '/chat/0xf3832e16fc7637560e6f83f30994cb0d90be7d98/ETHF'
    },
    {
      name: 'SWFTC',
      link: '/chat/0x192478fad30df81ed253cb1e13ff3d63a037554d/ETHF'
    },
    {
      name: 'ETHW',
      link: '/chat/0x44c237e17e9acfa3dc77c8dca17787c42b58c822/ETHF'
    }
  ]
  const checkInGroupInfo = () => {
    return(
      <ul>
      {
        checkInGroups?.map((item,index) => {
          return(
            <li key={index} className="link-item">
              <span>{item.name}</span>
              <div className="link" >
                <Link to={item.link} target="_target">{`${window.location.origin}${item.link}`}</Link>
              </div>
            </li>
          )
        })
      }
    </ul>
    )
  }
  return (
    <CheckInWrapper className={`${detectMobile() ? 'checkin-group-client' : ''}`}>
      <div className="title">{intl.get('CheckInGroup')}</div>
     {checkInGroupInfo()}
    </CheckInWrapper>
  )
}

const CheckInWrapper = styled.div`
font-family: "Helvetica";
margin: 100px 0 0 300px;
.title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
  padding-top: 2.5rem;
}
.link-item {
  margin-bottom: 20px;
}
.link {
  color: #FFCE00;
  margin-top: 6px;
  text-decoration: underline;
}
`