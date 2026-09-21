import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Aurora from "@/components/Aurora";
import PetalRain from "@/components/PetalRain";
import { invite } from "@/config";

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden flex flex-col justify-between">
      {/* Layer 1 — aurora glow (React Bits) */}
      <div className="absolute inset-0 opacity-40">
        <Aurora colorStops={["#F6B93B", "#E0476A", "#7FB069"]} amplitude={1.15} blend={0.6} speed={0.55} />
      </div>

      {/* Layer 2 — ivory paper texture above aurora */}
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/bg-texture.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-75"
      />

      {/* Layer 3 — falling petals */}
      <PetalRain count={16} />

      {/* Marigold toran — spans full width at the top */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-20 w-full"
      >
        <img
          src="https://media.invitestory.in/shubha-vivaham/assets/toran-top.png"
          alt=""
          className="animate-sway block w-full drop-shadow-md"
        />
      </motion.div>

      {/* Banana leaves framing the bottom corners */}
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/banana-leaves.png"
        alt=""
        className="pointer-events-none absolute -bottom-3 -left-4 w-44 sm:w-72 z-10 opacity-90"
      />
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/banana-leaves.png"
        alt=""
        className="pointer-events-none absolute -bottom-3 -right-4 w-44 sm:w-72 -scale-x-100 z-10 opacity-90"
      />

      {/* Centre content — fills the space under the toran */}
      <div className="relative z-30 flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-2 text-center">
        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="font-caps text-xs sm:text-sm text-[hsl(var(--leaf))] tracking-[0.25em]"
        >
          {invite.greetingMalayalam} · {invite.greetingEnglish}
        </motion.p>

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.35}
          className="mt-2 font-script text-6xl sm:text-8xl text-gradient-sindoor animate-shimmer py-1 overflow-visible"
        >
          {invite.groomFirst}
        </motion.h1>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.5}
          className="ornament-divider my-1.5"
        >
          <span className="font-script text-3xl sm:text-4xl text-gradient-gold">weds</span>
        </motion.div>

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.65}
          className="font-script text-6xl sm:text-8xl text-gradient-sindoor animate-shimmer py-1 overflow-visible"
        >
          {invite.brideFirst}
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.85}
          className="mt-4 font-caps text-xs sm:text-base text-[hsl(var(--foreground))] tracking-[0.35em] font-medium"
        >
          {invite.weddingDateFormatted}
        </motion.p>

        {/* Kerala Couple Caricature Portrait without frame */}
        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={1.05}
          className="animate-float relative mt-6 flex justify-center items-center"
        >
          <img
            src="/assets/couple.png"
            alt={`${invite.groomFirst} & ${invite.brideFirst}`}
            className="relative z-10 w-64 sm:w-80 max-h-[420px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-30 pb-4 flex justify-center text-[hsl(var(--gold))]"
      >
        <ChevronDown className="animate-scroll-hint" size={26} />
      </motion.div>
    </section>
  );
}
