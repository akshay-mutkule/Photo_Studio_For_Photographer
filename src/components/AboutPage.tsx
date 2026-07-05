import { motion } from "motion/react";
import { Award, Camera, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function AboutPage({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
            Behind the Lens
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            The Story of Lumina
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Master Section: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left Column: Portrait */}
          <div className="relative">
            <div className="relative z-10 aspect-3/4 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1200&q=80"
                alt="Photographer behind the lens"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Visual Frame Decorator */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold-500/50 rounded-tl z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold-500/50 rounded-br z-0"></div>
          </div>

          {/* Right Column: Bio */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-light">
              Hi, I'm <span className="text-gold-500 italic font-normal">Aria Sterling</span>.
            </h3>
            
            <p className={`font-sans text-sm sm:text-base leading-relaxed font-light ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
              For over a decade, I’ve dedicated my life to the pursuit of capturing timeless light. My style sits at the intersection of cinematic photojournalism and romantic fine-art. I believe a great photograph doesn't just document a moment; it preserves the precise feeling, the gentle breeze, and the unspoken warmth of a glance.
            </p>

            <p className={`font-sans text-sm leading-relaxed font-light ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
              Lumina was founded on the philosophy that every photoshoot should be an relaxed, immersive experience. We don't force rigid, artificial poses. Instead, we cultivate raw, genuine interactions, utilizing soft natural light and exquisite compositions to tell your authentic story.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 items-start">
                <Camera className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-semibold text-gold-500">
                    Bespoke Style
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Every session is customized from color grading to layout.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-semibold text-gold-500">
                    Client First
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Fluid, stress-free client proofing and selection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Achievements */}
        <div className={`p-8 sm:p-12 rounded-lg border mb-24 ${isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"}`}>
          <h3 className="font-serif text-xl sm:text-2xl text-center font-light mb-8">
            Achievements & Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h4 className="font-sans text-sm tracking-wider uppercase font-semibold mb-1">
                Fearless Photographers Award
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                Winner of "Outstanding Storytelling" in 2024 & 2025.
              </p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h4 className="font-sans text-sm tracking-wider uppercase font-semibold mb-1">
                Vogue Weddings Feature
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                Listed as one of the Premier Boutique Studios in Northern California.
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h4 className="font-sans text-sm tracking-wider uppercase font-semibold mb-1">
                Nikon Elite Ambassador
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                Official global partner, championing fine-art portraits and workshops.
              </p>
            </div>
          </div>
        </div>

        {/* Behind The Scenes Section */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
              On Set
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mt-1">
              Behind the Scenes
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=600&q=80"
                alt="Behind the scenes shoot gear"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80"
                alt="Setting up lighting"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
                alt="Editing raw photos in Lightroom"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
