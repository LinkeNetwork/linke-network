import styled from "styled-components"
import useGlobal from "../../hooks/useGlobal"
import { getLocal } from "../../utils"
import ConnectButton from './ConnectButton'
import intl from "react-intl-universal"
export default function EmptyInfo(props) {
  const { onClickDialog } = props
  const { setState } = useGlobal()
  const connectWallet = () => {
    setState({
      showConnectNetwork: true
    })
  }
  return (
    <EmptyInfoContainer>
      <div>
        <img className="mb-3" width="160" src="https://chat.blockscan.com/assets/svg/empty-list-item.svg" alt="Empty User List" />
      </div>
      <div>
        <img className="mb-3" width="160" src="https://chat.blockscan.com/assets/svg/empty-list-item.svg" alt="Empty User List" />
      </div>
      <h3 className="h5">Your chat is empty!</h3>
      <p className="text-muted">Once you start a new conversation, you'll see the address lists here.</p>
      {
        getLocal('isConnect') &&
        <div className="d-block d-lg-none text-center">
          <button className="btn btn-lg btn-primary" type="button" onClick={() => onClickDialog()} >
            <i className="bi bi-plus-lg me-1"></i>{intl.get('StartChatting')}
          </button>
        </div>
      }
      {
        !getLocal('isConnect') &&
        <ConnectButton connectWallet={() => connectWallet()}></ConnectButton>
      }
    </EmptyInfoContainer>
  )
}

const EmptyInfoContainer = styled.div`
padding:  8rem 1.5rem 0;
text-align: center;
`