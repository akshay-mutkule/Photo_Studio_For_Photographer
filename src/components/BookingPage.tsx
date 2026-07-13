import React, { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Phone, Mail, MapPin, User, ChevronRight, CheckCircle2, 
  Sparkles, Clock, Send, Bot, MessageSquare, Palette, CheckSquare, 
  Plus, Trash2, Download, Copy, Check, FileText 
} from "lucide-react";

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
  colors?: string[];
  shotList?: string[];
  styleKeywords?: string[];
}

interface InteractiveShot {
  text: string;
  checked: boolean;
}

export default function BookingPage({ theme, preSelectedPackage }: BookingPageProps) {
  const isDark = theme === "dark";

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [sessionType, setSessionType] = useState(preSelectedPackage || "Traditional Wedding Ceremony");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedPasscode, setGeneratedPasscode] = useState("");
  const [bookedEmail, setBookedEmail] = useState("");

  // AI Stylist Chat & Advanced Moodboard State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am Aria, your photo stylist. Tell me about your ideas—like what colors you like or where you want to shoot—and I will create a color palette, suggest nice locations, and give you simple outfit ideas. When you are ready, you can apply these suggestions directly to your booking form below!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [draftDetails, setDraftDetails] = useState<DraftDetails | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Advanced Interactive Moodboard States
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "moodboard">("chat");
  const [moodboardColors, setMoodboardColors] = useState<string[]>([]);
  const [moodboardShots, setMoodboardShots] = useState<InteractiveShot[]>([]);
  const [newShotText, setNewShotText] = useState("");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat container to bottom without scrolling the whole window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading, activeRightTab]);

  // Sync package selection when prop updates
  useEffect(() => {
    if (preSelectedPackage) {
      setSessionType(preSelectedPackage);
    }
  }, [preSelectedPackage]);

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
        const resData = await response.json();
        setGeneratedPasscode(resData.profilePasscode || "");
        setBookedEmail(email);
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
          
          // Set advanced interactive states
          if (data.draftDetails.colors && Array.isArray(data.draftDetails.colors)) {
            setMoodboardColors(data.draftDetails.colors);
          } else {
            // High-quality pastel fallbacks
            setMoodboardColors(["#FAF8F5", "#DCD5C9", "#A69986", "#6E5E4E", "#2C2016"]);
          }

          if (data.draftDetails.shotList && Array.isArray(data.draftDetails.shotList)) {
            setMoodboardShots(data.draftDetails.shotList.map((s: string) => ({ text: s, checked: false })));
          } else {
            // Fallback shot list
            setMoodboardShots([
              { text: "Candid walking and laughing pose", checked: false },
              { text: "Scenic background portrait showing natural beauty", checked: false },
              { text: "Detailed macro-style accessory close-up", checked: false },
              { text: "Dramatic low-light silhouette frame", checked: false }
            ]);
          }

          // Auto-highlight the newly generated visual blueprint
          setActiveRightTab("moodboard");
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

  // Add custom user shot to interactive checklist
  const handleAddShot = (e: FormEvent) => {
    e.preventDefault();
    if (!newShotText.trim()) return;
    setMoodboardShots(prev => [...prev, { text: newShotText.trim(), checked: false }]);
    setNewShotText("");
  };

  // Toggle specific shot checklist item state
  const handleToggleShot = (index: number) => {
    setMoodboardShots(prev =>
      prev.map((s, idx) => (idx === index ? { ...s, checked: !s.checked } : s))
    );
  };

  // Remove specific shot checklist item
  const handleDeleteShot = (index: number) => {
    setMoodboardShots(prev => prev.filter((_, idx) => idx !== index));
  };

  // Copy hex color code helper
  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Export creative planning blueprint as an elegant local text file
  const handleExportBlueprint = () => {
    if (!draftDetails) return;

    const styleLabels = draftDetails.styleKeywords?.join(", ") || "Dreamy, Cinematic, Minimalist";
    const colorsList = moodboardColors.map((c, i) => `${i + 1}. ${c}`).join("\n");
    const shotListText = moodboardShots.map(s => `[${s.checked ? "X" : " "}] ${s.text}`).join("\n");

    const fileContent = `============================================================
           VS PHOTOGRAPHY STYLING & CREATIVE BLUEPRINT          
============================================================
Artistic Style Keywords: [${styleLabels}]
Proposed Category: ${draftDetails.sessionType || "Custom Shoot"}
Location Venue: ${draftDetails.location || "To Be Finalized"}

------------------ ARTISTIC COLOR PALETTE ------------------
${colorsList || "No custom colors designed."}

------------------- PLANNED CONCEPT SHOTS ------------------
${shotListText || "No conceptual shots planned yet."}

---------------------- STYLING DETAILS ---------------------
${draftDetails.notes || "No extra styling notes."}

------------------------------------------------------------
Generated with VS Photography Stylist.
Thank you for co-creating with us!
============================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VS_Photography_Blueprint_${draftDetails.sessionType || "Shoot"}.txt`.replace(/\s+/g, "_");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    "Premium Multi-Day Wedding",
    "Traditional Wedding Ceremony",
    "Pre-Wedding Scenic Shoot",
    "Haldi & Mehendi Festivities",
    "Maternity & Dohale Jevan",
    "Festive & Family Portrait",
  ];

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Styling & Booking
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            Book Your Session
          </h2>
          <p className="text-xs font-sans tracking-wide text-neutral-400 max-w-lg mx-auto">
            Plan your style with Aria, our photo stylist, or fill out the booking form below directly.
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
                      Applied Aria's suggestions to your form!
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
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
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
                          placeholder="Akshay Mutkule"
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
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
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
                          placeholder="akshay@gmail.com"
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
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
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
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
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
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
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
                      <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}>
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
                    <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}>
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

              {/* Right Column: AI Consultant Panel & Dynamic Moodboard */}
              <motion.div
                key="booking-ai-stylist"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className={`lg:col-span-5 rounded-xl border flex flex-col h-[680px] overflow-hidden ${
                  isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                {/* AI Panel Header with Studio Branding */}
                <div className="p-4 border-b border-neutral-900/60 flex items-center justify-between bg-gold-500/5 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                      <Bot className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-medium tracking-wide">Aria Sterling</h4>
                      <p className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 inline-block animate-pulse"></span>
                        Creative Studio Co-Director
                      </p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-gold-500/70" />
                </div>

                {/* Sub-Tab Navigation Switcher */}
                <div className="flex border-b border-neutral-900 bg-neutral-950/40 p-1 gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveRightTab("chat")}
                    className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-sans font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                      activeRightTab === "chat" ? "bg-gold-500 text-black" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Consultant Chat
                  </button>
                  <button
                    type="button"
                    disabled={!draftDetails}
                    onClick={() => draftDetails && setActiveRightTab("moodboard")}
                    className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-sans font-semibold rounded transition-all flex items-center justify-center gap-1.5 relative ${
                      !draftDetails ? "opacity-30 cursor-not-allowed text-neutral-600" : ""
                    } ${
                      activeRightTab === "moodboard" ? "bg-gold-500 text-black" : "text-neutral-400 hover:text-white"
                    }`}
                    title={!draftDetails ? "Chat with Aria first to unlock your visual moodboard!" : "View styled blueprint"}
                  >
                    <Palette className="w-3.5 h-3.5" /> Creative Moodboard
                    {draftDetails && activeRightTab !== "moodboard" && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                </div>

                {/* Main Dynamic Viewport */}
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 scrollbar-thin flex flex-col">
                  {activeRightTab === "chat" ? (
                    <div className="flex-grow flex flex-col h-full justify-between gap-4">
                      {/* Chat Logs */}
                      <div className="space-y-4 text-xs font-sans flex-grow">
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
                      </div>

                      {/* Applied Trigger inside Chat tab */}
                      {draftDetails && (
                        <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg flex flex-col gap-2 mt-auto">
                          <p className="text-[10px] text-neutral-400 font-sans uppercase tracking-widest text-center">
                            🌟 Dynamic photoshoot suggestions generated!
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveRightTab("moodboard")}
                            className="w-full py-2 bg-neutral-950 border border-neutral-800 hover:border-gold-500/50 text-gold-400 text-[10px] uppercase font-sans tracking-widest font-semibold rounded flex items-center justify-center gap-1"
                          >
                            Open Visual Studio Moodboard <Palette className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // === MOODBOARD VIEW ===
                    <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
                      {/* Keywords / Artistic Mood tags */}
                      <div>
                        <span className="text-[9px] tracking-widest uppercase text-neutral-500 block mb-2 font-mono">
                          Style Archetype & Vibe
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(draftDetails?.styleKeywords || ["Dreamy", "Cinematic", "Minimalist", "Editorial"]).map((keyword, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-gold-500/5 text-gold-400 border border-gold-500/15 rounded-full text-[10px] tracking-wide font-medium font-sans"
                            >
                              ✨ {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Color Palette Swatches */}
                      <div>
                        <span className="text-[9px] tracking-widest uppercase text-neutral-500 block mb-2 font-mono">
                          Aesthetic Palette (Click to Copy Hex)
                        </span>
                        <div className="grid grid-cols-5 gap-1.5">
                          {moodboardColors.map((color, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleCopyColor(color)}
                              className="group relative flex flex-col items-center gap-1 focus:outline-none cursor-pointer"
                              title={`Copy ${color}`}
                            >
                              <div
                                className="w-full h-12 rounded-md border border-neutral-800 shadow-md transition-transform group-hover:scale-[1.04] active:scale-95 flex items-center justify-center"
                                style={{ backgroundColor: color }}
                              >
                                {copiedColor === color ? (
                                  <Check className="w-4 h-4 text-emerald-500 bg-black/80 p-0.5 rounded-full" />
                                ) : (
                                  <Copy className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-0.5 rounded" />
                                )}
                              </div>
                              <span className="text-[8px] font-mono tracking-wider text-neutral-400 mt-0.5">
                                {color}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Conceptual Shot List Checklist */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] tracking-widest uppercase text-neutral-500 font-mono">
                            Concept Shot Checklist & Planning
                          </span>
                          <span className="text-[9px] font-mono text-gold-400">
                            {moodboardShots.filter(s => s.checked).length} of {moodboardShots.length} Selected
                          </span>
                        </div>

                        {/* Progress visual bar */}
                        <div className="w-full h-1 bg-neutral-900 rounded overflow-hidden mb-3">
                          <div 
                            className="h-full bg-gold-500 transition-all duration-300"
                            style={{ 
                              width: `${moodboardShots.length ? (moodboardShots.filter(s => s.checked).length / moodboardShots.length) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>

                        {/* Checklist items list */}
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {moodboardShots.map((shot, idx) => (
                            <div 
                              key={idx}
                              className={`flex items-center justify-between p-2 rounded border text-[11px] transition-colors ${
                                shot.checked 
                                  ? "bg-neutral-900/40 border-neutral-800/80 text-neutral-400" 
                                  : "bg-black/30 border-neutral-900 text-neutral-200"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleShot(idx)}
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                <span className={`w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition-colors ${
                                  shot.checked ? "bg-gold-500 border-gold-500 text-black" : "border-neutral-700"
                                }`}>
                                  {shot.checked && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                                </span>
                                <span className={shot.checked ? "line-through opacity-70" : ""}>
                                  {shot.text}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteShot(idx)}
                                className="text-neutral-500 hover:text-red-400 p-0.5"
                                title="Remove shot idea"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Inline input to append new shots */}
                        <form onSubmit={handleAddShot} className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={newShotText}
                            onChange={(e) => setNewShotText(e.target.value)}
                            placeholder="Add your own custom shot idea..."
                            className={`flex-grow text-[11px] font-sans px-2.5 py-1.5 rounded border outline-none transition-colors ${
                              isDark
                                ? "bg-black border-neutral-900 text-white focus:border-gold-500"
                                : "bg-white border-neutral-200 text-black focus:border-gold-500"
                            }`}
                          />
                          <button
                            type="submit"
                            className="p-1.5 bg-neutral-900 text-gold-500 hover:bg-neutral-800 border border-neutral-800 rounded transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </form>
                      </div>

                      {/* Applied Draft meta details and actions */}
                      <div className="pt-4 border-t border-neutral-900 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={handleApplyDraft}
                            className="py-2.5 bg-gold-500 hover:bg-gold-400 text-black text-[10px] tracking-widest uppercase font-bold rounded flex items-center justify-center gap-1 shadow-md transform active:scale-95 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Apply to Form
                          </button>
                          <button
                            type="button"
                            onClick={handleExportBlueprint}
                            className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-gold-500 border border-neutral-800 text-[10px] tracking-widest uppercase font-bold rounded flex items-center justify-center gap-1 shadow-md transform active:scale-95 transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Export Blueprint
                          </button>
                        </div>
                        <p className="text-[9px] text-neutral-500 font-mono text-center">
                          Aria's curated location: "{draftDetails?.location || "SF Area"}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input Box for chat fallback */}
                {activeRightTab === "chat" && (
                  <form onSubmit={handleSendChat} className="p-3 border-t border-neutral-900/40 flex gap-2 shrink-0">
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
                )}
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
                Thank you for reaching out to VS Photography. Vinayak and the team have received your details and we've reserved the temporary block for your photoshoot.
              </p>

              {/* Secure Client Profile Display */}
              {generatedPasscode && (
                <div className={`p-6 rounded-lg border text-left max-w-lg mx-auto mb-6 space-y-3.5 ${
                  isDark ? "bg-black/40 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                }`}>
                  <div className="flex items-center gap-1.5 text-gold-500">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold font-mono">
                      Secure Client Profile Auto-Created
                    </span>
                  </div>
                  
                  <p className={`text-xs font-sans leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                    To let you track booking approvals, see photographer comments, and view your published proofing photosheets, we've created a secure profile. Log into the <strong className="text-gold-500">Client Portal</strong> using:
                  </p>

                  <div className={`p-3.5 rounded border font-sans space-y-2 ${
                    isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-100"
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 text-[10px] uppercase font-mono">Login Email:</span>
                      <span className="font-medium text-neutral-300">{bookedEmail}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-neutral-900/40 pt-2">
                      <span className="text-neutral-500 text-[10px] uppercase font-mono">Profile Passcode:</span>
                      <span className="font-mono font-bold text-gold-500 tracking-wider select-all text-sm">{generatedPasscode}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-500 font-sans text-center">
                    🔒 Save this passcode to log into your portal anytime. We'll post approval updates here!
                  </p>
                </div>
              )}
              
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gold-500/20 bg-gold-950/10 rounded-full text-[10px] tracking-widest text-gold-400 uppercase font-sans mb-6">
                <Clock className="w-3 h-3" />
                <span>Next Step: Reviewing and Notification</span>
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
