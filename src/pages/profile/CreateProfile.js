import styled from "styled-components"
import InputForm from './InputForm'
import { detectMobile } from "../../utils"
import './index.scss'
export default function CreateProfile(props) {
  const { newAccounts } = props
  return (
    <CreateProfileContanier>
      <div className={`profile-wrap ${detectMobile() ? 'profile-wrap-client': ''}`}>
        <div className="content">
          <div className="create-wrap">
            <InputForm myAddress={newAccounts}/>
          </div>
        </div>
      </div>
    </CreateProfileContanier>
  )
}

const CreateProfileContanier = styled.div`
  // overflow-y: scroll;
  // height: 100vh;  
  display: flex;
  // margin: 0 auto 70px;
  // padding: 0 0 50px;
  width: 100%;
  background-color: #fff;
@media (min-width: 1200px) {
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}
.create-wrap {
  max-width: 48rem;
  padding: 1.5rem;
  margin: 1.5rem auto;
  background: #fff;
  border-radius: 1.5rem;
  .create-box {
    margin-bottom: 40px;
    border-radius: 1rem;
    border: 0.125rem solid rgba(0,0,0,.033);
  }
}
`