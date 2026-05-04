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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matas & Greta — 2026.09.06" },
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
    q: "Ar galima atvykti su vaikais?",
    a: "Mums labai svarbu, kad ši diena būtų ypatinga visiems. Maloniai prašome vaikus palikti namuose, kad galėtumėte mėgautis vakaru.",
  },
  {
    q: "Ar bus parkavimo vieta?",
    a: "Taip, prie pokylio salės bus pakankamai vietų. Prie bažnyčios — miesto parkavimas.",
  },
  {
    q: "Kada baigsis vakaras?",
    a: "Šventė tęsis iki ankstyvo ryto — kviečiame likti su mumis iki paskutinio šokio.",
  },
  {
    q: "Iki kada laukiame Jūsų atsakymo?",
    a: "Maloniai prašome patvirtinti dalyvavimą iki 2026 m. liepos 1 d.",
  },
];

function Index() {
  const [introDone, setIntroDone] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  useReveal();

  // Personalized greeting via ?kam=Vardas or ?kam=teveliai
  const { greeting, slug } = useMemo(() => {
    if (typeof window === "undefined") return { greeting: "Mielas Svety,", slug: undefined };
    const params = new URLSearchParams(window.location.search);
    const kam = params.get("kam")?.trim();
    const slug = kam ?? undefined;
    if (!kam) return { greeting: "Mielas Svety,", slug };
    const lower = kam.toLowerCase();
    if (lower === "teveliai" || lower === "tėveliai")
      return { greeting: "Mieli Tėveliai,", slug };
    if (lower === "draugai") return { greeting: "Mieli Draugai,", slug };
    return { greeting: `Miela${kam.endsWith("a") || kam.endsWith("ė") ? "" : "s"} ${kam},`, slug };
  }, []);

  useEffect(() => {
    if (introDone) {
      // attempt to start music after the user gesture (open letter)
      setMusicOn(true);
    }
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
      <header
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center"
      >
        <div className="absolute inset-0">
          <img
            src={hero}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--ivory) 55%, transparent), color-mix(in oklab, var(--ivory) 80%, transparent) 70%, var(--ivory))",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="hairline justify-center">
            Vestuvės · 2026
          </p>
          <h1 className="mt-8 font-serif text-6xl text-primary text-balance md:text-8xl lg:text-9xl">
            Matas
            <span className="mx-3 italic text-accent-foreground/70">&</span>
            Greta
          </h1>
          <div className="mt-10 flex items-center justify-center gap-6 font-serif text-lg italic text-foreground/80 md:text-xl">
            <span>2026.09.06</span>
            <img src={leaf} alt="" width={28} height={28} className="opacity-70" />
            <span>Vilnius</span>
          </div>
          <p className="mt-8 font-serif text-xl italic text-muted-foreground md:text-2xl">
            „Dvi sielos, viena istorija."
          </p>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-primary/60 animate-shimmer"
        >
          Slinkite žemyn
        </div>
      </header>

      {/* COUNTDOWN */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center reveal">
          <p className="hairline justify-center">Iki mūsų dienos</p>
          <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
            Skaičiuojame minutes
          </h2>
          <div className="mt-12">
            <Countdown />
          </div>
        </div>
      </section>

      {/* STORY / OPENING WORDS */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-2xl text-center reveal">
          <p className="hairline justify-center">Mūsų istorija</p>
          <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
            Su meile kviečiame Jus
          </h2>
          <p className="mt-8 font-serif text-xl italic leading-relaxed text-foreground/85 md:text-2xl">
            Šią dieną mes ištarsime &bdquo;taip&ldquo; ir pradėsime naują skyrių.
            Norime, kad būtumėte šalia &mdash; su Jūsų šypsenomis, ašaromis ir
            sveikinimais ši diena taps dar gražesnė.
          </p>
          <div className="mt-10 flex justify-center">
            <img src={leaf} alt="" width={56} height={56} className="opacity-60" />
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="programa" className="relative bg-card/40 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center reveal">
            <p className="hairline justify-center">Dienos programa</p>
            <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
              Kaip skleisis mūsų diena
            </h2>
          </div>
          <Schedule />
        </div>
      </section>

      {/* VENUE / MAP */}
      <section id="vieta" className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
          <div className="reveal">
            <p className="hairline">Vieta</p>
            <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
              Šv. Kazimiero bažnyčia
            </h2>
            <p className="mt-4 font-serif text-lg italic text-muted-foreground">
              Didžioji g. 34, Vilnius
            </p>
            <p className="mt-6 font-serif text-base leading-relaxed text-foreground/80">
              Ceremonija prasidės <em>15:00</em>. Maloniai prašome atvykti
              bent 15 minučių anksčiau.
            </p>
            <p className="mt-8 font-serif text-base leading-relaxed text-foreground/80">
              <em>Vakarinė dalis</em> &mdash; 18:00. Tiksli pokylio vieta bus
              atskleista artėjant šventei.
            </p>
          </div>
          <div className="reveal overflow-hidden rounded-sm border border-border shadow-soft">
            <iframe
              title="Šv. Kazimiero bažnyčia"
              src="https://www.openstreetmap.org/export/embed.html?bbox=25.288%2C54.677%2C25.292%2C54.679&layer=mapnik&marker=54.678%2C25.290"
              className="h-80 w-full md:h-96"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section className="relative bg-card/40 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center reveal">
          <p className="hairline justify-center">Aprangos kodas</p>
          <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
            Elegantiška šventinė
          </h2>
          <p className="mt-8 font-serif text-xl italic text-foreground/85">
            Pageidaujame šviesių, gamtos atspalvių &mdash; šalavijo, kremo,
            smėlio, perlo, šampano. Prašome vengti baltos spalvos.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {["#f5f0e8", "#dce5d4", "#a8c0a0", "#7d9b76", "#c9a878"].map((c) => (
              <span
                key={c}
                className="h-10 w-10 rounded-full border border-border shadow-soft"
                style={{ backgroundColor: c }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRY */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center reveal">
          <p className="hairline justify-center">Dovanos</p>
          <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
            Brangiausia dovana &mdash; Jūs
          </h2>
          <p className="mt-8 font-serif text-xl italic leading-relaxed text-foreground/85">
            Didžiausia dovana mums &mdash; Jūsų buvimas šalia. Tačiau jei
            norėtumėte prisidėti prie mūsų vestuvinės kelionės svajonės,
            būsime labai dėkingi.
          </p>
          <div className="mt-10 inline-block rounded-sm border border-border bg-card/60 px-8 py-6 text-left backdrop-blur-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              Sąskaita medaus mėnesiui
            </p>
            <p className="mt-3 font-serif text-2xl italic text-primary">
              LT00 0000 0000 0000 0000
            </p>
            <p className="mt-1 font-serif text-sm italic text-muted-foreground">
              Matas ir Greta
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-card/40 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center reveal">
            <p className="hairline justify-center">Dažni klausimai</p>
            <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
              Gerai žinoti
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((it) => (
              <details
                key={it.q}
                className="reveal group rounded-sm border border-border bg-card/70 p-6 transition-all open:shadow-soft"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg italic text-foreground">
                  {it.q}
                  <span className="text-2xl text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 font-serif text-base leading-relaxed text-muted-foreground">
                  {it.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center reveal">
            <p className="hairline justify-center">RSVP</p>
            <h2 className="mt-6 font-serif text-4xl italic text-primary md:text-5xl">
              Patvirtinkite dalyvavimą
            </h2>
            <p className="mt-4 font-serif text-lg italic text-muted-foreground">
              Maloniai prašome iki 2026 m. liepos 1 d.
            </p>
          </div>
          <div className="reveal">
            <RsvpForm inviteSlug={slug} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative px-6 pb-16 pt-12 text-center">
        <img src={leaf} alt="" width={48} height={48} loading="lazy" className="mx-auto opacity-60" />
        <p className="mt-6 font-serif text-3xl italic text-primary">Matas &amp; Greta</p>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          2026.09.06 · Vilnius
        </p>
      </footer>
    </div>
  );
}
