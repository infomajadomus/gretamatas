import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-06T15:00:00+03:00").getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const labels: Record<keyof ReturnType<typeof diff>, string> = {
  days: "Dienos",
  hours: "Valandos",
  minutes: "Minutės",
  seconds: "Sekundės",
};

export function Countdown() {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const i = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6">
      {(Object.keys(t) as Array<keyof typeof t>).map((k) => (
        <div
          key={k}
          className="flex flex-col items-center rounded-sm border border-border/60 bg-card/60 px-2 py-5 backdrop-blur-sm sm:px-6 sm:py-7"
        >
          <span className="font-serif text-4xl text-primary sm:text-5xl md:text-6xl">
            {String(t[k]).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
            {labels[k]}
          </span>
        </div>
      ))}
    </div>
  );
}
