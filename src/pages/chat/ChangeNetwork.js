import czzURL from '../../assets/images/czz.png';
import reiURL from '../../assets/images/rei.svg';
import styled from 'styled-components'
import { detectMobile } from '../../utils';
import Image from '../../component/Image';
export default function ChangeNetwork(props) {
  const { handleChangeNetWork } = props
  const networkList = [
    {
      image: czzURL,
      name: 'ClassZZ Network',
      network: 'CZZ',
    },
    {
      image: reiURL,
      name: 'REI Network',
      network: 'REI',
    }
  ]
  return (
    <NetworkContainer>
      <ul className={`network-item ${detectMobile() ? 'network-item-client' : ''}`}>
        {
          networkList.map((item,index) => {
            return (
              <li onClick={() => handleChangeNetWork(item.network)} key={index}>
                {/* <img src={item.image} alt="" /> */}
                <div className='img-wrap'>
                  <Image src={item.image} size={detectMobile() ? 30 : 108}/>
                </div>
                <div className='name'>{item.name}</div>
              </li>
            )
          })
        }
      </ul>
    </NetworkContainer>
  )
}
const NetworkContainer = styled.div`
.name {
  margin-top: 10px
}
.network-item-client {
  flex-direction: column;
  padding: 10px 0;
  li {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background: rgba(0,0,0,.053);
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 13px 0 13px 20px;
    justify-content: center;
  }
  .img-wrap {
    position: absolute;
    left: 20px;
  }
  .name {
    font-weight: bold;
    font-size: 14px;
    margin-top: 0;
    color: #6c757d;
  }
}
`