import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import AboutPage from "./components/AboutPage.jsx";
import PortfolioPage from "./components/PortfolioPage.jsx";
import ServicesPage from "./components/ServicesPage.jsx";
import ClientPortal from "./components/ClientPortal.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ContactPage from "./components/ContactPage.jsx";
import ExtraFeatures from "./components/ExtraFeatures.jsx";
import BlogSection from "./components/BlogSection.jsx";
import BeforeAfter from "./components/BeforeAfter.jsx";
import { Camera, Mail, Phone, MapPin, Shield, Instagram, Heart, ArrowUp, ArrowLeft } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [preSelectedPackage, setPreSelectedPackage] = useState("");
  const [scrollToBooking, setScrollToBooking] = useState(false);
  const [urlGalleryId, setUrlGalleryId] = useState<string | undefined>(undefined);

  // Check URL parameters on mount for self-referential shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const portalId = params.get("portal");
    if (portalId) {
      setUrlGalleryId(portalId);
      setActiveTab("client-portal");
    }
  }, []);

  // Sync theme to root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#000000";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#ffffff";
    }
  }, [theme]);

  // Reset scroll to top when changing tabs
  useEffect(() => {
    // A micro-timeout ensures the scroll reset occurs after the browser processes the new DOM tree layout and image sizing.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleSelectPackageFromServices = (packageName: string) => {
    setPreSelectedPackage(packageName);
    setActiveTab("services");
    setScrollToBooking(true);
  };

  const handleBookShootRedirect = () => {
    setPreSelectedPackage("");
    setActiveTab("services");
    setScrollToBooking(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === "dark" ? "bg-black text-white" : "bg-white text-black"
    }`}>
      {/* Premium Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        isClientAuthenticated={isClientAuthenticated}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogoutClient={() => setIsClientAuthenticated(false)}
        onLogoutAdmin={() => setIsAdminAuthenticated(false)}
      />

      {/* Main Orchestration Board */}
      <main className="flex-grow">
        {activeTab !== "home" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 -mb-4 animate-[fadeIn_0.4s_ease]">
            <button
              onClick={() => {
                setActiveTab("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`inline-flex items-center gap-2 group text-xs tracking-widest uppercase font-sans font-medium transition-all duration-300 cursor-pointer py-2 px-3.5 rounded border ${
                theme === "dark"
                  ? "text-neutral-400 hover:text-gold-400 bg-neutral-950 border-neutral-900 hover:border-gold-500/30 shadow-md shadow-black/50"
                  : "text-neutral-600 hover:text-gold-500 bg-neutral-50 border-neutral-200 hover:border-gold-500/30 shadow-sm"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 duration-300 text-gold-500" />
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {activeTab === "home" && (
          <div className="animate-[fadeIn_0.6s_ease]">
            {/* Cinematic Hero */}
            <Hero
              onViewPortfolio={() => setActiveTab("portfolio")}
              onBookShoot={handleBookShootRedirect}
              theme={theme}
            />

            {/* Premium Before / After Image retouching Slider */}
            <BeforeAfter
              beforeImage="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              afterImage="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
            />

            {/* Featured Work Summary preview block */}
            <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">Featured Work</span>
              <h3 className="font-serif text-3xl font-light mt-2 mb-10">Sensory Storytelling</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="aspect-[4/5] rounded overflow-hidden relative group cursor-pointer" onClick={() => setActiveTab("portfolio")}>
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-left">
                    <span className="text-[10px] tracking-widest text-gold-400 uppercase font-mono">Weddings</span>
                    <h4 className="font-serif text-lg text-white mt-1">Ethereal Canopy Altar</h4>
                  </div>
                </div>
                <div className="aspect-[4/5] rounded overflow-hidden relative group cursor-pointer" onClick={() => setActiveTab("portfolio")}>
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-left">
                    <span className="text-[10px] tracking-widest text-gold-400 uppercase font-mono">Engagement</span>
                    <h4 className="font-serif text-lg text-white mt-1">Golden Hour Embrace</h4>
                  </div>
                </div>
                <div className="aspect-[4/5] rounded overflow-hidden relative group cursor-pointer" onClick={() => setActiveTab("portfolio")}>
                  <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-left">
                    <span className="text-[10px] tracking-widest text-gold-400 uppercase font-mono">Portraits</span>
                    <h4 className="font-serif text-lg text-white mt-1">Sienna Editorial</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog / Journal Strip */}
            <BlogSection theme={theme} />

            {/* Testimonials, FAQs, Newsletter, Instagram Feed */}
            <ExtraFeatures theme={theme} />
          </div>
        )}

        {activeTab === "about" && <AboutPage theme={theme} />}

        {activeTab === "portfolio" && <PortfolioPage theme={theme} />}

        {activeTab === "services" && (
          <ServicesPage
            theme={theme}
            onSelectPackage={handleSelectPackageFromServices}
            preSelectedPackage={preSelectedPackage}
            scrollToBooking={scrollToBooking}
            onScrollReset={() => setScrollToBooking(false)}
          />
        )}

        {activeTab === "client-portal" && (
          <ClientPortal
            theme={theme}
            initialGalleryId={urlGalleryId}
            onClientAuthenticated={setIsClientAuthenticated}
            onAdminAuthenticated={setIsAdminAuthenticated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "admin-portal" && (
          <AdminDashboard
            theme={theme}
            onAdminAuthenticated={setIsAdminAuthenticated}
          />
        )}

        {activeTab === "contact" && <ContactPage theme={theme} />}
      </main>

      {/* Premium Footer section */}
      <footer className={`border-t py-12 sm:py-16 text-xs transition-colors duration-300 ${
        theme === "dark" ? "bg-black border-neutral-900 text-neutral-400" : "bg-neutral-50 border-neutral-200 text-neutral-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Camera className="w-5 h-5 text-gold-500" />
                <span className="font-serif tracking-widest uppercase font-semibold text-sm text-gold-500">VS PHOTOGRAPHY</span>
              </div>
              <p className="font-light leading-relaxed max-w-xs">
                Capturing raw human connections, bespoke fine-art edits, and timeless wedding stories from Ashti.
              </p>
            </div>

            {/* Column 2: Links */}
            <div>
              <h4 className="font-serif text-white tracking-wider uppercase mb-4 text-xs font-semibold">Explore</h4>
              <ul className="space-y-2.5 font-light">
                <li><button onClick={() => setActiveTab("home")} className="hover:text-gold-500 transition-colors">Home Page</button></li>
                <li><button onClick={() => setActiveTab("about")} className="hover:text-gold-500 transition-colors">Behind the Lens</button></li>
                <li><button onClick={() => setActiveTab("portfolio")} className="hover:text-gold-500 transition-colors">Portfolios</button></li>
                <li><button onClick={() => setActiveTab("services")} className="hover:text-gold-500 transition-colors">Collections & pricing</button></li>
              </ul>
            </div>

            {/* Column 3: Portals */}
            <div>
              <h4 className="font-serif text-white tracking-wider uppercase mb-4 text-xs font-semibold">Client Relations</h4>
              <ul className="space-y-2.5 font-light">
                <li><button onClick={() => setActiveTab("client-portal")} className="hover:text-gold-500 transition-colors">Client proof selection</button></li>
                <li><button onClick={handleBookShootRedirect} className="hover:text-gold-500 transition-colors">Book a shoot</button></li>
                <li><button onClick={() => setActiveTab("contact")} className="hover:text-gold-500 transition-colors">General Inquiry</button></li>
              </ul>
            </div>

            {/* Column 4: Location details */}
            <div className="space-y-2">
              <h4 className="font-serif text-white tracking-wider uppercase mb-4 text-xs font-semibold">Office Hours</h4>
              <p className="font-light">Mon - Fri: 9:00 AM - 6:00 PM PST</p>
              <p className="font-light">Sat - Sun: Event Coverage Only</p>
              <div className="flex gap-2.5 pt-2">
                <a
                  href="https://www.instagram.com/vinayak_sable_photographey?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-gold-500 transition-colors"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <Heart className="w-4 h-4 text-neutral-400 hover:text-gold-500 cursor-pointer" />
              </div>
            </div>

          </div>

          {/* Copyright bar */}
          <div className="pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500 font-mono">
            <span>© 2026 VS PHOTOGRAPHY. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>

      {/* Quick back to top widget */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 p-2.5 bg-neutral-950 border border-neutral-800 text-gold-500 hover:bg-neutral-900 rounded-full shadow-lg hover:shadow-gold-500/10 transition-all"
        title="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}
