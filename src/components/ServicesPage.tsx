import { Shield, Sparkles, Check, Clock, Award, FileSpreadsheet } from "lucide-react";

interface ServicesPageProps {
  theme: "dark" | "light";
  onSelectPackage: (packageName: string) => void;
}

export default function ServicesPage({ theme, onSelectPackage }: ServicesPageProps) {
  const isDark = theme === "dark";

  const packages = [
    {
      id: "pkg-wedding",
      name: "Wedding Photography",
      price: "$3,499",
      duration: "8-10 Hours of Photo Coverage",
      description: "Full day of wedding photography. We capture everything from morning preparations to the dance party at night.",
      deliverables: [
        "Two photographers to cover your day",
        "500+ high-quality edited images",
        "Private online photo gallery",
        "Beautiful leather photo album",
        "Easy digital download of all photos",
        "First sneak peek within 48 hours"
      ],
      popular: true
    },
    {
      id: "pkg-pre-wedding",
      name: "Pre-Wedding Session",
      price: "$1,299",
      duration: "4 Hours of Photo Coverage",
      description: "A beautiful pre-wedding photo shoot at up to two scenic outdoor locations of your choice.",
      deliverables: [
        "Aria Sterling as your lead photographer",
        "120+ high-quality edited images",
        "Easy online photo gallery and selection",
        "Help with outfits and styling ideas",
        "Travel included up to 50 miles",
        "Online photo gallery active for 1 year"
      ],
      popular: false
    },
    {
      id: "pkg-portraits",
      name: "Portrait Sessions",
      price: "$599",
      duration: "2 Hour Session",
      description: "Custom studio or outdoor portrait photos for professionals, couples, or personal lifestyle use.",
      deliverables: [
        "One-on-one session with pro lighting",
        "45+ fully edited high-quality photos",
        "Simple online photo selection system",
        "Up to 2 outfit changes",
        "Full printing rights for personal use",
        "Fast 5-day delivery guarantee"
      ],
      popular: false
    },
    {
      id: "pkg-corporate",
      name: "Corporate Events",
      price: "$1,899",
      duration: "6 Hours of Photo Coverage",
      description: "Professional team headshots and coverage for business events, retreats, or company websites.",
      deliverables: [
        "Full coverage of your business event",
        "Team headshots and natural candid photos",
        "Fast next-day online preview gallery",
        "Full rights for commercial use",
        "Secure digital photo downloads",
        "Clean, professional photo styling"
      ],
      popular: false
    },
    {
      id: "pkg-birthday",
      name: "Birthday & Social Events",
      price: "$899",
      duration: "4 Hours of Photo Coverage",
      description: "Great photography for birthdays, family reunions, anniversaries, or private dinner parties.",
      deliverables: [
        "Natural candid and group photos",
        "150+ high-quality edited photos",
        "Easy online photo sharing with guests",
        "Quick digital photo delivery",
        "High-resolution file downloads",
        "Professional low-light camera gear"
      ],
      popular: false
    },
    {
      id: "pkg-product",
      name: "Product Photography",
      price: "$1,499",
      duration: "Full Studio Shoot",
      description: "Professional photo shoots for products, clothing brands, or online stores with a clean layout.",
      deliverables: [
        "Professional studio product lighting setup",
        "30+ fully retouched custom product photos",
        "High-resolution files for web and print",
        "Multiple background colors available",
        "Helpful image search tags included",
        "Safe digital storage for future download"
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
