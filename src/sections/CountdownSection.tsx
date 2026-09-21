import { motion } from "framer-motion";
import Countdown from "@/components/Countdown";
import ScratchCard from "@/components/ScratchCard";
import { invite } from "@/config";

export default function CountdownSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 px-6">
      {/* warm radial glow behind the tiles */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(246,185,59,0.22) 0%, rgba(224,71,106,0.10) 45%, transparent 75%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center"
      >
        <div className="ornament-divider text-xl mb-3">❁</div>
        <h2 className="font-script text-5xl sm:text-6xl text-gradient-gold mb-3 py-1 overflow-visible">
          Counting the Moments
        </h2>
        <p className="font-serif-body italic text-base text-[hsl(var(--foreground)/0.75)] mb-8">
          A special surprise awaits — scratch to uncover our sacred muhurtham countdown
        </p>

        <ScratchCard>
          <Countdown targetISO={invite.countdownTargetISO} label={invite.countdownLabel} />
        </ScratchCard>
      </motion.div>
    </section>
  );
}
