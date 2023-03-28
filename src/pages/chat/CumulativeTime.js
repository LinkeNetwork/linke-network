import React, { useState, useEffect } from "react";
import intl from 'react-intl-universal'
import useGlobal from "../../hooks/useGlobal";
const CumulativeTime = ({timestamp, stakedNum, isOpenAutoCheckIn, cancelTime}) => {
  const [remainingTime, setRemainingTime] = useState({});
  const firstDate = new Date(timestamp * 1000)
  const { setState } = useGlobal()
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = now - firstDate
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const nextDay = new Date(firstDate);
      nextDay.setDate(firstDate.getDate() + days + 1);
      const remaining = nextDay - now;
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setRemainingTime({ days, hours, minutes, seconds });
      setState({
        stakedDays: days
      })
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className="cumulative-time">
      <p>{remainingTime.days} {intl.get('Days')}</p>
      {
        (+stakedNum > 0 && isOpenAutoCheckIn) && !(+cancelTime) &&
        <div>
          <div className="count">
            {remainingTime.hours}:{remainingTime.minutes < 10 ? `0${remainingTime.minutes}`:remainingTime.minutes }:{remainingTime.seconds < 10 ? `0${remainingTime.seconds}`:remainingTime.seconds }
          </div>
          <div className="tips">({intl.get('OneDayTips')})</div>
        </div>
      }
    </div>
  );
};

export default CumulativeTime;