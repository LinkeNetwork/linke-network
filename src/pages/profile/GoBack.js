import Image from '../../component/Image'
import arrowLeftIcon from '../../assets/images/arrow-left.svg'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
export default function GoBack() {
  return (
    <Gobackcontanier>
      <Link to="/chat">
        <div className="go-back-wrap">
          <Image size={26} src={arrowLeftIcon} />
          Back</div>
      </Link>
    </Gobackcontanier>
  )
}
const Gobackcontanier = styled.div`
background: #fff;
.go-back-wrap{
  z-index: 3;
  display: flex;
  align-items: center;
  width: 78px;
  justify-content: flex-start;
  cursor: pointer;
  top: 130px;
  transition: all .3s ease;
}
  
`