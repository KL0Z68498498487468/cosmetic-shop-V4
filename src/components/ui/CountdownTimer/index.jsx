import { useEffect, useState } from 'react';

const getTimeLeft = (targetDate) => {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }

  return {
    hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
    minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0'),
    seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0')
  };
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="rounded-[1.5rem] border border-white/50 bg-white/80 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-900/80">
          <div className="text-2xl font-bold text-ink dark:text-slate-100">{value}</div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-roseBrown/70 dark:text-slate-400">{key}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
