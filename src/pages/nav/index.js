import './index.scss'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { detectMobile, getLocal } from '../../utils'
import './index.scss'
import Image from '../../component/Image'
import homeIcon from '../../assets/images/linke.svg'
import { useEffect, useState } from 'react'
import useGlobal from '../../hooks/useGlobal'
export default function Nav(props) {
  const { setState , hasCreateProfile, currentProfileAddress} = useGlobal()
  const { hiddenMenuList, showMenulist, reloadViewProfile } = props
  const [account, setAccount] = useState()
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
  const [nav, setNav] = useState(navList)
  const getCreateStatus = async(address) => {
      if(path.includes('/profile')) { 
        if(getLocal('account') && getLocal('isConnect')) {
            navList[1].path = `/profile/${address}`
            history.push(navList[1].path)
            setState({
              currentProfileAddress: address
            })
            reloadViewProfile()
        }  
        setNav(navList)
      }
  }
  const jumpPage = (path) => {
    history.push(path)
    if(path.includes('/profile')) {
      getCreateStatus(getLocal('account')?.toLowerCase())
    } else {
      setState({
        profileAvatar: ''
      })
    }
  }
  useEffect(() => {
    setAccount(getLocal('account'))
    if(getLocal('isConnect')) {
      getCreateStatus((path.split('/profile/')[1] || getLocal('account'))?.toLowerCase())
    } else {
      setNav(navList)
    }
  }, [getLocal('account'), getLocal('isConnect'), currentProfileAddress])
  return (
    <div>
      {
        (!detectMobile() || showMenulist) &&
        <div className={`${detectMobile() ? 'nav-wrap-client' : ''} nav-wrap`}>
          <ul className="nav-item">
            {
              nav.map((item, index) => {
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
            <li className='home-icon-wrap'><Link to="/home">
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