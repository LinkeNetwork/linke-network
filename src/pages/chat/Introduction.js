import styled from 'styled-components';
import ConnectButton from './ConnectButton'
export default function Introduction(props) {
  const { onClickDialog, connectWallet } = props
  return (
    <IntroductionWrapper className="conversation-tips">
      <div className="row justify-content-center my-auto">
        <div className="col-md-8">
          <img className="d-block mx-auto my-4 no-chat-image" src="https://chat.blockscan.com/assets/svg/message.svg" alt="Message" />
          <div className="card shadow p-4 mb-2">
            <h1 className="h4 mb-3">Welcome to
              <span className=''></span> Linke Network <sup><span className="badge bg-secondary ml-1"> Beta</span></sup></h1>
            <p className="text-muted">Built for All chains users, Linke Network is a messaging platform for users to simply and instantly message each other, wallet-to-wallet.</p>
            <p className="text-muted mb-0">Check out our <span className="link-muted text-decoration-underline">FAQs</span> for more details.</p>
            {
              !props.myAddress &&
              <div className='connect-btn-wrap'>
                <ConnectButton connectWallet={() => connectWallet()}></ConnectButton>
              </div>
            }
            {
              props.myAddress &&
              <div className="text-center" style={{marginTop: '20px'}}>
                <button className="btn btn-lg btn-primary" type="button" onClick={() => onClickDialog()} id="startChatBtns">
                  <i className="bi bi-plus-lg me-1"></i>Start new conversation
                </button>
              </div>
            }
          </div>

          <div className="card shadow p-4 mb-4">
            <div className="fw-medium mb-2"><font color="red"><i className="bi bi-exclamation-circle me-1"></i></font>Important!</div>
            <p className="text-muted mb-0">Never share your confidential information, passwords, private keys or seed phrases with ANYONE! Be extra careful when receiving any external links or online forms. Always keep an eye out for malicious parties in the Dark Forest 👀</p>
          </div>

        </div>
      </div>
    </IntroductionWrapper>
  )
}
const IntroductionWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow-y: auto;
  height: 100%;
  padding: 5.5rem 1.5rem 0;
.no-chat-image {
  width: 120px;
  margin-bottom: 20px;
} 
.connect-btn-wrap{
  display: flex;
  justify-content: center;
  margin: 15px 0 -1px;
}
.card {
  position: relative;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 1rem;
  text-align: left;
}
`
