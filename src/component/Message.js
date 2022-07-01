import styled from "styled-components"

export default function Message(props) {
  const { messageText } = props
  return (
    <MessageContainer>{messageText}</MessageContainer>
  )
}
const MessageContainer = styled.div`
  z-index: 21;
  position: absolute;
  right: 20px;
  background: #333;
  color: #fff;
  padding: 3px 15px;
  font-size: 12px;
  bottom: 90px;
  border-radius: 2px;
  animation: sliderUp .5s ease;
`