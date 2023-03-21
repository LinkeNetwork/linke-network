import './index.scss'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { detectMobile, getLocal } from '../../utils'
import './index.scss'
import Image from '../../component/Image'
import homeIcon from '../../assets/images/linke.svg'
import useGlobal from '../../hooks/useGlobal'
export default function Nav(props) {
  const { setState , accounts} = useGlobal()
  const { hiddenMenuList, showMenulist } = props
  const history = useHistory()
  const path = history.location.pathname
  const navList = [
    {
      icon: 'icon-group',
      name: 'Chat',
      path: '/chat',
    },
    {
      icon: 'icon-view-profile',
      name: 'Profile',
      path: '/profile'
    }
  ]
  const jumpPage = (path) => {
    hiddenMenuList()
    if(path.includes('/profile')) {
      setState({
        isJumpToProfile: true
      })
      debugger
      if(accounts) {
        history.push(`/profile/${accounts}`)
      } else {
        history.push(path)
      }
    } else {
      history.push(path)
      setState({
        profileAvatar: ''
      })
    }
  }
  return (
    <div>
      {
        (!detectMobile() || showMenulist) &&
        <div className={`${detectMobile() ? 'nav-wrap-client' : ''} nav-wrap`}>
          <ul className="nav-item">
            {
              navList.map((item, index) => {
                return (
                  <li className={`${path.includes(item.path) ? 'active' : ''}`} key={index}>
                    <div onClick={() => jumpPage(item.path)}>
                      <span className={`iconfont ${item.icon}`}></span>
                      {item.name}
                    </div>
                  </li>
                )
              })
            }
            <li className='home-icon-wrap'><Link to="/">
              <Image size={40} src={homeIcon} />
            </Link></li>
          </ul>
          {
            detectMobile() &&
            <span className='iconfont icon-guanbi' onClick={() => hiddenMenuList()}></span>
          }
        </div>
      }
    </div>
  )
}