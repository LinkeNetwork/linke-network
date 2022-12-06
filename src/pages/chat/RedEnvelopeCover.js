import styled from "styled-components"
import coverImage from '../../assets/images/cover.jpeg'
export default function RedEnvelopeCover() {
  return(
    <RedEnvelopeCoverContanier>
      <div className="cover-wrapper" style={{backgroundImage: `url(${coverImage})`}}>

      </div>
    </RedEnvelopeCoverContanier>
  )
}

const RedEnvelopeCoverContanier = styled.div`
position: fixed;
left: 0;
right: 0;
top: 0;
bottom: 0;
display: flex;
justify-content: center;
background: rgba(0, 0, 0, 0.6);
z-index: 100;
transition: 0.4s;
.cover-wrapper {
  margin-top: 80px;
  width: 360px;
  height: 596px;
  background-size: 100%;
  background-repeat: no-repeat;
}
}
`