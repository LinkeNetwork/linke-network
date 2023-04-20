import React, { useState, useEffect } from 'react';
import useGlobal from '../../hooks/useGlobal';
import intl from "react-intl-universal"

function CountDown({ timestamp }) {
  const [count, setCount] = useState(0);
  const { setState } = useGlobal()
  // const days = Math.floor(count / (1000 * 60 * 60 * 24));
  const hours = Math.floor((count % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((count % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((count % (1000 * 60)) / 1000);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      var oneDay = 86400000;
      var nextDayTimestamp = timestamp * 1000 + oneDay;
      const distance =  nextDayTimestamp - now;
      if (distance < 0) {
        clearInterval(intervalId);
        setCount(0);
        setState({
          canUnstake: true
        })
      } else {
        setState({
          canUnstake: false
        })
        setCount(distance);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);
  return (
    <div>
      <div className="count-down-tips">{intl.get('UnlockTime')}</div>
      <h1 className='count-down'> {hours}:{minutes < 10 ? `0${minutes}`:minutes }:{seconds < 10 ? `0${seconds}`:seconds }</h1>
    </div>
  )
}

export default CountDown