import styled from "styled-components"
import useGlobal from "../../hooks/useGlobal"
export default function ConnectWallet(props) {
  const { setState } = useGlobal()
  // const { connectWallet } = props
  const connectWallet = () => {
    setState({
      showConnectNetwork: true
    })
  }
  return (
    <ConnectWalletContanier>
      <span onClick={() => connectWallet()}>Connect to a wallet</span>
    </ConnectWalletContanier>
  )
}

const ConnectWalletContanier = styled.div`
position: fixed;
left: 0;
right: 0;
bottom: 0;
background: #fff;
z-index: 6;
padding: 10px 15px 20px;
display: flex;
align-items: center;
justify-content: center;
font-weight: bold;
color: #FFCE00;
background: #f6f6f6;
font-size: 14px;
div {
  left: 121px;
}
.connect-client {
  left: 0
}
`