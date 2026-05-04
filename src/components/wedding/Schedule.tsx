import leaf from "@/assets/leaf.png";

interface Item {
  time: string;
  title: string;
  desc?: string;
}

const items: Item[] = [
  {
    time: "15:00",
    title: "Santuokos ceremonija",
    desc: "Šv. Kazimiero bažnyčia, Vilnius",
  },
  {
    time: "16:30",
    title: "Sveikinimai ir nuotraukos",
    desc: "Po ceremonijos prie bažnyčios",
  },
  {
    time: "18:00",
    title: "Vakarienė",
    desc: "Iškilminga vakarienė ir pirmieji tostai",
  },
  {
    time: "20:00",
    title: "Pirmasis šokis",
    desc: "Ir vakaro pradžia",
  },
  {
    time: "00:00",
    title: "Vidurnakčio užkandžiai",
    desc: "Šventė tęsiasi iki ryto",
  },
];

export function Schedule() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div
        aria-hidden="true"
        className="absolute left-6 top-0 h-full w-px sm:left-1/2 sm:-translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--sage-deep) 40%, transparent), transparent)",
        }}
      />
      <ol className="space-y-12">
        {items.map((it, i) => {
          const right = i % 2 === 0;
          return (
            <li key={it.time} className="reveal relative grid gap-4 sm:grid-cols-2 sm:gap-12">
              <div className={`flex sm:justify-${right ? "end" : "start"} ${right ? "" : "sm:col-start-2"}`}>
                <div className="ml-14 sm:ml-0 sm:max-w-xs">
                  <p className="font-serif text-3xl italic text-primary md:text-4xl">{it.time}</p>
                  <h3 className="mt-2 font-serif text-xl text-foreground md:text-2xl">{it.title}</h3>
                  {it.desc && (
                    <p className="mt-1 font-serif text-base italic text-muted-foreground">{it.desc}</p>
                  )}
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute left-6 top-3 -translate-x-1/2 sm:left-1/2"
              >
                <img
                  src={leaf}
                  alt=""
                  width={36}
                  height={36}
                  loading="lazy"
                  className="rounded-full bg-card p-1 shadow-soft"
                  style={{ filter: "drop-shadow(0 2px 6px rgba(125,155,118,0.3))" }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
