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
            The Story of VS Photography
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Master Section: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left Column: Portrait */}
          <div className="relative">
            <div className={`relative z-10 aspect-[3/4] rounded-lg overflow-hidden border shadow-2xl ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
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
            
            <p className={`font-sans text-sm sm:text-base leading-relaxed font-light ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
              For over ten years, I have loved taking beautiful, timeless photos. My style is natural, elegant, and simple. I believe a great photo should show the true feeling of a moment so you can cherish it forever.
            </p>

            <p className={`font-sans text-sm leading-relaxed font-light ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We believe every photo shoot should be a relaxed, happy experience. We do not use stiff or artificial poses. Instead, we capture natural smiles, soft natural light, and real moments to tell your true story.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 items-start">
                <Camera className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-semibold text-gold-500">
                    Custom Style
                  </h4>
                  <p className={`text-[11px] font-light ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    We plan every shoot to match your favorite colors and style.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-semibold text-gold-500">
                    Easy Process
                  </h4>
                  <p className={`text-[11px] font-light ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    A simple, stress-free way to view and select your photos online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Achievements */}
        <div className={`p-8 sm:p-12 rounded-lg border mb-24 ${isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"}`}>
          <h3 className="font-serif text-xl sm:text-2xl text-center font-light mb-8">
            Our Experience & Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h4 className="font-sans text-sm tracking-wider uppercase font-semibold mb-1">
                Outstanding Photo Award
              </h4>
              <p className={`text-xs font-light ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Awarded for outstanding photo stories in 2024 and 2025.
              </p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h4 className="font-sans text-sm tracking-wider uppercase font-semibold mb-1">
                Featured in Magazines
              </h4>
              <p className={`text-xs font-light ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Featured as a top local photography studio in Northern California.
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h4 className="font-sans text-sm tracking-wider uppercase font-semibold mb-1">
                Professional Equipment
              </h4>
              <p className={`text-xs font-light ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Recognized partner using professional cameras for the best quality portraits.
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
            <div className={`aspect-video rounded-lg overflow-hidden border ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
              <img
                src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=600&q=80"
                alt="Behind the scenes shoot gear"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className={`aspect-video rounded-lg overflow-hidden border ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80"
                alt="Setting up lighting"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className={`aspect-video rounded-lg overflow-hidden border ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
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
