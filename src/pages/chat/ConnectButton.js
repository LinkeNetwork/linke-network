import styled from 'styled-components'
import intl from "react-intl-universal"
export default function ConnectButton(props) {
  const { connectWallet } = props
  return (
    <ButtonContainer type="button" className="btn btn-primary">
      <span onClick={() => connectWallet()}>{intl.get('Connectwallet')}</span>
      <i className="iconfont icon-youjiantou ms-1"></i>
    </ButtonContainer>
  )
}

const ButtonContainer = styled.button`
  // width: 150px;
  // position: absolute;
  // right: 20px;
  // top: 10px
`