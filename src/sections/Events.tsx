import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import { CalendarPlus, Download, Flame, Sparkles, MapPin, Navigation } from "lucide-react";
import { invite, type WeddingEvent } from "@/config";
import { googleCalendarUrl, downloadIcs } from "@/lib/calendar";
import PetalRain from "@/components/PetalRain";

/* ── Marigold petal burst (fires when calendar is added) ───── */
function PetalBurst({ burstKey }: { burstKey: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 + (i % 3) * 0.2;
        const dist = 56 + ((i * 29) % 48);
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 24,
          size: 8 + ((i * 5) % 8),
          spin: 140 + ((i * 47) % 220),
          rose: i % 4 === 3,
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {burstKey > 0 && (
        <div
          key={burstKey}
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
        >
          {petals.map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 1.1, rotate: p.spin }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className={`petal ${p.rose ? "petal-rose" : ""}`}
              style={{ position: "absolute", top: "auto", width: p.size, height: p.size, animation: "none" }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Rotating mandala ring behind the muhurtham time ───────── */
function MandalaRing() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className="absolute inset-0 h-full w-full animate-[spin_46s_linear_infinite]"
      fill="none"
    >
      <circle cx="100" cy="100" r="96" stroke="hsl(var(--gold))" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="3 7" />
      <circle cx="100" cy="100" r="84" stroke="hsl(var(--gold))" strokeOpacity="0.35" strokeWidth="1" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const inner = i % 2 === 0 ? 88 : 92;
        return (
          <line
            key={i}
            x1={100 + inner * Math.cos(a)}
            y1={100 + inner * Math.sin(a)}
            x2={100 + 96 * Math.cos(a)}
            y2={100 + 96 * Math.sin(a)}
            stroke="hsl(var(--gold))"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={100 + 74 * Math.cos(a)}
            cy={100 + 74 * Math.sin(a)}
            r="2.2"
            fill="hsl(var(--marigold))"
            fillOpacity="0.8"
          />
        );
      })}
    </svg>
  );
}

/* ── 3D tilt wrapper with pointer-following shine ──────────── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(40);
  const shine = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,236,190,0.35) 0%, transparent 55%)`;

  return (
    <div style={{ perspective: 1100 }}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * 8);
          rx.set((0.5 - py) * 8);
          gx.set(px * 100);
          gy.set(py * 100);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
          gx.set(50);
          gy.set(40);
        }}
        className="relative"
      >
        {children}
        <motion.div
          aria-hidden
          style={{ background: shine }}
          className="pointer-events-none absolute inset-0 rounded-3xl"
        />
      </motion.div>
    </div>
  );
}

/* ── Single event card ─────────────────────────────────────── */
function EventCard({ ev, index }: { ev: WeddingEvent; index: number }) {
  const [burst, setBurst] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: index * 0.15, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <TiltCard>
        <div className="card-frame rounded-3xl px-6 py-9 sm:px-8 flex flex-col items-center text-center h-full justify-between">
          <div>
            {/* emblem */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#F6B93B] to-[#E8751A] text-white shadow-[0_10px_26px_-6px_rgba(232,117,26,0.6)]"
            >
              {ev.id === "thalikettu" ? <Flame size={26} className="animate-flame" /> : <Sparkles size={26} />}
            </motion.div>

            <p className="mt-5 font-caps text-[10px] sm:text-[11px] text-[hsl(var(--gold))] tracking-[0.25em]">
              {ev.label}
            </p>
            <h3 className="mt-1 font-script text-4xl sm:text-5xl text-gradient-sindoor leading-tight">
              {ev.title}
            </h3>

            {/* time centerpiece with rotating mandala */}
            <div className="relative mx-auto mt-6 flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
              <MandalaRing />
              <div className="text-center px-4" style={{ transform: "translateZ(30px)" }}>
                <span className="font-serif-body font-semibold text-2xl sm:text-3xl text-gradient-gold leading-tight block">
                  {ev.timeLine}
                </span>
                <span className="block mt-1 font-caps text-[9px] sm:text-[10px] text-[hsl(var(--sindoor))] tracking-widest uppercase">
                  IST (Kerala)
                </span>
              </div>
            </div>

            <p className="mt-5 font-serif-body font-semibold text-lg sm:text-xl text-[hsl(var(--foreground))]">
              {ev.dateLine}
            </p>

            {/* Venue info */}
            <div className="mt-4 rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/60 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8f1d3a]">
                <MapPin size={14} className="shrink-0 text-[#c62b4f]" />
                <span>{ev.venueName}</span>
              </div>
              <p className="mt-1 font-serif-body text-xs text-neutral-600">
                {ev.venueAddress}
              </p>
              {ev.subVenueNote && (
                <p className="mt-1.5 font-serif-body italic text-xs text-[hsl(var(--leaf))] border-t border-amber-200/40 pt-1.5">
                  {ev.subVenueNote}
                </p>
              )}
            </div>
          </div>

          {/* calendar & navigation actions */}
          <div className="relative mt-7 flex w-full flex-col items-center gap-2.5">
            <PetalBurst burstKey={burst} />
            
            <a
              href={ev.mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[hsl(var(--gold)/0.6)] bg-white/80 py-2.5 font-caps text-[10px] text-[#8f1d3a] shadow-sm transition-all hover:bg-amber-100/50 hover:scale-[1.02]"
            >
              <Navigation size={13} className="text-[#c62b4f]" />
              View Location Map
            </a>

            <motion.a
              href={googleCalendarUrl(ev)}
              target="_blank"
              rel="noreferrer"
              onClick={() => setBurst((b) => b + 1)}
              whileTap={{ scale: 0.94 }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8f1d3a] to-[#c62b4f] px-5 py-2.5 font-caps text-[10px] sm:text-[11px] text-white shadow-[0_10px_24px_-8px_rgba(143,29,58,0.55)] transition-transform hover:scale-[1.02]"
            >
              <CalendarPlus size={14} />
              Add to Google Calendar
            </motion.a>

            <motion.button
              onClick={() => {
                downloadIcs(ev);
                setBurst((b) => b + 1);
              }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex items-center gap-1.5 font-serif-body text-xs text-[hsl(var(--gold))] underline-offset-4 hover:underline pt-1"
            >
              <Download size={13} />
              Apple / Outlook (.ics)
            </motion.button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Events() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 px-6">
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/bg-texture.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      {/* warm glow behind the cards */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(246,185,59,0.20) 0%, rgba(224,71,106,0.08) 50%, transparent 78%)",
        }}
      />
      <PetalRain count={8} />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="ornament-divider text-xl">❁</div>
          <h2 className="mt-4 font-script text-5xl sm:text-6xl text-gradient-gold">
            The Auspicious Celebrations
          </h2>
          <p className="mt-2 font-serif-body italic text-base text-[hsl(var(--foreground)/0.75)]">
            Join us in commemorating our sacred vows and celebrating together
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {invite.events.map((ev, i) => (
            <EventCard key={ev.id} ev={ev} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
