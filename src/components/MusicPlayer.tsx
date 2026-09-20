import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.75;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Autoplay policy prevented immediate playback; waiting for user interaction
        setIsPlaying(false);
      }
    };

    playAudio();

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("scroll", handleFirstInteraction, { once: true });

    const toastTimer = setTimeout(() => {
      setShowToast(false);
    }, 8000);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      clearTimeout(toastTimer);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowToast(false);
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/assets/bgm.m4a" type="audio/mp4" />
        <source src="/assets/bgm.webm" type="audio/webm" />
      </audio>

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Floating Toast Pill */}
        <AnimatePresence>
          {showToast && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              onClick={togglePlay}
              className="hidden sm:flex cursor-pointer items-center gap-2 rounded-full border border-[hsl(var(--gold)/0.6)] bg-[#2b0d18]/90 px-4 py-2 text-xs font-serif-body text-[#f7d784] shadow-xl backdrop-blur-md transition-all hover:bg-[#3d1222]"
            >
              <Music size={14} className="animate-bounce text-[#e8a93c]" />
              <span>Tap to play wedding BGM</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Music Button */}
        <motion.button
          type="button"
          onClick={togglePlay}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
          className={`relative flex h-13 w-13 items-center justify-center rounded-full p-3.5 shadow-2xl transition-all duration-300 ${
            isPlaying
              ? "bg-gradient-to-tr from-[#8f1d3a] via-[#b52648] to-[#e8a93c] text-white shadow-[0_0_24px_rgba(232,169,60,0.55)]"
              : "bg-[#2b0d18]/90 text-[#e8a93c] border border-[hsl(var(--gold)/0.5)] shadow-lg backdrop-blur-md"
          }`}
        >
          {/* Animated pulsing wave rings when playing */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-full border-2 border-[#e8a93c]/50 animate-ping"
              style={{ animationDuration: "2.4s" }}
            />
          )}

          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <Volume2 size={20} className="relative z-10" />
              {/* Spinning music glyph */}
              <span className="absolute -top-3 -right-2 text-[10px] animate-spin text-[#f7d784]">
                ♪
              </span>
            </div>
          ) : (
            <VolumeX size={20} />
          )}
        </motion.button>
      </div>
    </>
  );
}
