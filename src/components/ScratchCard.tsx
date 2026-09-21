import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Eye } from "lucide-react";

interface ScratchCardProps {
  children: React.ReactNode;
  revealThreshold?: number; // default 0.15 (15% scratched unlocks card easily on mobile)
  onReveal?: () => void;
}

export default function ScratchCard({
  children,
  revealThreshold = 0.15,
  onReveal,
}: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const isScratchingRef = useRef(false);
  const hasScratchedRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckTimeRef = useRef(0);
  const strokeCountRef = useRef(0);

  // Reveal card function
  const revealCard = useCallback(() => {
    setIsRevealed(true);
    setScratchPercent(100);
    if (onReveal) onReveal();
  }, [onReveal]);

  // Draw luxurious Kerala golden foil texture with ornate patterns
  const drawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use container client dimensions (unaffected by CSS transforms)
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Set internal resolution to match physical display pixels
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.save();
    // Scale context so all subsequent drawing uses logical CSS units
    ctx.scale(dpr, dpr);

    // Reset compositing mode to normal for drawing the foil
    ctx.globalCompositeOperation = "source-over";

    // 1. Rich metallic golden gradient background
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#85510c");
    goldGrad.addColorStop(0.18, "#c9922a");
    goldGrad.addColorStop(0.38, "#fff0b3");
    goldGrad.addColorStop(0.55, "#d49e30");
    goldGrad.addColorStop(0.78, "#ffd978");
    goldGrad.addColorStop(1, "#8e550e");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Add subtle diagonal golden shimmer stripes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
    ctx.lineWidth = 1.5;
    const stripeGap = 18;
    ctx.beginPath();
    for (let x = -height; x < width + height; x += stripeGap) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
    }
    ctx.stroke();

    // 3. Central Kerala Mandala circles
    const cx = width / 2;
    const cy = height / 2;

    ctx.strokeStyle = "rgba(110, 60, 5, 0.35)";
    ctx.lineWidth = 1.5;

    // Outer decorative dashed circle
    ctx.beginPath();
    ctx.setLineDash([4, 6]);
    ctx.arc(cx, cy, Math.min(width, height) * 0.44, 0, Math.PI * 2);
    ctx.stroke();

    // Inner solid circle
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(width, height) * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Corner decorative flourishes
    const cornerSize = 28;
    const inset = 14;
    ctx.strokeStyle = "rgba(95, 45, 5, 0.45)";
    ctx.lineWidth = 2;

    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(inset, inset + cornerSize);
    ctx.lineTo(inset, inset);
    ctx.lineTo(inset + cornerSize, inset);
    ctx.stroke();

    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width - inset - cornerSize, inset);
    ctx.lineTo(width - inset, inset);
    ctx.lineTo(width - inset, inset + cornerSize);
    ctx.stroke();

    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(inset, height - inset - cornerSize);
    ctx.lineTo(inset, height - inset);
    ctx.lineTo(inset + cornerSize, height - inset);
    ctx.stroke();

    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - inset - cornerSize, height - inset);
    ctx.lineTo(width - inset, height - inset);
    ctx.lineTo(width - inset, height - inset - cornerSize);
    ctx.stroke();

    // 5. Center Gold Foil Plaque Badge with Instructions
    const badgeW = Math.min(310, width - 36);
    const badgeH = 96;
    const bx = cx - badgeW / 2;
    const by = cy - badgeH / 2;

    // Soft dark shadow for badge
    ctx.fillStyle = "rgba(45, 18, 5, 0.35)";
    ctx.beginPath();
    ctx.roundRect(bx - 3, by - 2, badgeW + 6, badgeH + 6, 18);
    ctx.fill();

    // Inner badge card
    ctx.fillStyle = "rgba(255, 248, 230, 0.96)";
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
    ctx.strokeRect(bx + 6, by + 6, badgeW - 12, badgeH - 12);
    ctx.setLineDash([]);

    // Icon / Ornament
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#8f1d3a";
    ctx.font = "bold 18px serif";
    ctx.fillText("✨  ✦  ✨", cx, cy - 22);

    // Main scratch prompt text
    ctx.fillStyle = "#631023";
    ctx.font = 'bold 15px "Cinzel", Georgia, serif';
    ctx.fillText("SCRATCH TO REVEAL", cx, cy + 3);

    // Subtitle
    ctx.fillStyle = "#875e18";
    ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
    ctx.fillText("Swipe finger or drag mouse to uncover", cx, cy + 24);

    ctx.restore();
  }, []);

  // Initialize and observe resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isRevealed && !hasScratchedRef.current) {
      drawFoil();
    }

    // Refresh text once custom fonts load
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (!hasScratchedRef.current && !isRevealed) {
          drawFoil();
        }
      });
    }

    const ro = new ResizeObserver(() => {
      if (!hasScratchedRef.current && !isRevealed) {
        drawFoil();
      }
    });

    ro.observe(container);

    return () => {
      ro.disconnect();
    };
  }, [drawFoil, isRevealed]);

  // Calculate percentage of foil scratched (statistically sampled for 60fps smoothness)
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sampleStep = 16;
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
    const currentPercent = Math.min(100, Math.round(pct * 100));
    setScratchPercent(currentPercent);

    // Unlocks either via percentage (>= 15%) or cumulative strokes (>= 22 strokes)
    if (pct >= revealThreshold || strokeCountRef.current >= 22) {
      revealCard();
    }
  }, [isRevealed, revealThreshold, revealCard]);

  // Scratch action
  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      // Generous brush size (36 CSS px radius = 72px diameter) for mobile fingers
      const radius = 36 * scaleX;

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
      strokeCountRef.current += 1;
    },
    [isRevealed]
  );

  // Direct native touch listeners with { passive: false }
  // This is CRITICAL for mobile Safari and Android Chrome to completely prevent page scroll while scratching!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const onTouchStart = (e: TouchEvent) => {
      if (isRevealed) return;
      if (e.cancelable) e.preventDefault();
      isScratchingRef.current = true;
      hasScratchedRef.current = true;
      lastPointRef.current = null;
      const touch = e.touches[0];
      if (touch) {
        scratchAt(touch.clientX, touch.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault(); // Stop mobile page scroll!
      if (!isScratchingRef.current || isRevealed) return;
      const touch = e.touches[0];
      if (touch) {
        scratchAt(touch.clientX, touch.clientY);
        const now = performance.now();
        if (now - lastCheckTimeRef.current > 120) {
          lastCheckTimeRef.current = now;
          checkScratchPercentage();
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (!isScratchingRef.current) return;
      isScratchingRef.current = false;
      lastPointRef.current = null;
      checkScratchPercentage();
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [isRevealed, scratchAt, checkScratchPercentage]);

  // Desktop Mouse pointer handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only handle mouse; touch is handled by native listeners above
    if (e.pointerType === "touch" || isRevealed) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    isScratchingRef.current = true;
    hasScratchedRef.current = true;
    lastPointRef.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch" || !isScratchingRef.current || isRevealed) return;
    scratchAt(e.clientX, e.clientY);

    const now = performance.now();
    if (now - lastCheckTimeRef.current > 120) {
      lastCheckTimeRef.current = now;
      checkScratchPercentage();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch" || !isScratchingRef.current) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    isScratchingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  const handlePointerCancel = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
  };

  // Reset scratch card
  const handleReset = () => {
    setIsRevealed(false);
    setScratchPercent(0);
    hasScratchedRef.current = false;
    isScratchingRef.current = false;
    lastPointRef.current = null;
    strokeCountRef.current = 0;
    // Redraw foil on next tick when canvas is remounted
    setTimeout(() => {
      drawFoil();
    }, 40);
  };

  return (
    <div className="relative mx-auto max-w-xl select-none">
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
                transition: { duration: 0.5, ease: "easeOut" },
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="absolute inset-0 z-20 h-full w-full cursor-crosshair rounded-3xl touch-none"
              style={{ touchAction: "none" }}
            />
          )}
        </AnimatePresence>

        {/* Celebratory Sparkle effect when fully revealed */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-rose-400/15 to-amber-400/15 animate-pulse rounded-3xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action / Helper bar beneath scratch card */}
      <div className="mt-4 flex items-center justify-between gap-3 px-2 text-xs">
        <div className="flex items-center gap-2 font-caps text-[11px] sm:text-[12px] text-[hsl(var(--gold))] font-medium">
          <Sparkles size={16} className="text-[#e8a93c] animate-pulse shrink-0" />
          <span>
            {isRevealed
              ? "🎉 Countdown Unlocked!"
              : scratchPercent > 0
              ? `Scratching... ${scratchPercent}%`
              : "Swipe your finger to scratch & uncover"}
          </span>
        </div>

        {isRevealed ? (
          <motion.button
            type="button"
            onClick={handleReset}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold)/0.4)] bg-amber-50/90 px-3.5 py-1.5 font-caps text-[11px] text-[#8f1d3a] shadow-xs transition-colors hover:bg-amber-100 cursor-pointer min-h-[34px]"
          >
            <RotateCcw size={12} />
            <span>Scratch Again</span>
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={revealCard}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-100/90 to-amber-50 px-3 py-1.5 font-caps text-[11px] text-[#8f1d3a] font-semibold shadow-xs hover:bg-amber-200 transition-all cursor-pointer min-h-[34px] shrink-0 active:scale-95"
          >
            <Eye size={13} className="text-[#8f1d3a]" />
            <span>Reveal Instantly</span>
          </button>
        )}
      </div>

      {/* Subtle Progress Bar while scratching */}
      {!isRevealed && scratchPercent > 0 && (
        <div className="mt-2 mx-2 h-1.5 overflow-hidden rounded-full bg-amber-200/50">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-[#c62b4f] transition-all duration-200"
            style={{ width: `${Math.min(100, (scratchPercent / (revealThreshold * 100)) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
