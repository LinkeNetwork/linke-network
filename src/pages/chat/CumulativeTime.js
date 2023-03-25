import React, { useState, useEffect } from 'react';
import useGlobal from '../../hooks/useGlobal';
import intl from "react-intl-universal"

function CumulativeTime({ timestamp }) {
  const [count, setCount] = useState(0);
  const { setState } = useGlobal()
  const seconds = Math.floor((count / 1000) % 60);
  const minutes = Math.floor((count / 1000 / 60) % 60);
  const hours = Math.floor((count / (1000 * 60 * 60)) % 24);
  const days = Math.floor(count / (1000 * 60 * 60 * 24));
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const distance = now - timestamp * 1000;
      if (distance < 0) {
        clearInterval(intervalId);
        setCount(0);
        setState({
          canMint: true,
          showTokenContent: true
        })
      } else {
        setState({
          showTokenContent: false,
          canMint: false
        })
        setCount(distance);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);
  return (
    <div className='cumulative-time'>
      {
         <span>{days}{intl.get('Days')}</span>
      }
        {hours}{intl.get('Hours')}{minutes < 10 ? `0${minutes}`:minutes }{intl.get('Minutes')}{seconds < 10 ? `0${seconds}`:seconds }{intl.get('Seconds')}
    </div>
  );
}

export default CumulativeTime