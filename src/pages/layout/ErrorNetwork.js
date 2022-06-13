import styled from "styled-components"

export default function ErrorNetwork(props) {
  const {handleChangeNetwork} = props
  return (
    <ErrorNetworkContanier onClick={() => handleChangeNetwork()}>
      <i className="iconfont icon-wind"></i>
      <span>Network Wrong</span>
    </ErrorNetworkContanier>
  )
}
const ErrorNetworkContanier = styled.div`
position: absolute;
right: 96px;
padding: 6px 20px;
background: rgba(255,0,0,.9);
display: flex;
align-items: center;
border-radius: 90px;
justify-content: center;
color: #fff;
cursor: pointer;
span {
  font-size: 12px;
  margin-left: 4px;
}
`