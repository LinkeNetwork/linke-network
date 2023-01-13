import metaURL from '../../assets/images/MetaMask_Fox.svg';
import okexURL from '../../assets/images/okex.svg';
import styled from 'styled-components'
import { detectMobile } from '../../utils';
import Image from '../../component/Image';
export default function ChangeNetwork(props) {
  const { handleChangeNetWork } = props
  const networkList = [
    {
      image: metaURL,
      name: 'MetaMask',
      network: 'ETHF',
    },
    {
      image: okexURL,
      name: 'MetaX',
      network: 'ETHF',
    }
  ]
  return (
    <NetworkContainer>
      <ul className={`network-item ${detectMobile() ? 'network-item-client' : ''}`}>
        {
          networkList.map((item,index) => {
            return (
              <li onClick={() => handleChangeNetWork(item)} key={index}>
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
.network-item {
  display: flex;
  padding: 30px 0;
  width: 100%;
  align-items: center;
  li {
    flex: 1;
    text-align: center;
    padding: 0.375rem 0.75rem;
    cursor: pointer;
  }
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
