import styled from 'styled-components';
import czzURL from '../../assets/images/czz.png';
import reiURL from '../../assets/images/rei.svg';
import Image from '../../component/Image'
export default function CurrentNetwork(props) {
  const { currNetwork, handleChangeNetwork } = props
  const networkList = [
    {
      chainId: '2019',
      icon: czzURL,
      name: 'CZZ'
    },
    {
      chainId: '47805',
      icon: reiURL,
      name: 'REI'
    },
    {
      chainId: '1',
      icon: '',
      name: 'ETH'
    }
  ]
  const currentNetwork = networkList.filter(
    (i) => i.name === currNetwork
  )
  return(
    <CurrentNetworkContainer>
      {
        currentNetwork.map(item => {
          return(
            <div key={item.chainId} onClick={() => handleChangeNetwork()}>
              <Image src={item.icon} size={14} alt=""></Image>
              {item.name}
            </div>
          )
        })
      }

    </CurrentNetworkContainer>
  )
}
const CurrentNetworkContainer = styled.div`
// margin-right: 45px;
cursor: pointer;
div {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background: #f6f6f6;
  border-radius: 90px;
  font-size: 12px;
  img {
    margin-right: 2px;
  }
}
@media (max-width: 991px) {
  div {
    background: #fff;
    border-radius: 5px 0 0 5px;
  }
}
`
