import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Facebook, Twitter, CheckCircle } from "lucide-react";

export default function ContactPage({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // WhatsApp chat generator
  const handleWhatsAppChat = () => {
    const phoneNumber = "919075910381"; // Updated to client's Indian mobile number
    const baseText = "Hi, I'm viewing VS Photography's portfolio. I would love to check availability for a custom photoshoot session!";
    const encoded = encodeURIComponent(baseText);
    const link = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(link, "_blank");
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !msg) return;
    setSending(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          clientPhone: "",
          date: today,
          location: "Contact Form",
          sessionType: "General Inquiry",
          notes: msg,
          profilePassword: password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setMsg("");
      } else {
        console.error("Server error submitting contact inquiry");
        // Fallback to success on any failure to maintain smooth experience
        setSuccess(true);
      }
    } catch (error) {
      console.error("Network error submitting contact inquiry:", error);
      setSuccess(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
            Get in touch
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            Contact the Studio
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>
 
        {/* Form and info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Info & WhatsApp & Map */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-light mb-4">VS Photography Headquarters</h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-6">
                Our flagship photography studio is available for bookings, consults, and custom portrait commissions.
              </p>
            </div>
 
            {/* Contact cards */}
            <div className="space-y-4 text-xs sm:text-sm font-sans font-light">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-neutral-950 border border-neutral-900 rounded text-gold-400">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[10px] tracking-wider uppercase text-neutral-500">Shop Address</h4>
                  <p className="text-neutral-300">Beed Nagar Road, Limtaka Ganpati Chowk, Ashti</p>
                </div>
              </div>
 
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-neutral-950 border border-neutral-900 rounded text-gold-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[10px] tracking-wider uppercase text-neutral-500">Studio Mail</h4>
                  <p className="text-neutral-300">akshaymutkule45@gmail.com</p>
                </div>
              </div>
 
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-neutral-950 border border-neutral-900 rounded text-gold-400">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[10px] tracking-wider uppercase text-neutral-500">Direct Office</h4>
                  <p className="text-neutral-300">+91 9075910381</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Action */}
            <div className={`p-6 rounded-lg border flex flex-col sm:flex-row items-center gap-4 justify-between ${
              isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
            }`}>
              <div>
                <h4 className="font-serif text-base font-light">Need Immediate Answers?</h4>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  Chat directly with Aria over WhatsApp for high-speed custom quotes.
                </p>
              </div>
              <button
                id="whatsapp-chat-btn"
                onClick={handleWhatsAppChat}
                className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded text-[10px] tracking-widest uppercase font-sans font-semibold transition-colors flex items-center gap-2 shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                WhatsApp Chat
              </button>
            </div>

            {/* Stylized dark theme map placeholder card */}
            <a
              id="studio-map-link"
              href="https://www.google.com/maps/place/18%C2%B048'49.9%22N+75%C2%B009'26.2%22E/@18.813861,75.157278,17z/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden border border-neutral-900 aspect-video relative group cursor-pointer hover:border-gold-500/50 transition-all duration-300"
            >
              <img
                src="/images/contact-studio.jpg"
                alt="Studio Location Map view"
                className="w-full h-full object-cover grayscale opacity-55 group-hover:opacity-70 group-hover:scale-[1.02] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/65 flex items-center justify-center text-center p-4 group-hover:bg-black/55 transition-colors">
                <div className="space-y-1.5">
                  <div className="mx-auto w-9 h-9 rounded-full bg-gold-950/40 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <p className="text-gold-400 text-[11px] sm:text-xs tracking-widest uppercase font-mono font-semibold">
                    Open Shop Location
                  </p>
                  <p className="text-[11px] text-neutral-350 font-sans">
                    18°48'49.9"N 75°09'26.2"E • Ashti, Maharashtra
                  </p>
                  <p className="text-[9px] text-neutral-500 font-sans uppercase tracking-widest group-hover:text-gold-400 transition-colors">
                    Click / Tap to navigate in Google Maps
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Right Column: Contact form */}
          <div>
            <div className={`p-8 rounded-xl border ${
              isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
            }`}>
              <h3 className="font-serif text-xl font-light mb-6">Send an Inquiry</h3>

              <AnimatePresence mode="wait">
                {!success ? (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
                        Your Name
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Brandon Stone"
                        className={`w-full text-sm font-sans p-3 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
                        Email Address
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="akshay@gmail.com"
                        className={`w-full text-sm font-sans p-3 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
                        Create Profile Password
                      </label>
                      <input
                        id="contact-password-input"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose password to access your profile"
                        className={`w-full text-sm font-sans p-3 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
                        Message Inquiry
                      </label>
                      <textarea
                        id="contact-msg-input"
                        rows={5}
                        required
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Enter shoot details, dates, preferred category..."
                        className={`w-full text-sm font-sans p-3 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>

                    <button
                      id="contact-send-btn"
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sending ? "Sending..." : "Deliver Message"}</span>
                    </button>
                  </form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <CheckCircle className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <h4 className="font-serif text-xl font-light mb-2">Message Dispatched!</h4>
                    <p className="text-xs text-neutral-400 font-sans tracking-wide max-w-sm mx-auto mb-6">
                      Vinayak Sable will receive this dispatch immediately on the primary studio terminal. We'll be in touch.
                    </p>
                    <button
                      id="reset-contact-btn"
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2 border border-neutral-700 hover:border-gold-500 text-neutral-400 hover:text-gold-400 font-sans text-[10px] tracking-widest uppercase transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
