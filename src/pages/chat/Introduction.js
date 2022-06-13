import ConnectButton from './ConnectButton'
export default function Introduction(props) {
  const { onClickDialog, connectWallet } = props
  return (
    <div className="conversation-tips">
      {/* <div className="d-block d-lg-none text-center mb-3 mt-2">
        <button className="btn p-0" type="button" >
          <i className="bi bi-arrow-left-circle"></i> Show chat window
        </button>
      </div> */}
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
    </div>
  )
}