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
      const t1 = setTimeout(() => setStage("rising"), 1400);
      const t2 = setTimeout(() => {
        setStage("gone");
        onOpen();
      }, 2600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage, onOpen]);

  if (stage === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--ivory)]"
      style={{
        animation: stage === "rising" ? "fade-in 1.2s ease-in reverse forwards" : undefined,
      }}
    >
      <div
        className="relative flex flex-col items-center gap-10 px-6 text-center"
        style={{
          perspective: "1400px",
        }}
      >
        <p className="hairline animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Kvietimas
        </p>
        <h2
          className="font-serif text-3xl italic text-primary md:text-4xl animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {greeting}
        </h2>

        {/* Envelope */}
        <div
          className="relative mt-4"
          style={{
            width: "min(78vw, 420px)",
            height: "min(48vw, 260px)",
            transformStyle: "preserve-3d",
            animation:
              stage === "rising"
                ? "letter-rise 1.4s cubic-bezier(0.6, 0, 0.4, 1) forwards"
                : "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.7s both",
          }}
        >
          {/* Body */}
          <div
            className="absolute inset-0 rounded-sm border border-[color-mix(in_oklab,var(--sage-deep)_25%,transparent)] bg-card shadow-soft"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--cream), var(--ivory))",
            }}
          />

          {/* Side flaps for depth */}
          <div
            className="absolute left-0 top-0 h-full w-1/2"
            style={{
              background:
                "linear-gradient(110deg, transparent 50%, color-mix(in oklab, var(--sage) 25%, transparent) 50%)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2"
            style={{
              background:
                "linear-gradient(70deg, color-mix(in oklab, var(--sage) 25%, transparent) 50%, transparent 50%)",
            }}
          />

          {/* Top flap */}
          <div
            className="absolute left-0 top-0 h-1/2 w-full origin-top"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background:
                "linear-gradient(180deg, var(--cream), color-mix(in oklab, var(--sage) 30%, var(--cream)))",
              borderTop: "1px solid color-mix(in oklab, var(--sage-deep) 25%, transparent)",
              transform:
                stage === "idle" ? "rotateX(0deg)" : "rotateX(-180deg)",
              transformOrigin: "top center",
              transition: "transform 1.2s cubic-bezier(0.6, 0, 0.4, 1)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Wax seal */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation:
                stage !== "idle"
                  ? "seal-break 0.8s ease-out forwards"
                  : undefined,
            }}
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground shadow-soft"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--sage) 50%, var(--sage-deep)), var(--sage-deep))",
              }}
            >
              <span className="font-serif text-xl italic">M&amp;G</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {stage === "idle" && (
          <button
            type="button"
            onClick={() => setStage("opening")}
            className="group relative inline-flex items-center gap-3 rounded-full border border-primary/40 bg-card/60 px-8 py-3 text-xs uppercase tracking-[0.35em] text-primary backdrop-blur-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground animate-fade-up"
            style={{ animationDelay: "1.1s" }}
          >
            <img src={leaf} alt="" width={18} height={18} className="opacity-70" />
            Atverti laišką
            <img src={leaf} alt="" width={18} height={18} className="opacity-70 -scale-x-100" />
          </button>
        )}

        {stage === "idle" && (
          <p
            className="max-w-sm font-serif text-base italic text-muted-foreground animate-fade-up"
            style={{ animationDelay: "1.3s" }}
          >
            Su didžiausiu džiaugsmu kviečiame Jus į ypatingą mūsų gyvenimo dieną.
          </p>
        )}
      </div>
    </div>
  );
}
