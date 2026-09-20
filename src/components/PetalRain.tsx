import { useMemo } from "react";

interface Petal {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  opacity: number;
  rose: boolean;
}

/** Falling marigold / rose petals — pure CSS animation, absolute within parent. */
export default function PetalRain({ count = 14 }: { count?: number }) {
  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97 + 13) % 100,
        size: 10 + ((i * 7) % 12),
        delay: -((i * 1.37) % 12),
        duration: 9 + ((i * 2.3) % 7),
        drift: ((i % 2 === 0 ? 1 : -1) * (30 + ((i * 11) % 50))),
        spin: 240 + ((i * 53) % 240),
        opacity: 0.55 + ((i * 13) % 40) / 100,
        rose: i % 4 === 3,
      })),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal ${p.rose ? "petal-rose" : ""}`}
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--petal-drift": `${p.drift}px`,
              "--petal-spin": `${p.spin}deg`,
              "--petal-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
