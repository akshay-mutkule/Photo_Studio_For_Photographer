import React, { useState, useRef } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = "Raw / Unedited",
  afterLabel = "VS Photography Signature Edit",
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | string>("100%");
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
          The Art of Post-Processing
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-light mt-2 mb-3">
          Interactive Comparison
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
          Slide the handle to reveal our bespoke color grading and high-end editorial skin retouching.
        </p>
      </div>

      <div
        id="before-after-slider-container"
        ref={containerRef}
        className="relative h-[300px] sm:h-[450px] w-full rounded-lg overflow-hidden cursor-ew-resize select-none border border-neutral-800 shadow-2xl bg-neutral-900"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Full background) */}
        <img
          src={afterImage}
          alt="After retouching"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute right-4 bottom-4 bg-black/70 border border-gold-500/30 text-gold-400 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded backdrop-blur-sm z-30">
          {afterLabel}
        </div>

        {/* Before Image (Clipped from left to right) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before retouching"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none grayscale contrast-75 brightness-90 saturate-50"
            style={{ width: containerWidth }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute left-4 bottom-4 bg-black/70 border border-neutral-700 text-neutral-300 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded backdrop-blur-sm z-30 whitespace-nowrap">
            {beforeLabel}
          </div>
        </div>

        {/* Slide Bar */}
        <div
          className="absolute inset-y-0 w-0.5 bg-gold-400 z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gold-500 border-2 border-white flex items-center justify-center text-black shadow-lg cursor-ew-resize hover:bg-gold-400 transition-colors">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
