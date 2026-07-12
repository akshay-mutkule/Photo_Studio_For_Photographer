import { Shield, Sparkles, Check, Clock, Award, FileSpreadsheet } from "lucide-react";

interface ServicesPageProps {
  theme: "dark" | "light";
  onSelectPackage: (packageName: string) => void;
}

export default function ServicesPage({ theme, onSelectPackage }: ServicesPageProps) {
  const isDark = theme === "dark";

  const packages = [
    {
      id: "pkg-wedding-premium",
      name: "Premium Multi-Day Wedding",
      price: "₹2,99,999",
      duration: "3-Day Full Festivities Coverage",
      description: "Complete cinematic coverage of Haldi, Mehendi, Sangeet, Main Wedding, and Reception. Includes custom cinematic highlights.",
      deliverables: [
        "Two senior photographers (Traditional + Candid)",
        "One cinematic videographer",
        "High-definition 3-minute video teaser & full film",
        "800+ fully edited high-resolution photos",
        "Luxury leather-bound wedding album trunk box",
        "Private online proof selection gallery active for 2 years"
      ],
      popular: true
    },
    {
      id: "pkg-wedding-traditional",
      name: "Traditional Wedding Ceremony",
      price: "₹1,49,999",
      duration: "Single Day (Up to 12 Hours)",
      description: "Full-day coverage of your traditional Indian wedding rituals, Var Mala, Mangalashtak, and evening Reception.",
      deliverables: [
        "One candid photographer and one traditional photographer",
        "400+ high-quality edited images",
        "Premium Karizma layout printed album",
        "Private online gallery & easy client portal access",
        "First sneak peek highlights in 48 hours",
        "High-resolution digital downloads"
      ],
      popular: false
    },
    {
      id: "pkg-pre-wedding",
      name: "Pre-Wedding Scenic Shoot",
      price: "₹34,999",
      duration: "Full Day (Up to 8 Hours)",
      description: "A gorgeous pre-wedding shoot at up to two picturesque local outdoor/heritage locations of your choice with outfit styling.",
      deliverables: [
        "Vinayak Sable as your lead photographer",
        "100+ fully retouched high-resolution images",
        "Creative cinematic pre-wedding invite video (1 min)",
        "Drone photography included (location permitting)",
        "Help with outfits, poses, and props styling",
        "Online gallery with direct favorite marking"
      ],
      popular: false
    },
    {
      id: "pkg-haldi-mehendi",
      name: "Haldi & Mehendi Festivities",
      price: "₹49,999",
      duration: "Up to 6 Hours Coverage",
      description: "Vibrant, colorful candid photoshoot capturing the emotions, dance, and music of your pre-wedding rituals.",
      deliverables: [
        "One pro candid photographer",
        "200+ beautifully styled high-resolution images",
        "Highlight video reel optimized for Instagram/YouTube",
        "Same-day social media preview photos",
        "Private digital delivery via client portal",
        "Full printing and personal sharing rights"
      ],
      popular: false
    },
    {
      id: "pkg-maternity-baby",
      name: "Maternity & Dohale Jevan",
      price: "₹19,999",
      duration: "3 Hour Portrait Session",
      description: "Timeless portraiture for expectant parents or traditional Dohale Jevan (baby shower) celebrations.",
      deliverables: [
        "Outdoor scenic or cozy indoor home setup",
        "50+ professionally edited high-quality photos",
        "Access to select creative props and drapes",
        "Exclusive online proof selection suite",
        "Family and companion portraits included",
        "Fast 5-day digital delivery guarantee"
      ],
      popular: false
    },
    {
      id: "pkg-festive-portrait",
      name: "Festive & Family Portrait",
      price: "₹11,999",
      duration: "2 Hour Session",
      description: "Celebrate Diwali, Navratri, or special family milestones with beautifully lit traditional portraits.",
      deliverables: [
        "One-on-one session with premium portable lighting",
        "30+ fully retouched digital images",
        "Traditional clothing and styling coordination",
        "High-quality digital copy for printing",
        "Private password-protected digital folder",
        "Special printed framed portrait (8x10)"
      ],
      popular: false
    }
  ];

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
            Our Services
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            Photography Packages
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Introduction Panel */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <p className="font-sans text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
            All photography services include consultations, professional color editing, a private online gallery, fast digital delivery, and full printing rights. No hidden fees. Custom projects are also welcome.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              id={`package-card-${pkg.id}`}
              className={`relative rounded-xl border p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.popular
                  ? "bg-gradient-to-b from-neutral-900 to-black border-gold-500 shadow-xl shadow-gold-500/5 ring-1 ring-gold-500"
                  : isDark
                  ? "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                  : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-gold-500 text-black text-[9px] tracking-widest uppercase font-semibold px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              )}

              {/* Package Meta */}
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-light mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-serif text-3xl font-normal text-gold-500">{pkg.price}</span>
                  <span className="text-[10px] text-neutral-400 font-sans tracking-wide">/ package</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6 pb-4 border-b border-neutral-800/20">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  <span>{pkg.duration}</span>
                </div>

                <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                  {pkg.description}
                </p>

                {/* Deliverables List */}
                <ul className="space-y-3 mb-8">
                  {pkg.deliverables.map((item, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <Check className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                      <span className={`text-[11px] font-light tracking-wide ${
                        pkg.popular || isDark ? "text-neutral-300" : "text-neutral-700"
                      }`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking Trigger */}
              <button
                id={`book-${pkg.id}`}
                onClick={() => onSelectPackage(pkg.name)}
                className={`w-full py-3 rounded text-xs tracking-widest uppercase font-sans font-semibold transition-colors ${
                  pkg.popular
                    ? "bg-gold-500 hover:bg-gold-400 text-black shadow-lg"
                    : isDark
                    ? "bg-neutral-900 hover:bg-gold-500 hover:text-black text-neutral-300"
                    : "bg-neutral-200 hover:bg-gold-500 hover:text-black text-neutral-800"
                }`}
              >
                Book {pkg.name}
              </button>
            </div>
          ))}
        </div>

        {/* Security & Proofing guarantee */}
        <div className={`mt-20 p-8 rounded-lg border flex flex-col md:flex-row items-center gap-6 justify-between ${
          isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-950/20 border border-gold-500/30 rounded">
              <Shield className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-light">Safe and Private Photo Gallery</h4>
              <p className="text-xs text-neutral-400 font-light mt-1 max-w-xl">
                Every client gets a secure, private link. You can easily view your photos, mark your favorites, and download high-resolution files.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-xs tracking-widest text-gold-500 font-mono">100% SECURE & PRIVATE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
