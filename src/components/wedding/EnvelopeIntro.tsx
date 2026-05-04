import { useEffect, useState } from "react";
import leaf from "@/assets/leaf.png";

interface Props {
  greeting: string;
  onOpen: () => void;
}

export function EnvelopeIntro({ greeting, onOpen }: Props) {
  const [stage, setStage] = useState<"idle" | "opening" | "rising" | "gone">("idle");

  useEffect(() => {
    if (stage === "opening") {
      const t1 = setTimeout(() => setStage("rising"), 1600);
      const t2 = setTimeout(() => {
        setStage("gone");
        onOpen();
      }, 2900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage, onOpen]);

  if (stage === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, color-mix(in oklab, var(--cream) 90%, var(--moss) 10%) 0%, color-mix(in oklab, var(--ivory) 70%, var(--moss-deep) 30%) 100%)",
        animation: stage === "rising" ? "fade-in 1.2s ease-in reverse forwards" : undefined,
      }}
    >
      {/* Hidden ghost layers */}
      <div className="ghost" style={{ fontSize: "min(38vw, 30rem)", animationDelay: "0s" }}>
        M&nbsp;&amp;&nbsp;G
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "min(2.4vw, 1rem)",
          letterSpacing: "0.6em",
          color: "var(--moss-deep)",
          opacity: 0.22,
        }}
      >
        2026 · IX · VI
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[12%] flex justify-center"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "min(2.4vw, 1rem)",
          letterSpacing: "0.6em",
          color: "var(--moss-deep)",
          opacity: 0.22,
        }}
      >
        15:00 · VILNIUS
      </div>

      <div
        className="relative flex flex-col items-center gap-8 px-6 text-center"
        style={{ perspective: "1600px" }}
      >
        <p
          className="font-display text-[0.65rem] uppercase animate-fade-up"
          style={{ animationDelay: "0.2s", letterSpacing: "0.5em", color: "var(--moss-deep)" }}
        >
          ◈  Kvietimas  ◈
        </p>
        <h2
          className="font-script text-5xl text-primary md:text-7xl animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {greeting}
        </h2>

        {/* Envelope */}
        <div
          className="relative mt-2"
          style={{
            width: "min(82vw, 460px)",
            height: "min(50vw, 280px)",
            transformStyle: "preserve-3d",
            animation:
              stage === "rising"
                ? "letter-rise 1.6s cubic-bezier(0.6, 0, 0.4, 1) forwards"
                : "fade-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s both",
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute -inset-6 rounded-sm"
            style={{
              background:
                "radial-gradient(ellipse, color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          {/* Body */}
          <div
            className="absolute inset-0 rounded-sm border shadow-luxe"
            style={{
              borderColor: "color-mix(in oklab, var(--moss-deep) 30%, transparent)",
              backgroundImage:
                "linear-gradient(135deg, var(--cream) 0%, var(--ivory) 50%, color-mix(in oklab, var(--cream) 80%, var(--moss) 20%) 100%)",
            }}
          />
          {/* Inner border */}
          <div
            className="absolute inset-3 rounded-sm border"
            style={{
              borderColor: "color-mix(in oklab, var(--moss-deep) 20%, transparent)",
            }}
          />

          {/* Side flaps for depth */}
          <div
            className="absolute left-0 top-0 h-full w-1/2"
            style={{
              background:
                "linear-gradient(110deg, transparent 50%, color-mix(in oklab, var(--moss) 25%, transparent) 50%)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2"
            style={{
              background:
                "linear-gradient(70deg, color-mix(in oklab, var(--moss) 25%, transparent) 50%, transparent 50%)",
            }}
          />

          {/* Engraved center initials */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: stage === "idle" ? 0.55 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            <span className="font-script text-5xl text-primary md:text-6xl">M &amp; G</span>
          </div>

          {/* Top flap */}
          <div
            className="absolute left-0 top-0 h-1/2 w-full origin-top"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background:
                "linear-gradient(180deg, var(--cream), color-mix(in oklab, var(--moss) 30%, var(--cream)))",
              borderTop:
                "1px solid color-mix(in oklab, var(--moss-deep) 30%, transparent)",
              transform: stage === "idle" ? "rotateX(0deg)" : "rotateX(-180deg)",
              transformOrigin: "top center",
              transition: "transform 1.4s cubic-bezier(0.6, 0, 0.4, 1)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Wax seal */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: "translate(-50%,-50%)",
              animation:
                stage !== "idle" ? "seal-break 1s ease-out forwards" : undefined,
            }}
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground shadow-luxe ring-2 ring-[color-mix(in_oklab,var(--gold)_50%,transparent)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--moss) 50%, var(--moss-deep)), var(--moss-deep) 70%)",
              }}
            >
              <span className="font-script text-3xl">M&amp;G</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {stage === "idle" && (
          <button
            type="button"
            onClick={() => setStage("opening")}
            className="group relative mt-2 inline-flex items-center gap-4 rounded-full border border-primary/50 bg-card/70 px-10 py-4 font-display text-xs uppercase text-primary backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground animate-fade-up"
            style={{ animationDelay: "1.2s", letterSpacing: "0.4em" }}
          >
            <img src={leaf} alt="" width={20} height={20} className="opacity-70" />
            Atverti laišką
            <img src={leaf} alt="" width={20} height={20} className="opacity-70 -scale-x-100" />
          </button>
        )}

        {stage === "idle" && (
          <p
            className="max-w-md font-serif text-lg italic text-muted-foreground animate-fade-up md:text-xl"
            style={{ animationDelay: "1.4s" }}
          >
            Su didžiausiu džiaugsmu kviečiame Jus į ypatingą mūsų gyvenimo dieną
          </p>
        )}
      </div>
    </div>
  );
}
