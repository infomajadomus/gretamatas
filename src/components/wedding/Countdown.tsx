import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-06T15:00:00+03:00").getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

const labels: Record<keyof ReturnType<typeof diff>, string> = {
  days: "Dienos",
  hours: "Valandos",
  minutes: "Minutės",
  seconds: "Sekundės",
};

export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);
  useEffect(() => {
    setT(diff());
    const i = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(i);
  }, []);

  const display = t ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const keys = Object.keys(display) as Array<keyof typeof display>;

  return (
    <div className="relative">
      {/* Decorative arch */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-40"
        width="240"
        height="40"
        viewBox="0 0 240 40"
        fill="none"
      >
        <path
          d="M10 35 Q120 -20 230 35"
          stroke="var(--moss)"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />
        <circle cx="120" cy="6" r="3" fill="var(--gold)" opacity="0.7" />
      </svg>

      <div className="flex flex-wrap items-stretch justify-center gap-2 sm:gap-4 md:gap-6">
        {keys.map((k, i) => (
          <div key={k} className="flex items-stretch gap-2 sm:gap-4 md:gap-6">
            <div
              className="relative flex min-w-[78px] flex-col items-center rounded-sm border bg-gradient-to-b from-card to-card/40 px-3 py-6 backdrop-blur-md sm:min-w-[110px] sm:px-7 sm:py-8"
              style={{
                borderColor: "color-mix(in oklab, var(--moss-deep) 20%, transparent)",
                boxShadow:
                  "inset 0 1px 0 color-mix(in oklab, var(--ivory) 80%, transparent), 0 25px 60px -40px color-mix(in oklab, var(--moss-deep) 50%, transparent)",
              }}
            >
              {/* corner ornaments */}
              <span className="absolute left-1.5 top-1.5 h-2 w-2 border-l border-t border-primary/40" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 border-r border-t border-primary/40" />
              <span className="absolute bottom-1.5 left-1.5 h-2 w-2 border-b border-l border-primary/40" />
              <span className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-primary/40" />

              <span
                key={String(t[k])}
                className="font-display text-5xl text-primary sm:text-6xl md:text-7xl"
                style={{ animation: "count-flip 0.5s ease-out" }}
              >
                {String(t[k]).padStart(2, "0")}
              </span>
              <span
                className="mt-3 font-display uppercase text-muted-foreground"
                style={{ fontSize: "0.6rem", letterSpacing: "0.35em" }}
              >
                {labels[k]}
              </span>
            </div>
            {i < keys.length - 1 && (
              <span className="hidden self-center font-display text-3xl text-primary/30 sm:inline">
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
