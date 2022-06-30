import styled from "styled-components"

export default function ChatTab(props) {
  const { changeChatType, currentTabIndex } = props
  const tabList = ['Group', 'Private']
  return (
    <ChatTabContainer>
      <ul>
        {
          tabList.map((item, index) => {
            return(
              <li onClick={() => changeChatType(index)} className={`${currentTabIndex == index ? 'active' : ''}`} key={index}>{item}</li>
            )
          })
        }
      </ul>
    </ChatTabContainer>
  )
}
const ChatTabContainer = styled.div`
  margin: 20px 20px 5px;
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,.06);
  ul {
    display: flex;
    font-size: 14px;
    font-weight: bold;
  }
  li {
    margin-right: 10px;
    height: 100%;
    padding: 0 10px 10px 10px;
    cursor: pointer;
    position: relative;
    transition: transform .3s;
    &.active:after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #FFCE00;
    }
  }
`