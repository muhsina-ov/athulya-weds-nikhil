import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";

interface ScratchCardProps {
  children: React.ReactNode;
  revealThreshold?: number; // 0 to 1, default 0.40 (40% scratched reveals all)
  onReveal?: () => void;
}

export default function ScratchCard({
  children,
  revealThreshold = 0.4,
  onReveal,
}: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Draw luxurious Kerala golden foil texture with ornate patterns
  const drawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset compositing mode to normal for drawing the foil
    ctx.globalCompositeOperation = "source-over";

    // 1. Rich metallic golden gradient background
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#85510c");
    goldGrad.addColorStop(0.18, "#c9922a");
    goldGrad.addColorStop(0.38, "#fae49d");
    goldGrad.addColorStop(0.55, "#d49e30");
    goldGrad.addColorStop(0.78, "#ffd978");
    goldGrad.addColorStop(1, "#945c10");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Add subtle diagonal golden shimmer stripes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1.5;
    const stripeGap = 16;
    ctx.beginPath();
    for (let x = -height; x < width + height; x += stripeGap) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
    }
    ctx.stroke();

    // 3. Decorative mandala / rangoli rings in center
    const cx = width / 2;
    const cy = height / 2;

    ctx.strokeStyle = "rgba(110, 60, 5, 0.4)";
    ctx.lineWidth = 1.2;

    // Outer decorative dashed circle
    ctx.beginPath();
    ctx.setLineDash([4, 6]);
    ctx.arc(cx, cy, Math.min(width, height) * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(width, height) * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Corner decorative flourishes
    const cornerSize = 28;
    ctx.strokeStyle = "rgba(90, 48, 5, 0.45)";
    ctx.lineWidth = 2;

    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(14, 14 + cornerSize);
    ctx.lineTo(14, 14);
    ctx.lineTo(14 + cornerSize, 14);
    ctx.stroke();

    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width - 14 - cornerSize, 14);
    ctx.lineTo(width - 14, 14);
    ctx.lineTo(width - 14, 14 + cornerSize);
    ctx.stroke();

    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(14, height - 14 - cornerSize);
    ctx.lineTo(14, height - 14);
    ctx.lineTo(14 + cornerSize, height - 14);
    ctx.stroke();

    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - 14 - cornerSize, height - 14);
    ctx.lineTo(width - 14, height - 14);
    ctx.lineTo(width - 14, height - 14 - cornerSize);
    ctx.stroke();

    // 4. Center Gold Foil Badge with Instructions
    const badgeW = Math.min(320, width - 40);
    const badgeH = 100;
    const bx = cx - badgeW / 2;
    const by = cy - badgeH / 2;

    // Soft dark shadow for badge
    ctx.fillStyle = "rgba(50, 20, 5, 0.35)";
    ctx.beginPath();
    ctx.roundRect(bx - 2, by - 2, badgeW + 4, badgeH + 4, 18);
    ctx.fill();

    // Inner badge card
    ctx.fillStyle = "rgba(255, 248, 230, 0.95)";
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 16);
    ctx.fill();

    // Badge border
    ctx.strokeStyle = "#c48823";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Badge dashed inner line
    ctx.strokeStyle = "#e8a93c";
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 5, by + 5, badgeW - 10, badgeH - 10);
    ctx.setLineDash([]);

    // Icon / Ornament
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#8f1d3a";
    ctx.font = "bold 20px serif";
    ctx.fillText("✨  ✦  ✨", cx, cy - 22);

    // Main scratch prompt text
    ctx.fillStyle = "#631023";
    ctx.font = 'bold 15px "Cinzel", Georgia, serif';
    ctx.fillText("SCRATCH TO REVEAL", cx, cy + 3);

    // Subtitle
    ctx.fillStyle = "#875e18";
    ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
    ctx.fillText("Tap & drag to uncover the countdown", cx, cy + 24);
  }, []);

  // Initialize canvas size from container
  const initCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Set canvas internal resolution to match physical pixels
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    drawFoil();
    setIsRevealed(false);
    setScratchPercent(0);
    lastPointRef.current = null;
  }, [drawFoil]);

  useEffect(() => {
    // Delay slightly to ensure layout and font styles are calculated
    const timer = setTimeout(() => {
      initCanvas();
    }, 100);

    const handleResize = () => {
      if (!isRevealed) {
        initCanvas();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, isRevealed]);

  // Calculate percentage of foil scratched
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sampleStep = 10;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
      total++;
      if (pixels[i] < 128) {
        transparent++;
      }
    }

    const pct = total > 0 ? transparent / total : 0;
    setScratchPercent(Math.round(pct * 100));

    if (pct >= revealThreshold) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  }, [isRevealed, revealThreshold, onReveal]);

  // Scratch action
  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      const radius = 28 * scaleX;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = radius * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (lastPointRef.current) {
        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      lastPointRef.current = { x, y };
    },
    [isRevealed]
  );

  // Unified Pointer & Touch listeners attached to canvas ref
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let drawing = false;

    const onStart = (e: MouseEvent | TouchEvent) => {
      if (isRevealed) return;
      drawing = true;
      setIsDrawing(true);
      lastPointRef.current = null;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      scratchAt(clientX, clientY);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!drawing || isRevealed) return;
      if ("touches" in e && e.cancelable) {
        e.preventDefault(); // Prevent page scroll while scratching on mobile
      }
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      scratchAt(clientX, clientY);
      checkScratchPercentage();
    };

    const onEnd = () => {
      if (!drawing) return;
      drawing = false;
      setIsDrawing(false);
      lastPointRef.current = null;
      checkScratchPercentage();
    };

    // Mouse listeners
    canvas.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    // Touch listeners with passive: false to allow preventing scroll
    canvas.addEventListener("touchstart", onStart, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);

    return () => {
      canvas.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);

      canvas.removeEventListener("touchstart", onStart);
      canvas.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [isRevealed, scratchAt, checkScratchPercentage]);

  // Reset scratch card
  const handleReset = () => {
    setIsRevealed(false);
    setTimeout(() => {
      initCanvas();
    }, 50);
  };

  return (
    <div className="relative mx-auto max-w-xl">
      {/* Outer Card Frame with golden Kerala royal styling */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border-2 border-[hsl(var(--gold)/0.6)] bg-[#fffbf2] p-5 sm:p-7 shadow-[0_20px_50px_-15px_rgba(143,29,58,0.25)]"
      >
        {/* Content Underneath: Live Countdown */}
        <div className="relative z-10">{children}</div>

        {/* Scratchable Foil Canvas Overlay */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(6px)",
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              className="absolute inset-0 z-20 h-full w-full cursor-crosshair touch-none select-none rounded-3xl"
              style={{ touchAction: "none" }}
            />
          )}
        </AnimatePresence>

        {/* Celebratory Sparkle effect when fully revealed */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-rose-400/10 to-amber-400/10 animate-pulse rounded-3xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action / Helper bar beneath scratch card */}
      <div className="mt-4 flex items-center justify-between px-3 text-xs">
        <div className="flex items-center gap-1.5 font-caps text-[10px] sm:text-[11px] text-[hsl(var(--gold))] font-medium">
          <Sparkles size={14} className="text-[#e8a93c]" />
          <span>
            {isRevealed
              ? "🎉 Countdown Unlocked!"
              : scratchPercent > 0
              ? `Scratching... ${scratchPercent}%`
              : "Use your finger or mouse to scratch the gold foil"}
          </span>
        </div>

        {isRevealed ? (
          <motion.button
            type="button"
            onClick={handleReset}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold)/0.4)] bg-amber-50/80 px-3 py-1 font-caps text-[10px] text-[#8f1d3a] shadow-xs transition-colors hover:bg-amber-100/80"
          >
            <RotateCcw size={11} />
            <span>Scratch Again</span>
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsRevealed(true);
              if (onReveal) onReveal();
            }}
            className="font-caps text-[10px] text-[#8f1d3a] underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            Reveal Instantly
          </button>
        )}
      </div>
    </div>
  );
}
