import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { invite } from "@/config";

/**
 * Footer — layered composition:
 *   1. deep sindoor-maroon gradient base
 *   2. ivory texture blended in, dimmed  → "image/texture behind"
 *   3. big script monogram + blessing text behind the art
 *   4. static transparent PNG overlay (kalash, diyas, homam) on top
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* 1 — base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6d1a2e] via-[#57152a] to-[#3d1020]" />
      {/* 2 — texture behind */}
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/bg-texture.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.14] mix-blend-luminosity"
      />

      {/* 3 — text behind the overlay art */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-64 sm:pb-80 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-script text-6xl sm:text-8xl text-gradient-gold animate-shimmer"
        >
          {invite.brideFirst} &amp; {invite.groomFirst}
        </motion.p>

        <p className="mt-5 max-w-md font-serif-body italic text-lg sm:text-xl text-[#f7e8d0]/90">
          {invite.footerBlessing}
        </p>

        <div className="mt-6 flex items-center gap-2 font-caps text-[10px] sm:text-xs text-[#e8a93c]">
          <Heart size={12} fill="currentColor" />
          <span>{invite.hashtag}</span>
          <Heart size={12} fill="currentColor" />
        </div>

        <p className="mt-10 font-serif-body text-xs text-[#f7e8d0]/50">{invite.creditLine}</p>

        <a
          href="https://www.instagram.com/invitestory.in/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 font-caps text-[10px] uppercase tracking-[0.35em] text-[#e8a93c]/80 transition-colors hover:text-[#e8a93c]"
        >
          Follow @invitestory.in on Instagram
        </a>
      </div>

      {/* 4 — static transparent PNG overlay on top of the text */}
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/footer-overlay.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-[150%] max-w-none -translate-x-1/2 sm:w-[110%]"
      />
    </footer>
  );
}
