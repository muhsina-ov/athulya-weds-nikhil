import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

function Tile({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="card-frame rounded-2xl px-2 py-4 sm:px-5 sm:py-6 text-center animate-glow">
      <div className="relative h-10 sm:h-14 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={text}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="font-serif-body font-semibold text-3xl sm:text-5xl text-gradient-sindoor leading-none"
          >
            {text}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-2 font-caps text-[9px] sm:text-[11px] text-[hsl(var(--leaf))]">
        {label}
      </div>
    </div>
  );
}

export default function Countdown({ targetISO, label }: { targetISO: string; label: string }) {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState<Parts>(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div>
      <p className="font-caps text-[10px] sm:text-xs text-[hsl(var(--gold))] mb-5">{label}</p>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
        <Tile value={t.days} label="Days" />
        <Tile value={t.hours} label="Hours" />
        <Tile value={t.minutes} label="Mins" />
        <Tile value={t.seconds} label="Secs" />
      </div>
    </div>
  );
}
