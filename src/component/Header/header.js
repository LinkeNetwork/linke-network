import Image from '../../component/Image'
import homeIcon from '../../assets/images/linke-logo.svg'
import { Link } from 'react-router-dom'
import './header.css'
export default function Header() {
  return (
    <header className="header-content">
      <div className="header-left">
        <Image size={60} src={homeIcon}  />
      </div>
      <div className="header-right">
        <ul>
          <li><Link to="/chat">Linke</Link></li>
        </ul>
      </div>
    </header>
  )
}