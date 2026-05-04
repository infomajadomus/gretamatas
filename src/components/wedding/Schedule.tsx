import leaf from "@/assets/leaf.png";

interface Item {
  time: string;
  title: string;
  desc?: string;
  place?: string;
}

const items: Item[] = [
  {
    time: "15:00",
    title: "Santuokos ceremonija",
    place: "Šv. Kazimiero bažnyčia · Vilnius",
    desc: "Kviečiame atvykti 15–20 min. anksčiau, kad galėtume drauge pasitikti šią akimirką.",
  },
  {
    time: "16:30",
    title: "Sveikinimai ir nuotraukos",
    desc: "Po ceremonijos prie bažnyčios — pirmieji apkabinimai ir kadrai.",
  },
  {
    time: "18:00",
    title: "Vakarinė dalis",
    place: "Restoranas „Elven\" · Guceviciaus g., Vilnius",
    desc: "Iškilminga vakarienė, tostai ir vakaro pradžia.",
  },
  {
    time: "20:00",
    title: "Pirmasis šokis",
    desc: "Ir muzika, kuri nebenutils iki ryto.",
  },
  {
    time: "00:00",
    title: "Vidurnakčio užkandžiai",
    desc: "Šventė tęsiasi — likime kartu iki paskutinio akordo.",
  },
];

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="120"
      height="28"
      viewBox="0 0 120 28"
      fill="none"
      className="opacity-60"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M2 14 Q30 2 60 14 T118 14"
        stroke="var(--moss)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="14" r="2" fill="var(--gold)" />
      <circle cx="2" cy="14" r="1.5" fill="var(--moss)" />
      <circle cx="118" cy="14" r="1.5" fill="var(--moss)" />
    </svg>
  );
}

export function Schedule() {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Center vine */}
      <div
        aria-hidden="true"
        className="absolute left-6 top-0 h-full w-px sm:left-1/2 sm:-translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--moss) 50%, transparent) 10%, color-mix(in oklab, var(--moss) 50%, transparent) 90%, transparent)",
        }}
      />

      <ol className="space-y-16 sm:space-y-20">
        {items.map((it, i) => {
          const right = i % 2 === 0;
          return (
            <li key={it.time} className="reveal relative grid gap-4 sm:grid-cols-2 sm:gap-12">
              <div
                className={`flex sm:justify-${right ? "end" : "start"} ${
                  right ? "" : "sm:col-start-2"
                }`}
              >
                <div
                  className={`ml-14 sm:ml-0 sm:max-w-sm ${right ? "sm:text-right" : "sm:text-left"}`}
                >
                  <div className={`flex ${right ? "sm:justify-end" : "sm:justify-start"}`}>
                    <Flourish flip={right} />
                  </div>
                  <p className="mt-2 font-script text-5xl text-primary md:text-6xl">{it.time}</p>
                  <h3 className="mt-1 font-display text-xl uppercase text-foreground md:text-2xl" style={{ letterSpacing: "0.15em" }}>
                    {it.title}
                  </h3>
                  {it.place && (
                    <p className="mt-2 font-serif text-base italic text-primary/80 md:text-lg">
                      {it.place}
                    </p>
                  )}
                  {it.desc && (
                    <p className="mt-3 font-serif text-base italic text-muted-foreground md:text-lg">
                      {it.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* Center marker */}
              <div
                aria-hidden="true"
                className="absolute left-6 top-6 -translate-x-1/2 sm:left-1/2"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-soft ring-1"
                  style={{
                    boxShadow:
                      "0 0 0 4px var(--ivory), 0 8px 20px -8px color-mix(in oklab, var(--moss-deep) 40%, transparent)",
                    borderColor: "var(--moss)",
                  }}
                >
                  <img src={leaf} alt="" width={28} height={28} loading="lazy" />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
