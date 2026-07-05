import { motion } from "motion/react";
import { ArrowRight, Sparkles, Trophy, Flame } from "lucide-react";

interface HeroProps {
  onViewPortfolio: () => void;
  onBookShoot: () => void;
  theme: "dark" | "light";
}

export default function Hero({ onViewPortfolio, onBookShoot, theme }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=90"
          alt="Lumina Cinematic Backdrop"
          className="w-full h-full object-cover object-center opacity-65 scale-105 animate-[scaleUp_20s_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
      </div>

      {/* Decorative Golden Ambient Accent */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-10" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white select-none">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-6 border border-gold-500/30 bg-gold-950/20 rounded-full text-[10px] sm:text-xs tracking-widest text-gold-400 uppercase font-sans"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premier Fine-Art Photography Studio</span>
        </motion.div>

        {/* Brand Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-tight mb-6"
        >
          Capturing the <span className="italic text-gold-300 font-normal">Soul</span> of
          <br />
          Your Most Sacred Moments
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide leading-relaxed mb-10"
        >
          Award-winning editorial photography tailored for modern souls. Based in SF,
          shooting worldwide across weddings, luxury portraits, and commercial editorials.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            id="hero-book-shoot-btn"
            onClick={onBookShoot}
            className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all duration-300 shadow-lg shadow-gold-500/15 hover:shadow-gold-500/30 flex items-center justify-center gap-2"
          >
            Book a Shoot
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-view-portfolio-btn"
            onClick={onViewPortfolio}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 hover:border-gold-400 hover:text-gold-300 font-sans text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
          >
            View Portfolio
          </button>
        </motion.div>

        {/* Featured Achievements bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mt-16 sm:mt-24 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center text-neutral-400"
        >
          <div>
            <div className="font-serif text-xl sm:text-2xl text-gold-400 font-light">12+</div>
            <div className="text-[10px] tracking-widest uppercase mt-1">Years Experience</div>
          </div>
          <div>
            <div className="font-serif text-xl sm:text-2xl text-gold-400 font-light">450+</div>
            <div className="text-[10px] tracking-widest uppercase mt-1">Weddings Captured</div>
          </div>
          <div>
            <div className="font-serif text-xl sm:text-2xl text-gold-400 font-light">International</div>
            <div className="text-[10px] tracking-widest uppercase mt-1">Fearless Photo Awards</div>
          </div>
          <div>
            <div className="font-serif text-xl sm:text-2xl text-gold-400 font-light">Sony Alphas</div>
            <div className="text-[10px] tracking-widest uppercase mt-1">Brand Ambassador</div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
