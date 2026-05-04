import { useMemo } from "react";
import petal from "@/assets/petal.png";
import leaf from "@/assets/leaf.png";

const COUNT = 28;

export function PetalsOverlay() {
  const petals = useMemo(
    () =>
      Array.from({ length: COUNT }).map((_, i) => {
        const isLeaf = i % 3 === 0;
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 12,
          duration: 14 + Math.random() * 14,
          size: 22 + Math.random() * 28,
          drift: (Math.random() - 0.5) * 240,
          rotate: Math.random() * 360,
          opacity: 0.45 + Math.random() * 0.4,
          src: isLeaf ? leaf : petal,
        };
      }),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <img
          key={p.id}
          src={p.src}
          alt=""
          loading="lazy"
          width={p.size}
          height={p.size}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: "auto",
            transform: `rotate(${p.rotate}deg)`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
            ["--max-op" as string]: String(p.opacity),
            filter: "drop-shadow(0 4px 8px rgba(50,80,55,0.18))",
          }}
        />
      ))}
    </div>
  );
}
