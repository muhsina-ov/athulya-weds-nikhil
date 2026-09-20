import { useEffect } from "react";
import Lenis from "lenis";
import Hero from "@/sections/Hero";
import Invitation from "@/sections/Invitation";
import CountdownSection from "@/sections/CountdownSection";
import Events from "@/sections/Events";
import Venue from "@/sections/Venue";
import Footer from "@/sections/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export default function App() {
  // Buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#FFF9EF]">
      <Hero />
      <Invitation />
      <CountdownSection />
      <Events />
      <Venue />
      <Footer />
      <MusicPlayer />
    </main>
  );
}
