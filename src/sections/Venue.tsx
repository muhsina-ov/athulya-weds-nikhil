import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Church, PartyPopper } from "lucide-react";
import { invite } from "@/config";

export default function Venue() {
  const [activeTab, setActiveTab] = useState<"thalikettu" | "reception">("thalikettu");

  const currentEvent = invite.events.find((e) => e.id === activeTab) ?? invite.events[0];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 px-6">
      <img
        src="https://media.invitestory.in/shubha-vivaham/assets/bg-texture.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="ornament-divider text-xl">❁</div>
          <h2 className="mt-4 font-script text-5xl sm:text-6xl text-gradient-gold">
            Locations &amp; Directions
          </h2>
          <p className="mt-2 font-serif-body text-base text-[hsl(var(--foreground)/0.75)]">
            Find your way to our sacred ceremonies and celebratory reception in Thrissur, Kerala
          </p>

          {/* Venue Selector Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-white/70 border border-[hsl(var(--gold)/0.4)] shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("thalikettu")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-caps transition-all ${
                activeTab === "thalikettu"
                  ? "bg-gradient-to-r from-[#8f1d3a] to-[#c62b4f] text-white shadow-md"
                  : "text-[#8f1d3a] hover:text-[#c62b4f]"
              }`}
            >
              <Church size={14} />
              <span>Thalikettu &amp; Lunch</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reception")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-caps transition-all ${
                activeTab === "reception"
                  ? "bg-gradient-to-r from-[#8f1d3a] to-[#c62b4f] text-white shadow-md"
                  : "text-[#8f1d3a] hover:text-[#c62b4f]"
              }`}
            >
              <PartyPopper size={14} />
              <span>Reception</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-8"
            >
              {/* Venue details */}
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex items-center gap-2 text-[hsl(var(--sindoor))] font-semibold">
                  <MapPin size={22} className="shrink-0" />
                  <span className="font-serif-body text-2xl sm:text-3xl text-gradient-sindoor">
                    {currentEvent.venueName}
                  </span>
                </div>
                <p className="font-serif-body text-base sm:text-lg text-[hsl(var(--foreground)/0.8)] max-w-lg">
                  {currentEvent.venueAddress}
                </p>
                {currentEvent.subVenueNote && (
                  <p className="font-serif-body italic text-sm text-[hsl(var(--leaf))] max-w-md mt-1">
                    {currentEvent.subVenueNote}
                  </p>
                )}
                <div className="mt-2 inline-block rounded-full bg-amber-100/70 border border-amber-300/60 px-4 py-1 font-caps text-[10px] text-amber-900 tracking-wider">
                  Timing: {currentEvent.timeLine}
                </div>
              </div>

              {/* Live map preview */}
              <div className="card-frame mt-7 overflow-hidden rounded-3xl shadow-xl">
                <iframe
                  title={`Map — ${currentEvent.venueName}`}
                  src={currentEvent.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full sm:h-80 border-0"
                  allowFullScreen
                />
              </div>

              {/* Get Directions Link Button */}
              <div className="mt-6 flex justify-center">
                <a
                  href={currentEvent.mapDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b5741b] via-[#d99a2b] to-[#e8a93c] px-8 py-3.5 font-caps text-xs text-white shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.04] hover:shadow-xl active:scale-95"
                >
                  <Navigation size={16} />
                  Open in Google Maps ({activeTab === "thalikettu" ? "Peramangalam" : "Arimbur"})
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
