import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Phone, Mail, MapPin, User, ChevronRight, CheckCircle2, Sparkles, Clock } from "lucide-react";

interface BookingPageProps {
  theme: "dark" | "light";
  preSelectedPackage: string;
}

export default function BookingPage({ theme, preSelectedPackage }: BookingPageProps) {
  const isDark = theme === "dark";

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [sessionType, setSessionType] = useState(preSelectedPackage || "Wedding Photography");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !sessionType) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          date,
          location,
          sessionType,
          notes,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Clear fields
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setLocation("");
        setNotes("");
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const sessionTypes = [
    "Wedding Photography",
    "Pre-Wedding Session",
    "Birthday & Social Events",
    "Corporate Events",
    "Portrait Sessions",
    "Product Photography",
  ];

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
            Schedule a Consultation
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            Book Your Session
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="booking-form-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-6 sm:p-10 rounded-xl border ${
                isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        id="booking-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Alexandra Carter"
                        className={`w-full text-sm font-sans pl-10 pr-3 py-2.5 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        id="booking-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alexandra@example.com"
                        className={`w-full text-sm font-sans pl-10 pr-3 py-2.5 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        id="booking-phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full text-sm font-sans pl-10 pr-3 py-2.5 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Session Date */}
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                      Desired Event Date *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                        <Calendar className="w-4 h-4" />
                      </span>
                      <input
                        id="booking-date-input"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full text-sm font-sans pl-10 pr-3 py-2.5 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                      Venue Location
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <input
                        id="booking-location-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. SF Botanical Gardens, CA"
                        className={`w-full text-sm font-sans pl-10 pr-3 py-2.5 border rounded outline-none transition-colors ${
                          isDark
                            ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                            : "bg-white border-neutral-200 text-black focus:border-gold-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Session Category Selector */}
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                      Photography Style / Category *
                    </label>
                    <select
                      id="booking-session-type"
                      value={sessionType}
                      onChange={(e) => setSessionType(e.target.value)}
                      className={`w-full text-sm font-sans px-3 py-2.5 border rounded outline-none transition-colors ${
                        isDark
                          ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                          : "bg-white border-neutral-200 text-black focus:border-gold-500"
                      }`}
                    >
                      {sessionTypes.map((t) => (
                        <option key={t} value={t} className={isDark ? "bg-neutral-900 text-white" : "bg-white text-black"}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase font-semibold text-neutral-400 mb-2">
                    Tell us about your dream vision...
                  </label>
                  <textarea
                    id="booking-notes-input"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide details such as timelines, preferred visual cues, specific props, theme, or questions..."
                    className={`w-full text-sm font-sans p-3 border rounded outline-none transition-colors ${
                      isDark
                        ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                        : "bg-white border-neutral-200 text-black focus:border-gold-500"
                    }`}
                  />
                </div>

                {/* Quick informational bar */}
                <div className="flex gap-2 items-center text-xs text-gold-500 font-sans tracking-wide">
                  <Clock className="w-3.5 h-3.5" />
                  <span>We usually respond within 4-6 business hours with full calendar availability.</span>
                </div>

                {/* Submit button */}
                <button
                  id="booking-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Submit Booking Proposal"}
                  <ChevronRight className="w-4 h-4" />
                </button>

              </form>
            </motion.div>
          ) : (
            <motion.div
              key="booking-success-pane"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-10 rounded-xl border text-center ${
                isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <CheckCircle2 className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-light mb-2">Proposal Received!</h3>
              <p className="text-xs text-neutral-400 font-sans tracking-wide max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for reaching out to Lumina. Aria and the team have received your details. We've reserved the temporary block for <span className="text-gold-400 font-semibold">{date}</span> and will send confirmation shortly.
              </p>
              
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gold-500/20 bg-gold-950/10 rounded-full text-[10px] tracking-widest text-gold-400 uppercase font-sans mb-6">
                <Sparkles className="w-3 h-3" />
                <span>Next Step: Email Confirmation</span>
              </div>

              <div>
                <button
                  id="reset-booking-btn"
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 border border-neutral-700 hover:border-gold-500 font-sans text-[10px] tracking-widest uppercase text-neutral-400 hover:text-gold-400 transition-colors"
                >
                  Book Another Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
