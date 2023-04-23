import './index.scss'
import { Link } from 'react-router-dom'
import intl from "react-intl-universal"
import { useHistory } from 'react-router-dom'
import { detectMobile } from '../../utils'
import { useEffect, useState } from "react"
import Image from '../../component/Image'
import homeIcon from '../../assets/images/linke.svg'
import useGlobal from '../../hooks/useGlobal'
import LanguageSwitch from '../layout/LanguageSwitch'

export default function Nav(props) {
  const { setState , accounts} = useGlobal()
  const { hiddenMenuList, showMenulist } = props
  const history = useHistory()
  const path = history.location.pathname
  const [isAirdropSubMenuOpen, setIsAirdropSubMenuOpen] = useState(false)
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
    },
    {
      icon: 'icon-navigation-2',
      name: 'Airdrop',
      path: '',
      subMenu: [
        {
          name: intl.get('CheckIn'),
          path: '/checkin',
          icon: 'icon-sign2'
        },
        {
          name: intl.get('Bridge'),
          path: 'https://dapp.chainge.finance/',
          icon: 'icon-jiaoyijilu'
        }
      ]
    }
  ]
  const getSubMenuStatus = (path) => {
    if(path?.includes('/profile') || path?.includes('/chat')) {
      setIsAirdropSubMenuOpen(false)
    } else {
      setIsAirdropSubMenuOpen(true)
    }
  }
  const jumpPage = (item) => {
    const path = item.path
    hiddenMenuList(path)
    if(path) {
      getSubMenuStatus(path)
      if(path.includes('/profile')) {
        setState({
          isJumpToProfile: true
        })
        if(accounts) {
          history.push(`/profile/${accounts}`)
        } else {
          history.push(path)
        }
      } else {
        if(item.name === intl.get('Bridge')) {
          window.open(path, '_blank')
        } else {
          history.push(path)
        }
      }
      setState({
        profileAvatar: ''
      })
    }
  }

  useEffect(() => {
    if(path) {
      getSubMenuStatus(path)
    }
    if(detectMobile()) {
      setIsAirdropSubMenuOpen(true)
    }
  }, [path])
  return (
    <div>
      {
        (!detectMobile() || showMenulist) &&
        <div className={`${detectMobile() ? 'nav-wrap-client' : ''} nav-wrap`}>
          <ul className="nav-item">
            {
              navList?.map((item, index) => {
                return (
                  <li key={index} className={`${item.subMenu ? 'has-submenu' : ''} ${isAirdropSubMenuOpen && item.subMenu ? 'submenu-expand' : ''} ${item.path && path.includes(item.path) && !item.action ? 'active' : ''}`}>
                    <div key={index} onClick={() => {
                      jumpPage(item)
                      if (item.name === 'Airdrop') {
                        setIsAirdropSubMenuOpen(!isAirdropSubMenuOpen)
                      }
                    }}>
                      <span className={`iconfont ${item.icon}`}></span>
                      {intl.get(item.name)}
                      {
                        item.name === 'Airdrop' && !detectMobile() &&<span className='iconfont icon-expand'></span>
                      }
                      {item.subMenu && <span className="iconfont icon-down"></span>}
                    </div>
                    {item.subMenu && isAirdropSubMenuOpen &&
                      <ul className="dropdown-list">
                        {item.subMenu.map((subItem, subIndex) => (
                          <li key={subIndex}  className={`${subItem.path && path.includes(subItem.path) ? 'active' : ''}`} onClick={() => jumpPage(subItem)}>
                            <span className={`iconfont ${subItem.icon}`}></span>
                            {subItem.name}
                          </li>
                        ))}
                      </ul>
                    }
                  </li>
                )
              })
            }
            <li className='language-switch'><span>Language</span><LanguageSwitch/></li>
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
