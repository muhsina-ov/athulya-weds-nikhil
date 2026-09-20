import { motion } from "framer-motion";
import Countdown from "@/components/Countdown";
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
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center"
      >
        <h2 className="font-script text-5xl sm:text-6xl text-gradient-gold mb-8">
          Counting the Moments
        </h2>
        <Countdown targetISO={invite.countdownTargetISO} label={invite.countdownLabel} />
      </motion.div>
    </section>
  );
}
