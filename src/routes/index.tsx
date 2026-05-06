import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import hero from "@/assets/hero.jpg";
import leaf from "@/assets/leaf.png";
import { EnvelopeIntro } from "@/components/wedding/EnvelopeIntro";
import { PetalsOverlay } from "@/components/wedding/PetalsOverlay";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { Countdown } from "@/components/wedding/Countdown";
import { Schedule } from "@/components/wedding/Schedule";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { useReveal } from "@/hooks/useReveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matas & Greta — 2026.09.06 · Vilnius" },
      {
        name: "description",
        content:
          "Su didžiausiu džiaugsmu kviečiame Jus į mūsų vestuves — 2026 m. rugsėjo 6 d., Vilnius.",
      },
      { property: "og:title", content: "Matas & Greta — 2026.09.06" },
      {
        property: "og:description",
        content: "Mūsų vestuvių kvietimas — Vilnius, 2026 rugsėjo 6 d.",
      },
    ],
  }),
  component: Index,
});

const faqItems = [
  {
    q: "Kada turėčiau atvykti?",
    a: "Maloniai prašome atvykti į Šv. Kazimiero bažnyčią 15–20 minučių anksčiau, kad galėtume drauge ramiai pasitikti ceremonijos pradžią 15:00.",
  },
  {
    q: "Ar galima atvykti su vaikais?",
    a: "Vaikučiai laukiami tik bažnyčioje per santuokos ceremoniją. Vakarinė dalis restorane „Elven“ — tik suaugusiems. Norime, kad ir Jūs, ir tėveliai galėtų pailsėti ir mėgautis vakaru.",
  },
  {
    q: "Kokia aprangos forma?",
    a: "Damos — ilgos suknelės. Ponai — kostiumai. Aprangos kodo spalvas rasite skiltyje „Aprangos kodas“ aukščiau. Prašome vengti baltos ir burgundinės.",
  },
  {
    q: "O kaip dovanos?",
    a: "Brangiausia dovana — Jūsų buvimas šalia. Jei norėtumėte prisidėti prie mūsų svajonės — dovanas mieliausiai priimsime vokeliuose.",
  },
  {
    q: "Iki kada laukiame Jūsų atsakymo?",
    a: "Maloniai prašome patvirtinti dalyvavimą iki 2026 m. liepos 6 d. Po šios datos registracija užsidaro.",
  },
];

const dressColors = [
  { c: "#0f1b3d", n: "Tamsiai mėlyna" },
  { c: "#1e3a5f", n: "Tamsi mėlyna" },
  { c: "#2d5016", n: "Smaragdas" },
  { c: "#4a1942", n: "Slyvinė" },
  { c: "#3d2817", n: "Šokoladas" },
  { c: "#6b4423", n: "Bronzinė" },
  { c: "#1a3c5e", n: "Naktinė" },
  { c: "#2d2d2d", n: "Antracitas" },
];

function Index() {
  const [introDone, setIntroDone] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [greeting, setGreeting] = useState("Mielas Svety,");
  const [slug, setSlug] = useState<string | undefined>(undefined);
  useReveal();

  // Resolve ?kam=slug — first try guests table, fallback to formatting the param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const kam = params.get("kam")?.trim();
    if (!kam) return;
    setSlug(kam);
    const lower = kam.toLowerCase();
    (async () => {
      const { data } = await supabase
        .from("guests")
        .select("display_name, greeting")
        .eq("slug", lower)
        .maybeSingle();
      if (data) {
        setGreeting(data.greeting || `Miela${data.display_name.endsWith("a") || data.display_name.endsWith("ė") ? "" : "s"} ${data.display_name},`);
        return;
      }
      // Fallback: known shortcuts
      if (lower === "teveliai" || lower === "tėveliai") {
        setGreeting("Mieli Tėveliai,");
        return;
      }
      if (lower === "draugai") {
        setGreeting("Mieli Draugai,");
        return;
      }
      const pretty = kam.charAt(0).toUpperCase() + kam.slice(1).toLowerCase();
      setGreeting(`Miela${pretty.endsWith("a") || pretty.endsWith("ė") ? "" : "s"} ${pretty},`);
    })();
  }, []);

  useEffect(() => {
    if (introDone) setMusicOn(true);
  }, [introDone]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <EnvelopeIntro greeting={greeting} onOpen={() => setIntroDone(true)} />
      {introDone && (
        <>
          <PetalsOverlay />
          <MusicPlayer enabled={musicOn} />
        </>
      )}

      {/* HERO */}
      <header className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--moss-deep) 35%, transparent) 0%, color-mix(in oklab, var(--ivory) 30%, transparent) 50%, var(--ivory) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl animate-fade-up px-4" style={{ animationDelay: "0.3s" }}>
          <p className="hairline justify-center" style={{ color: "var(--ivory)" }}>
            ◈  Vestuvės · 2026  ◈
          </p>
          <h1
            className="mt-10 font-serif italic text-balance text-ivory drop-shadow-lg"
            style={{
              color: "var(--ivory)",
              lineHeight: 1.05,
              fontSize: "clamp(3rem, 9vw, 8rem)",
              fontWeight: 400,
            }}
          >
            Matas
            <span className="mx-3 not-italic" style={{ color: "color-mix(in oklab, var(--gold) 80%, var(--ivory))", fontWeight: 300 }}>&amp;</span>
            Greta
          </h1>
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 font-display text-sm uppercase md:gap-6 md:text-base"
            style={{ color: "var(--ivory)", letterSpacing: "0.4em" }}
          >
            <span>2026 · 09 · 06</span>
            <img src={leaf} alt="" width={28} height={28} className="opacity-80" />
            <span>Vilnius</span>
          </div>
          <p className="mt-10 font-serif text-xl italic md:text-2xl" style={{ color: "color-mix(in oklab, var(--ivory) 90%, transparent)" }}>
            „Dvi sielos, viena istorija."
          </p>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-xs uppercase animate-shimmer"
          style={{ color: "var(--ivory)", letterSpacing: "0.5em" }}
        >
          ↓  Slinkite žemyn  ↓
        </div>
      </header>

      {/* COUNTDOWN */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-5xl text-center reveal">
          <p className="hairline justify-center">Iki mūsų dienos</p>
          <h2 className="mt-8 font-script text-6xl text-primary md:text-7xl">
            Skaičiuojame minutes
          </h2>
          <p className="mt-4 font-serif text-lg italic text-muted-foreground md:text-xl">
            kol pasakysime „taip"
          </p>
          <div className="mt-16">
            <Countdown />
          </div>
        </div>
      </section>

      {/* OPENING WORDS */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-2xl text-center reveal">
          <div className="flourish mb-8">
            <img src={leaf} alt="" width={32} height={32} className="opacity-70" />
          </div>
          <h2 className="font-script text-5xl text-primary md:text-6xl">
            Su meile kviečiame Jus
          </h2>
          <p className="mt-10 font-serif text-xl italic leading-relaxed text-foreground/85 md:text-2xl">
            Šią dieną mes ištarsime &bdquo;taip&ldquo; ir pradėsime naują skyrių.
            Norime, kad būtumėte šalia &mdash; su Jūsų šypsenomis, ašaromis ir
            sveikinimais ši diena taps dar gražesnė.
          </p>
        </div>
      </section>

      {/* SCHEDULE */}
      <section
        id="programa"
        className="relative px-6 py-28 sm:py-36"
        style={{
          background:
            "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--moss) 8%, var(--ivory)) 50%, var(--ivory))",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center reveal">
            <p className="hairline justify-center">Dienos programa</p>
            <h2 className="mt-8 font-script text-6xl text-primary md:text-7xl">
              Kaip skleisis mūsų diena
            </h2>
          </div>
          <Schedule />
        </div>
      </section>

      {/* VENUE / MAP */}
      <section id="vieta" className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center">
          <div className="reveal">
            <p className="hairline">Ceremonija</p>
            <h2 className="mt-6 font-script text-5xl text-primary md:text-6xl">
              Šv. Kazimiero bažnyčia
            </h2>
            <p className="mt-3 font-serif text-lg italic text-muted-foreground md:text-xl">
              Didžioji g. 34, Vilnius · 15:00
            </p>
            <p className="mt-6 font-serif text-base leading-relaxed text-foreground/80 md:text-lg">
              Maloniai prašome atvykti <em>15–20 minučių anksčiau</em> &mdash; kad
              galėtume drauge ramiai pasitikti ceremonijos pradžią.
            </p>

            <div className="my-10 flourish" />

            <p className="hairline">Vakarinė dalis</p>
            <h2 className="mt-6 font-script text-5xl text-primary md:text-6xl">
              Restoranas „Elven"
            </h2>
            <p className="mt-3 font-serif text-lg italic text-muted-foreground md:text-xl">
              Gucevičiaus g., Vilnius · 20:00
            </p>
            <p className="mt-6 font-serif text-base leading-relaxed text-foreground/80 md:text-lg">
              Iškilminga vakarienė, tostai, šokiai &mdash; <em>tik suaugusiems</em>.
            </p>
          </div>
          <div
            className="reveal overflow-hidden rounded-sm border border-border shadow-luxe"
            style={{ borderColor: "color-mix(in oklab, var(--moss-deep) 25%, transparent)" }}
          >
            <iframe
              title="Šv. Kazimiero bažnyčia"
              src="https://www.openstreetmap.org/export/embed.html?bbox=25.288%2C54.677%2C25.292%2C54.679&layer=mapnik&marker=54.678%2C25.290"
              className="h-[28rem] w-full md:h-[32rem]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section
        className="relative px-6 py-28 sm:py-36"
        style={{
          background:
            "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--moss) 10%, var(--ivory)))",
        }}
      >
        <div className="mx-auto max-w-3xl text-center reveal">
          <p className="hairline justify-center">Aprangos kodas</p>
          <h2 className="mt-8 font-script text-6xl text-primary md:text-7xl">
            Elegantiška šventinė
          </h2>
          <p className="mt-8 font-serif text-xl italic text-foreground/85 md:text-2xl">
            Damos &mdash; <em>ilgos suknelės</em>. Ponai &mdash; <em>kostiumai</em>.
            Pageidaujame prabangių, gilių spalvų: tamsiai mėlynos, smaragdo, slyvinės,
            šokolado, bronzos, antracito. Prašome vengti baltos ir burgundinės.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {dressColors.map((c) => (
              <div key={c.c} className="flex flex-col items-center gap-2">
                <span
                  className="h-14 w-14 rounded-full border shadow-soft"
                  style={{
                    backgroundColor: c.c,
                    borderColor: "color-mix(in oklab, var(--moss-deep) 20%, transparent)",
                  }}
                  aria-hidden="true"
                />
                <span className="font-display text-[0.6rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.25em" }}>
                  {c.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRY — vokeliai */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center reveal">
          <p className="hairline justify-center">Dovanos</p>
          <h2 className="mt-8 font-script text-6xl text-primary md:text-7xl">
            Brangiausia dovana &mdash; Jūs
          </h2>
          <p className="mt-8 font-serif text-xl italic leading-relaxed text-foreground/85 md:text-2xl">
            Didžiausia dovana mums &mdash; Jūsų buvimas šalia. Tačiau jei norėtumėte
            prisidėti prie mūsų vestuvinės kelionės svajonės, mieliausiai priimsime
            dovanas <em>vokeliuose</em>.
          </p>

          <div
            className="mx-auto mt-14 max-w-md rounded-sm border bg-card/70 p-10 shadow-luxe backdrop-blur-sm"
            style={{ borderColor: "color-mix(in oklab, var(--moss-deep) 25%, transparent)" }}
          >
            {/* Envelope icon */}
            <svg width="64" height="48" viewBox="0 0 64 48" className="mx-auto mb-6 opacity-80">
              <rect x="2" y="6" width="60" height="36" rx="2" fill="none" stroke="var(--moss-deep)" strokeWidth="1.2" />
              <path d="M2 8 L32 28 L62 8" fill="none" stroke="var(--moss-deep)" strokeWidth="1.2" />
              <circle cx="32" cy="34" r="4" fill="var(--gold)" opacity="0.6" />
            </svg>
            <p className="font-display text-xs uppercase text-muted-foreground" style={{ letterSpacing: "0.4em" }}>
              ✦  Vokelis  ✦
            </p>
            <p className="mt-6 font-script text-3xl text-primary md:text-4xl">
              Matas &amp; Greta
            </p>
            <p className="mt-3 font-serif text-base italic text-muted-foreground">
              Vokeliai laukiami šventės vietoje
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="relative px-6 py-28 sm:py-36"
        style={{
          background:
            "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--moss) 8%, var(--ivory)))",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="mb-16 text-center reveal">
            <p className="hairline justify-center">Dažni klausimai</p>
            <h2 className="mt-8 font-script text-6xl text-primary md:text-7xl">
              Gerai žinoti
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((it) => (
              <details
                key={it.q}
                className="reveal group rounded-sm border bg-card/80 p-7 transition-all open:shadow-soft"
                style={{ borderColor: "color-mix(in oklab, var(--moss-deep) 18%, transparent)" }}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg italic text-foreground md:text-xl">
                  {it.q}
                  <span className="font-display text-2xl text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-5 font-serif text-base leading-relaxed text-muted-foreground md:text-lg">
                  {it.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center reveal">
            <p className="hairline justify-center">RSVP</p>
            <h2 className="mt-8 font-script text-6xl text-primary md:text-7xl">
              Patvirtinkite dalyvavimą
            </h2>
            <p className="mt-5 font-serif text-lg italic text-muted-foreground md:text-xl">
              Maloniai prašome iki 2026 m. liepos 6 d.
            </p>
          </div>
          <div className="reveal">
            <RsvpForm inviteSlug={slug} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="relative px-6 pb-20 pt-16 text-center"
        style={{
          background:
            "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--moss-deep) 25%, var(--ivory)))",
        }}
      >
        <img src={leaf} alt="" width={56} height={56} loading="lazy" className="mx-auto opacity-70" />
        <p className="mt-8 font-script text-5xl text-primary md:text-6xl">Matas &amp; Greta</p>
        <p className="mt-4 font-display text-xs uppercase text-muted-foreground" style={{ letterSpacing: "0.5em" }}>
          2026 · 09 · 06 · Vilnius
        </p>
      </footer>
    </div>
  );
}
