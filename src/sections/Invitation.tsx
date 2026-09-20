import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { invite } from "@/config";

/* ── Self-drawing rangoli mandala backdrop ─────────────────── */
function Rangoli() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (d: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { delay: d, duration: 2.2, ease: "easeInOut" as const },
    }),
  };
  return (
    <motion.svg
      viewBox="0 0 300 300"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pointer-events-none absolute left-1/2 top-1/2 -z-0 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
      style={{ color: "hsl(var(--gold))" }}
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "150px 150px" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <motion.circle cx="150" cy="150" r="140" variants={draw} custom={0} />
        <motion.circle cx="150" cy="150" r="112" variants={draw} custom={0.25} strokeDasharray="4 7" />
        <motion.circle cx="150" cy="150" r="78" variants={draw} custom={0.5} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <motion.path
              key={i}
              d={`M ${150 + 82 * Math.cos(a)} ${150 + 82 * Math.sin(a)}
                  Q ${150 + 105 * Math.cos(a + 0.26)} ${150 + 105 * Math.sin(a + 0.26)}
                    ${150 + 108 * Math.cos(a)} ${150 + 108 * Math.sin(a)}`}
              variants={draw}
              custom={0.7 + i * 0.06}
            />
          );
        })}
        <motion.path
          d="M150 92 l14 29 31 3 -23 21 6 31 -28 -16 -28 16 6 -31 -23 -21 31 -3 z"
          variants={draw}
          custom={1.4}
        />
      </motion.g>
    </motion.svg>
  );
}

/* ── Word-by-word message reveal ───────────────────────────── */
function Message({ opened }: { opened: boolean }) {
  const words = invite.inviteMessage.split(" ");
  return (
    <motion.p
      initial="hidden"
      animate={opened ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.028, delayChildren: 0.75 } } }}
      className="font-serif-body italic text-base sm:text-lg leading-relaxed text-[hsl(var(--foreground)/0.85)]"
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 6, filter: "blur(3px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35 } },
          }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ── Sealed envelope → tap to open ─────────────────────────── */
function Envelope() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="mt-10">
      <motion.div
        role="button"
        aria-label={opened ? "Invitation opened" : "Tap to open the invitation"}
        onClick={() => setOpened(true)}
        whileTap={opened ? undefined : { scale: 0.97 }}
        className={`relative mx-auto max-w-sm select-none ${opened ? "" : "cursor-pointer"}`}
        style={{ perspective: 1000 }}
      >
        {/* Letter (in flow — defines the height) */}
        <motion.div
          animate={opened ? { scale: 1.03, transition: { delay: 0.55, type: "spring", stiffness: 200, damping: 15 } } : { scale: 0.96 }}
          className="card-frame relative z-10 rounded-2xl p-6 sm:p-7"
        >
          <div className="ornament-divider text-sm mb-4">❁</div>
          <Message opened={opened} />
        </motion.div>

        {/* Envelope pocket (V shape covering the letter) */}
        <motion.div
          aria-hidden
          initial={false}
          animate={opened ? { opacity: 0, y: 36, transition: { delay: 0.45, duration: 0.45 } } : { opacity: 1, y: 0 }}
          className="absolute inset-0 z-20 rounded-2xl"
          style={{
            clipPath: "polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)",
            background: "linear-gradient(160deg, #8f1d3a 0%, #6d142c 55%, #57102a 100%)",
            boxShadow: "inset 0 0 0 1px rgba(232,169,60,0.5), 0 14px 34px -12px rgba(80,10,30,0.45)",
          }}
        />

        {/* Envelope flap (folds open) */}
        <motion.div
          aria-hidden
          initial={false}
          animate={opened ? { rotateX: -178, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
          transition={{ duration: 0.55, ease: "easeInOut", delay: opened ? 0.12 : 0 }}
          className="absolute inset-x-0 top-0 z-30 h-[52%] rounded-t-2xl"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 92%)",
            transformOrigin: "top center",
            background: "linear-gradient(180deg, #a52a44 0%, #7c1832 90%)",
            boxShadow: "inset 0 0 0 1px rgba(232,169,60,0.45)",
          }}
        />

        {/* Wax seal */}
        <motion.button
          type="button"
          aria-hidden
          tabIndex={-1}
          initial={false}
          animate={
            opened
              ? { scale: 0, rotate: 40, opacity: 0, x: "-50%", y: "-50%" }
              : { scale: 1, rotate: 0, opacity: 1, x: "-50%", y: "-50%" }
          }
          transition={{ duration: 0.35, ease: "backIn" }}
          className="animate-glow absolute left-1/2 top-1/2 z-40 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "radial-gradient(circle at 34% 30%, #f7d784 0%, #d99a2b 45%, #a86f14 100%)",
            boxShadow: "0 6px 16px rgba(120,70,0,0.45), inset 0 -3px 6px rgba(90,50,0,0.4), inset 0 2px 4px rgba(255,240,200,0.7)",
          }}
        >
          <span className="font-script text-xl text-[#5d3603]">{invite.monogram}</span>
        </motion.button>
      </motion.div>

      {/* Hint */}
      <motion.p
        animate={opened ? { opacity: 0, y: -6 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-5 font-caps text-[10px] sm:text-[11px] text-[hsl(var(--gold))]"
      >
        {opened ? "\u00A0" : "✦ Tap the seal to open ✦"}
      </motion.p>
    </div>
  );
}

/* ── Family card sliding in from a side ────────────────────── */
function FamilyCard({
  side,
  role,
  name,
  parents,
}: {
  side: "left" | "right";
  role: string;
  name: string;
  parents: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -70 : 70, rotate: side === "left" ? -3 : 3 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="card-frame rounded-2xl p-5 transition-shadow hover:shadow-[0_24px_60px_-18px_rgba(143,29,58,0.35)]"
    >
      <p className="font-caps text-[10px] text-[hsl(var(--sindoor))] mb-2">{role}</p>
      <p className="font-script text-4xl text-gradient-sindoor">{name}</p>
      <p className="mt-3 font-serif-body text-sm leading-snug text-[hsl(var(--foreground)/0.75)]">
        {parents}
      </p>
    </motion.div>
  );
}

export default function Invitation() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 px-6">
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/bg-texture.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <Rangoli />

      <div className="relative mx-auto max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="ornament-divider text-xl">❁</div>
          <h2 className="mt-4 font-script text-5xl sm:text-6xl text-gradient-gold">
            The Invitation
          </h2>
        </motion.div>

        <Envelope />

        {/* Two families meet */}
        <div className="mt-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-[hsl(var(--gold)/0.8)]" />
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#c62b4f]"
            >
              <Heart size={22} fill="currentColor" />
            </motion.span>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-[hsl(var(--gold)/0.8)]" />
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
            <FamilyCard side="left" role="The Bride" name={invite.brideFirst} parents={invite.brideParents} />
            <FamilyCard side="right" role="The Groom" name={invite.groomFirst} parents={invite.groomParents} />
          </div>
        </div>
      </div>
    </section>
  );
}
