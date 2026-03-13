"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // End of timer
              clearInterval(timer);
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex gap-2 text-center" dir="ltr">
      {[
        { val: format(timeLeft.hours), label: "HR" },
        { val: format(timeLeft.minutes), label: "MIN" },
        { val: format(timeLeft.seconds), label: "SEC" },
      ].map((time, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 min-w-[3.5rem]">
            <span className="text-xl font-black text-amber-400 font-mono italic">{time.val}</span>
          </div>
          {idx < 2 && <span className="text-amber-500 font-black animate-pulse">:</span>}
        </div>
      ))}
    </div>
  );
}
