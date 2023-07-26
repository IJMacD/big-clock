import { useEffect, useState } from 'react'
import './App.css'
import { dateGetJulian, dateGetWeek, dateGetYearDay, formatTime } from './date';

function App() {
  const [ now, setNow ] = useState(() => new Date());

  // useEffect(() => {
  //   let current = true;

  //   const cb = () => {
  //     setNow(new Date);
  //     if (current) {
  //       requestAnimationFrame(cb);
  //     }
  //   };

  //   requestAnimationFrame(cb);

  //   return () => { current = false };
  // }, []);

  useEffect(() => {
    const delay = 53;

    const id = setInterval(() => setNow(new Date()), delay);

    return () => { clearInterval(id); };
  }, []);

  const { weekYear, week, weekDay } = dateGetWeek(now);

  return (
    <>
      <h1>{dateGetJulian(now)}</h1>
      <h1>{now.toISOString().substring(0, 10)}</h1>
      <h1>{weekYear}-W{week.toString().padStart(2,"0")}-{weekDay.toString().padStart(2, "0")}</h1>
      <h1>{now.getFullYear()}-{dateGetYearDay(now).toString().padStart(3,"0")}</h1>
      <h1>{formatTime(now)}</h1>
    </>
  )
}

export default App
