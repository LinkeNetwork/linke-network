import styled from "styled-components"
import { formatAddress, getLocal } from '../../utils'
export default function UserInfo(props) { 
  const { myAddress } = props
  return(
    <UserInfoContanier>
      <h1 className="name"></h1>
      <div className="address">{formatAddress(myAddress, 6, 6)}</div>
    </UserInfoContanier>
  )
}
const UserInfoContanier = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 1.5rem;
  .name{
    font-weight: 550px;
    font-size: 3rem;
  }
  .address{
    background: rgba(0,0,0,.125);
    border-radius: 20px;
    padding: 0 0.5rem;
    font-size: .9375rem;
    font-weight: 500;
  }
`