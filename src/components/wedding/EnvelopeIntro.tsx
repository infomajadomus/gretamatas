import { useEffect, useState } from "react";

interface Props {
  greeting: string;
  onOpen: () => void;
}

export function EnvelopeIntro({ greeting, onOpen }: Props) {
  const [stage, setStage] = useState<"idle" | "opening" | "rising" | "gone">("idle");

  useEffect(() => {
    if (stage === "opening") {
      const t1 = setTimeout(() => setStage("rising"), 1700);
      const t2 = setTimeout(() => {
        setStage("gone");
        onOpen();
      }, 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage, onOpen]);

  if (stage === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4"
      style={{
        background:
          "radial-gradient(ellipse at center, var(--cream) 0%, color-mix(in oklab, var(--ivory) 80%, var(--moss-deep) 20%) 100%)",
        animation: stage === "rising" ? "fade-in 1.2s ease-in reverse forwards" : undefined,
      }}
    >
      {/* Hidden ghost initials */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "min(38vw, 28rem)",
          color: "var(--moss-deep)",
          opacity: 0.07,
          letterSpacing: "-0.05em",
        }}
      >
        M&nbsp;&amp;&nbsp;G
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-[12%] flex justify-center"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "min(2.4vw, 0.95rem)",
          letterSpacing: "0.55em",
          color: "var(--moss-deep)",
          opacity: 0.28,
        }}
      >
        2026 · 09 · 06
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[10%] flex justify-center"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "min(2.4vw, 0.95rem)",
          letterSpacing: "0.55em",
          color: "var(--moss-deep)",
          opacity: 0.28,
        }}
      >
        15:00 · VILNIUS
      </div>

      <div
        className="relative flex flex-col items-center gap-7 text-center"
        style={{ perspective: "1800px" }}
      >
        <p
          className="font-serif italic animate-fade-up"
          style={{
            animationDelay: "0.2s",
            letterSpacing: "0.45em",
            color: "var(--moss-deep)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
          }}
        >
          ◈  Kvietimas  ◈
        </p>
        <h2
          className="font-serif italic text-primary animate-fade-up"
          style={{
            animationDelay: "0.5s",
            fontSize: "clamp(2rem, 5vw, 3.75rem)",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          {greeting}
        </h2>

        {/* Envelope */}
        <div
          className="relative mt-2"
          style={{
            width: "min(85vw, 480px)",
            height: "min(52vw, 300px)",
            transformStyle: "preserve-3d",
            animation:
              stage === "rising"
                ? "letter-rise 1.7s cubic-bezier(0.6, 0, 0.4, 1) forwards"
                : "fade-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s both",
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute -inset-8 rounded-sm"
            style={{
              background:
                "radial-gradient(ellipse, color-mix(in oklab, var(--gold) 25%, transparent), transparent 70%)",
              filter: "blur(28px)",
            }}
          />
          {/* Body */}
          <div
            className="absolute inset-0 rounded-sm border shadow-luxe"
            style={{
              borderColor: "color-mix(in oklab, var(--moss-deep) 35%, transparent)",
              backgroundImage:
                "linear-gradient(135deg, var(--cream) 0%, var(--ivory) 60%, var(--cream) 100%)",
            }}
          />
          {/* Inner border */}
          <div
            className="absolute inset-3 rounded-sm border"
            style={{
              borderColor: "color-mix(in oklab, var(--moss-deep) 18%, transparent)",
            }}
          />

          {/* Engraved center monogram (subtle, like letterpress) */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: stage === "idle" ? 0.32 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            <span
              className="font-serif italic"
              style={{
                color: "var(--moss-deep)",
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              M &amp; G
            </span>
          </div>

          {/* Top flap */}
          <div
            className="absolute left-0 top-0 h-1/2 w-full origin-top"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background:
                "linear-gradient(180deg, var(--cream), color-mix(in oklab, var(--moss) 18%, var(--cream)))",
              borderTop:
                "1px solid color-mix(in oklab, var(--moss-deep) 35%, transparent)",
              transform: stage === "idle" ? "rotateX(0deg)" : "rotateX(-180deg)",
              transformOrigin: "top center",
              transition: "transform 1.5s cubic-bezier(0.6, 0, 0.4, 1)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Realistic wax seal */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: "translate(-50%,-50%)",
              animation:
                stage !== "idle" ? "seal-break 1s ease-out forwards" : undefined,
            }}
          >
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, #b04545 0%, #8a2a2a 40%, #5a1414 90%)",
                boxShadow:
                  "inset -6px -6px 14px rgba(0,0,0,0.55), inset 6px 6px 14px rgba(255,255,255,0.18), 0 8px 22px -6px rgba(60,10,10,0.55)",
              }}
            >
              {/* drip edges */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 70% 80%, rgba(0,0,0,0.35), transparent 40%), radial-gradient(circle at 20% 70%, rgba(0,0,0,0.25), transparent 35%)",
                  mixBlendMode: "multiply",
                }}
              />
              <span
                className="relative font-serif italic"
                style={{
                  color: "#f3e1c7",
                  fontSize: "1.7rem",
                  fontWeight: 500,
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  letterSpacing: "0.02em",
                }}
              >
                M&amp;G
              </span>
              {/* inner ring */}
              <span
                className="pointer-events-none absolute inset-2 rounded-full"
                style={{
                  border: "1px dashed rgba(243,225,199,0.35)",
                }}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        {stage === "idle" && (
          <button
            type="button"
            onClick={() => setStage("opening")}
            className="group relative mt-4 inline-flex items-center gap-4 rounded-full border border-primary/60 bg-card/70 px-10 py-4 font-serif italic text-primary backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground animate-fade-up"
            style={{ animationDelay: "1.2s", letterSpacing: "0.25em", fontSize: "0.85rem" }}
          >
            Atverti laišką
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
