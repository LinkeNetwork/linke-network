import styled from "styled-components"
export default function TopMenu(props) {
  const {handleMenu} = props
  return (
    <TopMenuContanier onClick={() => handleMenu()}>
      <span className="iconfont icon-caidan"></span>
    </TopMenuContanier>
  )
}
const TopMenuContanier = styled.div`
z-index: 4;
// bottom: 60px;
right: 20px;
// position: fixed;
// background: #f6f6f6;
// width: 50px;
// height: 50px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
`