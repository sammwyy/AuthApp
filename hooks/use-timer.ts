import { useEffect, useState } from "react";

function timeToZero(currentSecond: number, interval: number) {
  if (interval === 30) {
    const remainingSeconds = 30 - (currentSecond % 30);
    return remainingSeconds === 30 ? 0 : remainingSeconds;
  }

  if (interval === 60) {
    return 60 - currentSecond;
  }

  return 0;
}

const useTimer = (interval: number) => {
  const [second, setSecond] = useState<number>(new Date().getSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecond(new Date().getSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeToZero(second, interval);
};

export default useTimer;
