import { useState } from "react"
import styled from "styled-components"
import coinImg from '../../assets/images/qianbi.svg'
export default function RedEnvelopeCover(props) {
  const { handleCloseRedEnvelope } = props
  const [showOpen, setShowOpen] = useState(true)
  const handleOpen = () => {
    setShowOpen(false)
  }
  return (
    <RedEnvelopeCoverContanier>
      <div className="cover-wrapper">
        <div className="top-cover"></div>
        {
          showOpen 
            ? <div className="open-btn" onClick={handleOpen}>Open</div>
            : <div className="coin-wrapper">
                <div className="front" style={{ backgroundImage: `url(${coinImg})` }}></div>
                <div className="back" style={{ backgroundImage: `url(${coinImg})` }}></div>
              </div>
        }
        <div className="close-btn" onClick={handleCloseRedEnvelope}>
          <span className="iconfont icon-guanbi"></span>
        </div>
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
z-index: 99999;
transition: 0.4s;
.cover-wrapper {
  background-color: rgb(224, 96,76);
  cursor: pointer;
  position: relative;
  width: 360px;
  height: 500px;
  background-size: 100%;
  background-repeat: no-repeat;
  border-radius: 10px;
  top: 50%;
  margin-top: -250px;
  animation: bounceIn .3s ease;
}
.open-btn {
  position: absolute;
  bottom: 0;
  width: 106px;
  height: 106px;
  background: rgb(230,206,160);
  border-radius: 50%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  color: rgb(59,59,59);
  font-weight: bold;
  font-size: 26px;
  transform: translate(-50%, -60px);
  left: 50%;
  cursor: pointer;
}
}
}
.close-btn {
  bottom: -60px;
  left: 50%;
  margin-left: -20px;
  color: rgb(230,206,160);
  border: 1px solid rgb(230,206,160);
  border-radius: 50%;
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes rotateCoin {
  0% {
      transform: rotateY(0deg);
  }

  100% {
      transform: rotateY(360deg);
  }
}

.top-cover {
  background: rgb(200, 62,43);
  width: 350px;
  height: 170px;
  border-radius: 0 0 175px 175px;
  margin-left: 5px;
  opacity: 0.6;
}
.coin-wrapper{
  position: relative;
  width: 146px;
  height: 146px;
  margin: 144px auto 0;
  perspective: 500px;
  transform-style: preserve-3d;
  animation-iteration-count: 3;
  animation: rotateCoin 3s infinite;
  div{
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
  }
          
  .front, .back {
    background-size: 100%;
    background-repeat: no-repeat;
  }     
  @keyframes bounceIn{
    0% {
      transform: scale(.2);
    }
    50% {
      transform: scale(0.6);
    }
    100% {
        transform: scale(1);
    }
}
`