import React, { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Phone, Mail, MapPin, User, ChevronRight, CheckCircle2, Sparkles, Clock, Send, Bot, MessageSquare } from "lucide-react";

interface BookingPageProps {
  theme: "dark" | "light";
  preSelectedPackage: string;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface DraftDetails {
  location?: string;
  sessionType?: string;
  notes?: string;
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

  // AI Stylist Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am Aria, your AI Creative Director. Tell me a bit about your photoshoot vision—whether it's a romantic golden hour session, a moody studio portrait, or an elegant wedding—and I will style customized color palettes, suggest scenic locations, and detail outfit ideas for you. Once we craft your vision, you can directly apply it to the booking form below!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [draftDetails, setDraftDetails] = useState<DraftDetails | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

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
        setDraftDetails(null);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // AI Consultant Chat Handler
  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    const updatedMessages = [...chatMessages, { role: "user" as const, text: userText }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/gemini/shoot-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { role: "model", text: data.text }]);
        if (data.draftDetails && (data.draftDetails.location || data.draftDetails.notes || data.draftDetails.sessionType)) {
          setDraftDetails(data.draftDetails);
        }
      } else {
        throw new Error("Stylist failed to process");
      }
    } catch (err) {
      console.error("Consultant error:", err);
      setChatMessages(prev => [
        ...prev,
        {
          role: "model",
          text: "I apologize, but I had a small glitch in my creative lens. Please share your idea again and we'll keep styling!"
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Auto populate standard inputs with Aria's drafted suggestions
  const handleApplyDraft = () => {
    if (!draftDetails) return;

    if (draftDetails.location) {
      setLocation(draftDetails.location);
    }
    if (draftDetails.sessionType) {
      // Safely ensure it matches one of the options
      const matched = sessionTypes.find(t => t.toLowerCase() === draftDetails.sessionType?.toLowerCase() || t.includes(draftDetails.sessionType || ""));
      if (matched) {
        setSessionType(matched);
      } else {
        setSessionType(draftDetails.sessionType);
      }
    }
    if (draftDetails.notes) {
      setNotes(draftDetails.notes);
    }

    setAppliedNotification(true);
    setTimeout(() => {
      setAppliedNotification(false);
    }, 4000);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Bespoke Styling & Scheduling
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            Book Your Vision
          </h2>
          <p className="text-xs font-sans tracking-wide text-neutral-400 max-w-lg mx-auto">
            Plan your conceptual theme with Aria, our AI Creative Director, or complete your booking request directly.
          </p>
          <div className="w-12 h-[1px] bg-gold-500/40 mx-auto mt-4 rounded"></div>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Standard Booking Form */}
              <motion.div
                key="booking-form-pane"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className={`lg:col-span-7 p-6 sm:p-8 rounded-xl border ${
                  isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-neutral-50/60 border-neutral-200"
                } backdrop-blur-sm relative`}
              >
                {appliedNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-4 left-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 text-[11px] font-sans tracking-wider uppercase rounded flex items-center justify-between z-10"
                  >
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied Aria's Creative suggestions successfully!
                    </span>
                  </motion.div>
                )}

                <h3 className="font-serif text-lg font-light mb-6 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gold-500" />
                  Booking Details
                </h3>

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
                      rows={6}
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
                    className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Processing..." : "Submit Booking Proposal"}
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </form>
              </motion.div>

              {/* Right Column: AI Consultant Panel */}
              <motion.div
                key="booking-ai-stylist"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className={`lg:col-span-5 rounded-xl border flex flex-col h-[650px] overflow-hidden ${
                  isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                {/* AI Panel Header */}
                <div className="p-4 border-b border-neutral-900/60 flex items-center justify-between bg-gold-500/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                      <Bot className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-medium tracking-wide">Aria</h4>
                      <p className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 inline-block animate-pulse"></span>
                        AI Creative Director & Stylist
                      </p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-gold-500/70" />
                </div>

                {/* Messages Panel */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 text-xs font-sans scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-gold-500 text-black font-medium"
                            : isDark
                            ? "bg-neutral-900 text-neutral-200 border border-neutral-800"
                            : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className={`max-w-[80%] rounded-lg px-3.5 py-3 flex items-center gap-2 ${
                        isDark ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-100 border border-neutral-200"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Autofill Suggesion Banner */}
                {draftDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 border-t border-gold-500/20 bg-gold-500/5 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-widest uppercase text-gold-400 font-bold font-mono">
                        Aria's Concept Draft Ready
                      </span>
                      <span className="text-[9px] text-neutral-400 font-mono">
                        {draftDetails.sessionType || "Custom Design"}
                      </span>
                    </div>
                    <button
                      onClick={handleApplyDraft}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-[10px] tracking-widest uppercase font-bold rounded flex items-center justify-center gap-1.5 shadow-md transform active:scale-95 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Apply Aria's Design to Form
                    </button>
                  </motion.div>
                )}

                {/* Message Input Box */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-neutral-900/40 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about themes, SF locations, clothing, etc..."
                    disabled={chatLoading}
                    className={`flex-grow text-xs font-sans px-3.5 py-2.5 rounded border outline-none transition-colors ${
                      isDark
                        ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                        : "bg-white border-neutral-200 text-black focus:border-gold-500"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-4 bg-neutral-900 hover:bg-neutral-800 text-gold-500 border border-neutral-800 rounded flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>

            </div>
          ) : (
            <motion.div
              key="booking-success-pane"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-10 rounded-xl border text-center max-w-3xl mx-auto ${
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
