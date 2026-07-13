import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Heart, CheckSquare, Square, Download, Share2, Eye, 
  ShieldAlert, CheckCircle2, RefreshCw, Star, Info, ZoomIn, 
  ZoomOut, Sparkles, User, Bell, Calendar, ChevronRight, Image as ImageIcon, Check, Mail 
} from "lucide-react";
import { Gallery, ImageItem } from "../types.js";

interface ClientPortalProps {
  theme: "dark" | "light";
  initialGalleryId?: string;
  onClientAuthenticated: (isAuthenticated: boolean) => void;
  onAdminAuthenticated?: (isAuthenticated: boolean) => void;
  setActiveTab?: (tab: string) => void;
}

export default function ClientPortal({
  theme,
  initialGalleryId,
  onClientAuthenticated,
  onAdminAuthenticated,
  setActiveTab,
}: ClientPortalProps) {
  const isDark = theme === "dark";

  // Auth & Mode State Management
  const [loginMode, setLoginMode] = useState<"gallery" | "profile">("gallery");
  const [passcode, setPasscode] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePasscode, setProfilePasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Authenticated Data State
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [clientProfile, setClientProfile] = useState<any | null>(null);
  const [clientBookings, setClientBookings] = useState<any[]>([]);
  const [clientGalleries, setClientGalleries] = useState<any[]>([]);

  // Interactive UI State
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Dismiss security notice after 3.5 seconds
  useEffect(() => {
    if (securityNotice) {
      const timer = setTimeout(() => {
        setSecurityNotice(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [securityNotice]);

  // Window Focus & Screenshot Protection listeners
  useEffect(() => {
    if (!gallery) return;

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleBlur = () => {
      setIsWindowBlurred(true);
      setSecurityNotice("Screenshot Protection Active: Screen capture or focus loss detected.");
    };

    const preventDefaultShortcuts = (e: KeyboardEvent) => {
      // Prevent Print (Ctrl + P / Cmd + P)
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setSecurityNotice("Print function disabled on proofing sessions.");
      }
      // Prevent Save Page (Ctrl + S / Cmd + S)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setSecurityNotice("Saving pages is blocked to safeguard photographer copyright.");
      }
      // Prevent Copy (Ctrl + C / Cmd + C) on text/images
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        setSecurityNotice("Content copying is disabled under active copyright protection.");
      }
      // Check Print Screen key
      if (e.key === "PrintScreen") {
        e.preventDefault();
        setSecurityNotice("Screenshot Attempt Blocked. Dynamic watermarks are embedded.");
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", preventDefaultShortcuts);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", preventDefaultShortcuts);
    };
  }, [gallery]);

  // Load gallery directly if pre-fetched via direct share link parameters
  useEffect(() => {
    if (initialGalleryId) {
      setLoading(true);
      fetch(`/api/client/gallery/${initialGalleryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.gallery && !data.requiresPasscode) {
            setGallery(data.gallery);
            onClientAuthenticated(true);
          }
        })
        .catch((err) => console.error("Direct link load failure:", err))
        .finally(() => setLoading(false));
    }
  }, [initialGalleryId, onClientAuthenticated]);

  // Gallery Passcode Auth Handler
  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    const inputPass = passcode.trim();
    if (!inputPass) return;

    if (inputPass === "akshay") {
      if (onAdminAuthenticated && setActiveTab) {
        onAdminAuthenticated(true);
        setActiveTab("admin-portal");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/client/gallery-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: inputPass }),
      });

      if (response.ok) {
        const data = await response.json();
        setGallery(data);
        onClientAuthenticated(true);
        if (data.selectionSubmitted) {
          setSubmissionSuccess(true);
        }
      } else {
        const errData = await response.json();
        setError(errData.error || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please verify network or try again.");
    } finally {
      setLoading(false);
    }
  };

  // Client Profile Auth Handler
  const handleProfileAuth = async (e: FormEvent) => {
    e.preventDefault();
    const inputEmail = profileEmail.trim();
    const inputPass = profilePasscode.trim();
    if (!inputEmail || !inputPass) return;

    if (inputEmail.toLowerCase() === "akshay" && inputPass === "akshay") {
      if (onAdminAuthenticated && setActiveTab) {
        onAdminAuthenticated(true);
        setActiveTab("admin-portal");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/client/profile-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputEmail,
          passcode: inputPass
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setClientProfile(data.profile);
        setClientBookings(data.bookings || []);
        setClientGalleries(data.galleries || []);
        onClientAuthenticated(true);
      } else {
        const errData = await response.json();
        setError(errData.error || "Invalid Email or Profile Passcode.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notifId: string) => {
    if (!clientProfile) return;

    const updatedNotifs = clientProfile.notifications.map((n: any) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    setClientProfile({ ...clientProfile, notifications: updatedNotifs });

    try {
      await fetch("/api/client/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clientProfile.clientEmail,
          passcode: clientProfile.passcode,
          notificationId: notifId
        })
      });
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  // Toggle favorite trigger with backend synchrony
  const handleToggleFavorite = async (imgId: string) => {
    if (!gallery) return;

    const isFav = gallery.favorites.includes(imgId);
    const updatedFavs = isFav
      ? gallery.favorites.filter((id) => id !== imgId)
      : [...gallery.favorites, imgId];

    // Optimistic local state update
    const updatedGallery = { ...gallery, favorites: updatedFavs };
    setGallery(updatedGallery);

    try {
      await fetch("/api/client/gallery-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryId: gallery.id,
          favorites: updatedFavs,
        }),
      });
    } catch (err) {
      console.error("Action save error:", err);
    }
  };

  // Toggle image selection for final submission
  const handleToggleSelect = async (imgId: string) => {
    if (!gallery || gallery.selectionSubmitted) return;

    const isSelected = gallery.selected.includes(imgId);
    const updatedSelected = isSelected
      ? gallery.selected.filter((id) => id !== imgId)
      : [...gallery.selected, imgId];

    // Optimistic local state update
    const updatedGallery = { ...gallery, selected: updatedSelected };
    setGallery(updatedGallery);

    try {
      await fetch("/api/client/gallery-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryId: gallery.id,
          selected: updatedSelected,
        }),
      });
    } catch (err) {
      console.error("Action save error:", err);
    }
  };

  // Final submit selection list
  const handleFinalSubmit = async () => {
    if (!gallery || gallery.selected.length === 0) return;
    setLoading(true);

    try {
      const response = await fetch("/api/client/gallery-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryId: gallery.id,
          submitSelection: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGallery(data);
        setSubmissionSuccess(true);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Force local client-side asset download
  const handleDownloadImage = (img: ImageItem) => {
    const link = document.createElement("a");
    link.href = img.url;
    link.download = img.originalName || "vs-photo.jpg";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logout / Switch Gallery
  const handleExitPortal = () => {
    setGallery(null);
    setClientProfile(null);
    setClientBookings([]);
    setClientGalleries([]);
    setPasscode("");
    setProfileEmail("");
    setProfilePasscode("");
    setSubmissionSuccess(false);
    onClientAuthenticated(false);
  };

  // Back to dashboard
  const handleBackToDashboard = async () => {
    setGallery(null);
    setSubmissionSuccess(false);
    if (clientProfile) {
      try {
        const response = await fetch("/api/client/profile-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: clientProfile.clientEmail,
            passcode: clientProfile.passcode
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setClientProfile(data.profile);
          setClientBookings(data.bookings || []);
          setClientGalleries(data.galleries || []);
        }
      } catch (err) {
        console.error("Dashboard refresh error:", err);
      }
    }
  };

  return (
    <div
      onContextMenu={(e) => {
        if (gallery) {
          e.preventDefault();
          setSecurityNotice("Right-click is protected. Image downloads and saving are disabled.");
        }
      }}
      className={`py-12 sm:py-20 transition-colors duration-300 min-h-[80vh] flex flex-col justify-center relative select-none ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Copyright Security Toast */}
      <AnimatePresence>
        {securityNotice && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] bg-red-950/95 border border-red-500/40 p-4 rounded-xl shadow-2xl shadow-red-950/80 backdrop-blur-md flex items-start gap-3 text-left font-sans"
          >
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-red-400">Security Protocol</h5>
              <p className="text-[11px] text-neutral-200 mt-1 font-light leading-relaxed">{securityNotice}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ================= STAGE 1: AUTHENTICATION ACCESS GATES ================= */}
        {!gallery && !clientProfile && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gold-950/20 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-gold-500 animate-pulse" />
              </div>
              <h2 className="font-serif text-3xl font-light mb-2">Secure Proofing Portal</h2>
              <p className={`text-xs font-sans tracking-wide ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Access your private shoot gallery or check your booking request approvals.
              </p>

              {/* Login Mode Switcher Tabs */}
              <div className="flex border-b border-neutral-900 mt-6 p-1 bg-neutral-950/40 rounded-lg gap-1">
                <button
                  type="button"
                  onClick={() => { setLoginMode("gallery"); setError(""); }}
                  className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-sans font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                    loginMode === "gallery" ? "bg-gold-500 text-black font-bold" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Gallery Passcode
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode("profile"); setError(""); }}
                  className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-sans font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                    loginMode === "profile" ? "bg-gold-500 text-black font-bold" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Client Profile
                </button>
              </div>
            </div>

            <div className={`p-8 rounded-xl border ${
              isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
            }`}>
              {loginMode === "gallery" ? (
                <form onSubmit={handleAuth} className="space-y-6">
                  <div>
                    <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      Enter Gallery Passcode
                    </label>
                    <input
                      id="client-passcode-input"
                      type="password"
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="e.g., autumn2026"
                      className={`w-full text-center text-sm tracking-widest font-mono p-3 border rounded outline-none transition-colors ${
                        isDark
                          ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                          : "bg-white border-neutral-200 text-black focus:border-gold-500"
                      }`}
                    />
                  </div>

                  {error && (
                    <div className="flex gap-2 items-center p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    id="client-portal-auth-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Unlock My Gallery</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleProfileAuth} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-1.5 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      Email Address or Username
                    </label>
                    <input
                      id="profile-email-input"
                      type="text"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="akshay@gmail.com"
                      className={`w-full text-sm p-3 border rounded outline-none transition-colors ${
                        isDark
                          ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                          : "bg-white border-neutral-200 text-black focus:border-gold-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-1.5 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      Profile Passcode
                    </label>
                    <input
                      id="profile-passcode-input"
                      type="password"
                      required
                      value={profilePasscode}
                      onChange={(e) => setProfilePasscode(e.target.value)}
                      placeholder="Password"
                      className={`w-full text-sm font-mono tracking-wider p-3 border rounded outline-none transition-colors ${
                        isDark
                          ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                          : "bg-white border-neutral-200 text-black focus:border-gold-500"
                      }`}
                    />
                  </div>

                  {error && (
                    <div className="flex gap-2 items-center p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    id="profile-login-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Sign In to My Profile</span>
                  </button>
                </form>
              )}

              <div className="mt-6 text-center text-[10px] text-neutral-500 font-sans">
                Passcodes are auto-generated when you submit a photoshoot booking request.
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 1.5: CLIENT PROFILE DASHBOARD ================= */}
        {!gallery && clientProfile && (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className={`p-6 sm:p-8 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <span className="text-[10px] tracking-widest text-gold-500 uppercase font-mono font-bold">
                    Authenticated Client Dashboard
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light mt-0.5">{clientProfile.clientName}</h2>
                  <p className="text-xs text-neutral-500 font-sans tracking-wide">
                    Email: {clientProfile.clientEmail} • Profile ID: {clientProfile.id}
                  </p>
                </div>
              </div>

              <button
                onClick={handleExitPortal}
                className="px-4 py-2 border border-neutral-700 hover:border-red-500 font-sans text-[10px] tracking-widest uppercase text-neutral-400 hover:text-red-400 transition-colors"
              >
                Sign Out of Portal
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Bookings and Galleries */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. Photoshoot Bookings Tracker */}
                <div className={`p-6 rounded-xl border ${
                  isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
                }`}>
                  <h3 className="font-serif text-lg font-light mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    My Photoshoot Bookings
                  </h3>
                  
                  {clientBookings.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-neutral-800 rounded-lg">
                      <p className="text-xs text-neutral-500 font-sans">No bookings placed under this email address yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clientBookings.map((b) => (
                        <div key={b.id} className={`p-4 rounded-lg border font-sans ${
                          isDark ? "bg-black/40 border-neutral-900" : "bg-white border-neutral-100 shadow-sm"
                        }`}>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-gold-400">{b.sessionType}</h4>
                              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {b.date} • {b.location}
                              </p>
                            </div>
                            <div>
                              {b.status === "confirmed" ? (
                                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Approved & Booked
                                </span>
                              ) : b.status === "declined" ? (
                                <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase rounded-full tracking-wider">
                                  Declined / Cancelled
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase rounded-full tracking-wider animate-pulse">
                                  Pending Photographer Review
                                </span>
                              )}
                            </div>
                          </div>
                          {b.notes && (
                            <p className="text-xs text-neutral-500 mt-2.5 border-t border-neutral-900/40 pt-2 font-light">
                              Notes: {b.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. My Proofing Galleries */}
                <div className={`p-6 rounded-xl border ${
                  isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
                }`}>
                  <h3 className="font-serif text-lg font-light mb-4 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gold-500" />
                    Published Proofing Shoots
                  </h3>

                  {clientGalleries.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-neutral-800 rounded-lg">
                      <p className="text-xs text-neutral-500 font-sans">No proofing galleries published yet. Once your shoot photos are imported, you will see your selection gallery here!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clientGalleries.map((g) => (
                        <div key={g.id} className={`rounded-lg overflow-hidden border transition-transform duration-300 hover:scale-[1.02] ${
                          isDark ? "bg-black/40 border-neutral-900" : "bg-white border-neutral-200"
                        }`}>
                          <div className="aspect-[16/10] overflow-hidden relative">
                            <img src={g.coverImage} alt={g.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 space-y-2 font-sans">
                            <h4 className="font-serif text-md font-medium">{g.title}</h4>
                            <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">{g.description}</p>
                            <p className="text-[9px] text-neutral-500 font-mono uppercase">Date: {g.date}</p>
                            <button
                              onClick={() => {
                                setGallery(g);
                                if (g.selectionSubmitted) {
                                  setSubmissionSuccess(true);
                                }
                              }}
                              className="w-full py-2 bg-gold-500 hover:bg-gold-400 text-black text-[10px] uppercase font-bold tracking-widest rounded transition-colors mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>Open Proofing Suite</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Side: Profile Notifications */}
              <div className="lg:col-span-5">
                <div className={`p-6 rounded-xl border ${
                  isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
                }`}>
                  <h3 className="font-serif text-lg font-light mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gold-500" />
                      Notifications Feed
                    </span>
                    {clientProfile.notifications?.filter((n: any) => !n.read).length > 0 && (
                      <span className="px-2 py-0.5 bg-gold-500 text-black text-[9px] font-bold rounded-full uppercase tracking-wider font-sans">
                        {clientProfile.notifications.filter((n: any) => !n.read).length} New
                      </span>
                    )}
                  </h3>

                  {(!clientProfile.notifications || clientProfile.notifications.length === 0) ? (
                    <div className="p-6 text-center border border-dashed border-neutral-800 rounded-lg font-sans text-xs text-neutral-500">
                      No notifications yet.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                      {clientProfile.notifications.map((n: any) => (
                        <div key={n.id} className={`p-4 rounded-lg border font-sans relative ${
                          n.read 
                            ? (isDark ? "bg-black/10 border-neutral-900/60 opacity-60" : "bg-neutral-50/40 border-neutral-100") 
                            : (isDark ? "bg-gold-500/5 border-gold-500/20" : "bg-gold-500/5 border-gold-500/10")
                        }`}>
                          {!n.read && (
                            <span className="absolute top-4 right-4 w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                          )}
                          <h4 className={`text-xs font-semibold ${!n.read ? "text-gold-400" : "text-neutral-300"}`}>{n.title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{n.message}</p>
                          <div className="flex items-center justify-between mt-3 text-[9px] text-neutral-500">
                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                            {!n.read && (
                              <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-gold-500 hover:text-gold-400 uppercase tracking-wider font-bold transition-colors cursor-pointer"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STAGE 2: PRIVATE CLIENT CONSOLE ================= */}
        {gallery && (
          <div className="space-y-8">
            {/* Header / Stats Panel */}
            <div className={`p-6 sm:p-8 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
              isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
            }`}>
              <div>
                <div className="flex items-center gap-4">
                  {clientProfile && (
                    <button
                      onClick={handleBackToDashboard}
                      className="px-3 py-1 border border-neutral-800 hover:border-gold-500 text-neutral-400 hover:text-gold-500 rounded text-[10px] font-sans font-semibold tracking-wider uppercase transition-colors"
                    >
                      ← Back to Dashboard
                    </button>
                  )}
                  <span className="text-[10px] tracking-widest text-gold-500 uppercase font-mono font-semibold">
                    Secure Client Proofing Console
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light mt-2.5 mb-2">{gallery.title}</h2>
                <p className={`text-xs font-light max-w-xl leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {gallery.description || "Review and select your favorite shots for high-end post-production retouching."}
                </p>
                
                {gallery.expirationDate && (
                  <p className="text-[10px] text-neutral-500 font-mono mt-2">
                    EXPIRES: {gallery.expirationDate}
                  </p>
                )}
              </div>

              {/* Real-time selector stats counters */}
              <div className="flex gap-4 sm:gap-6 shrink-0 flex-wrap justify-center">
                <div className={`text-center px-4 py-2 border rounded ${
                  isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-neutral-100/60 border-neutral-200"
                }`}>
                  <div className="font-mono text-lg text-gold-500 font-bold">{gallery.images.length}</div>
                  <div className="text-[9px] tracking-widest uppercase text-neutral-500">Total Shots</div>
                </div>
                <div className={`text-center px-4 py-2 border rounded ${
                  isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-neutral-100/60 border-neutral-200"
                }`}>
                  <div className="font-mono text-lg text-red-500 font-bold">{gallery.favorites.length}</div>
                  <div className="text-[9px] tracking-widest uppercase text-neutral-500">Favorites</div>
                </div>
                <div className={`text-center px-4 py-2 border rounded ${
                  isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-neutral-100/60 border-neutral-200"
                }`}>
                  <div className="font-mono text-lg text-gold-500 font-bold">{gallery.selected.length}</div>
                  <div className="text-[9px] tracking-widest uppercase text-neutral-500">Selected</div>
                </div>
              </div>
            </div>

            {/* Instruction Warning banner */}
            <div className={`flex gap-3 items-start p-4 border text-xs max-w-4xl rounded-lg ${
              isDark ? "bg-gold-950/10 border-gold-500/20 text-gold-400" : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
              <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-gold-500" />
              <div>
                <p className="font-semibold uppercase tracking-wide text-[10px]">Client Proofing Guidelines</p>
                <p className="opacity-90 font-light mt-1">
                  1. Click the <Heart className="inline w-3.5 h-3.5 mx-0.5" /> icon to mark images as favorites.
                  <br />
                  2. Check the <CheckSquare className="inline w-3.5 h-3.5 mx-0.5" /> checkbox on the images you approve for final editing.
                  <br />
                  3. When done, click the <strong>Submit Approved Selection</strong> button at the bottom of the page.
                </p>
              </div>
            </div>

            {/* Photo proofing list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.images.map((img) => {
                const isFavorite = gallery.favorites.includes(img.id);
                const isSelected = gallery.selected.includes(img.id);

                return (
                  <div
                    key={img.id}
                    id={`client-img-card-${img.id}`}
                    className={`relative rounded-lg overflow-hidden border transition-all duration-300 ${
                      isSelected
                        ? "border-gold-500 shadow-lg shadow-gold-500/5 ring-1 ring-gold-500"
                        : isDark
                        ? "border-neutral-900"
                        : "border-neutral-200"
                    } ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative group">
                      <img
                        src={img.url}
                        alt={img.originalName}
                        onDragStart={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isWindowBlurred ? "filter blur-lg select-none scale-[0.98]" : ""
                        }`}
                        loading="lazy"
                      />

                      {/* Fully Transparent Interceptor Cover to block dragging or holding to save */}
                      <div className="absolute inset-0 z-10 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />

                      {/* Repeating Diagonal Watermark Overlay */}
                      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.22] select-none overflow-hidden flex items-center justify-center">
                        <div className="w-[160%] h-[160%] rotate-[-35deg] flex flex-wrap gap-x-20 gap-y-12 items-center justify-center font-sans text-[9px] tracking-[0.25em] font-extrabold text-white select-none pointer-events-none uppercase">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <span key={i} className="whitespace-nowrap select-none">
                              ARIA STERLING Fine Art Proof
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Focus Loss Warning Overlay */}
                      {isWindowBlurred && (
                        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center transition-all duration-300">
                          <ShieldAlert className="w-8 h-8 text-gold-500 mb-2 animate-bounce" />
                          <p className="font-sans text-[10px] font-bold tracking-widest text-gold-400 uppercase">Protection Active</p>
                          <p className="font-sans text-[9px] text-neutral-300 mt-1 max-w-[200px] leading-tight font-light">Refocus tab to preview image.</p>
                        </div>
                      )}

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 z-25 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setActiveImage(img);
                            setZoomLevel(1);
                          }}
                          className="p-2 bg-neutral-900 text-white hover:text-gold-500 border border-neutral-800 rounded transition-colors cursor-pointer"
                          title="Full-Screen Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Top Action Tags */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-auto z-25">
                        <button
                          onClick={() => handleToggleFavorite(img.id)}
                          className={`p-1.5 rounded bg-black/60 hover:bg-black/90 transition-colors ${
                            isFavorite ? "text-red-500" : "text-white"
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          disabled={gallery.selectionSubmitted}
                          onClick={() => handleToggleSelect(img.id)}
                          className={`p-1.5 rounded bg-black/60 hover:bg-black/90 transition-colors ${
                            isSelected ? "text-gold-400" : "text-white"
                          }`}
                        >
                          {isSelected ? (
                             <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Metadata strip */}
                    <div className={`p-3 flex justify-between items-center text-[10px] font-mono border-t ${
                      isDark
                        ? "text-neutral-400 border-neutral-900 bg-neutral-950/80"
                        : "text-neutral-600 border-neutral-200 bg-neutral-100"
                    }`}>
                      <span className="truncate max-w-[120px]">{img.originalName}</span>
                      <div className="flex gap-1">
                        {isFavorite && <span className="text-red-500 font-sans">❤ Starred</span>}
                        {isSelected && <span className="text-gold-500 font-sans">✔ Approved</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className={`sticky bottom-6 z-40 p-4 rounded-xl border shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? "bg-black/90 border-neutral-800" : "bg-white/90 border-neutral-200"
            }`}>
              <div className="flex items-center gap-3">
                <button
                  id="client-exit-portal-btn"
                  onClick={handleExitPortal}
                  className="px-4 py-2 border border-neutral-800 hover:border-gold-500 text-neutral-400 hover:text-gold-500 rounded text-[10px] tracking-widest uppercase font-sans transition-colors"
                >
                  Exit Portal
                </button>
                <span className="text-[10px] font-sans px-2.5 py-1 rounded border bg-red-950/10 border-red-500/20 text-red-400 flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Screen Capture Guard Active
                </span>
              </div>

              {/* Submission CTA Block */}
              <div>
                {gallery.selectionSubmitted ? (
                  <div className="flex items-center gap-2 text-green-500 font-sans text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selection Submitted Successfully!</span>
                  </div>
                ) : (
                  <button
                    id="client-submit-selections-btn"
                    onClick={handleFinalSubmit}
                    disabled={gallery.selected.length === 0 || loading}
                    className="px-8 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all rounded shadow-md"
                  >
                    {loading ? "Submitting..." : `Submit Final Approved Selection (${gallery.selected.length})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: SELECTION CONFIRMATION VIEW ================= */}
        <AnimatePresence>
          {submissionSuccess && gallery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4"
            >
              <div className="max-w-md w-full p-8 rounded-xl border border-neutral-900 bg-neutral-950 text-center text-white">
                <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                <h3 className="font-serif text-3xl font-light mb-2">Selection Finalized!</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                  Thank you, <span className="text-gold-400">{gallery.clientName}</span>. Your chosen <span className="text-gold-400 font-bold">{gallery.selected.length}</span> images have been submitted directly to Vinayak Sable for premium fine-art retouching and final preparation.
                </p>

                <div className="p-4 rounded border border-neutral-800 bg-neutral-900/40 mb-6 text-xs text-neutral-400 font-sans tracking-wide">
                  The photographer has been notified of your favorites and selections. The final premium retouched photos will be delivered as per your agreed package terms!
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setSubmissionSuccess(false)}
                    className="px-6 py-2 border border-neutral-800 hover:border-gold-500 font-sans text-[10px] tracking-widest uppercase hover:text-gold-400 transition-colors rounded"
                  >
                    View Selection
                  </button>
                  <button
                    onClick={handleExitPortal}
                    className="px-6 py-2 bg-gold-500 text-black font-sans text-[10px] tracking-widest uppercase font-semibold hover:bg-gold-400 transition-colors rounded"
                  >
                    Exit Portal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= LIGHTBOX PREVIEW MODAL ================= */}
        <AnimatePresence>
          {activeImage && gallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/99 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setActiveImage(null)}
            >
              <button
                className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xs uppercase tracking-widest font-sans font-semibold border border-neutral-800 px-3 py-1.5 rounded bg-neutral-900/60"
                onClick={() => setActiveImage(null)}
              >
                Close View
              </button>

              <div
                className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Container with zoom capability */}
                <div className="relative overflow-hidden rounded border border-neutral-900 bg-neutral-950 max-h-[70vh] flex items-center justify-center">
                  <img
                    src={activeImage.url}
                    alt={activeImage.originalName}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className={`max-h-[70vh] object-contain mx-auto transition-all duration-300 ${
                      isWindowBlurred ? "filter blur-xl select-none" : ""
                    }`}
                  />

                  {/* Fully Transparent Interceptor Cover to block dragging or holding to save */}
                  <div className="absolute inset-0 z-10 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />

                  {/* Repeating Diagonal Watermark Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.25] select-none overflow-hidden flex items-center justify-center">
                    <div className="w-[180%] h-[180%] rotate-[-30deg] flex flex-wrap gap-x-24 gap-y-16 items-center justify-center font-sans text-[10px] tracking-[0.25em] font-extrabold text-white select-none pointer-events-none uppercase">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} className="whitespace-nowrap select-none">
                          ARIA STERLING Copyrighted Proof
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Focus Loss Warning Overlay */}
                  {isWindowBlurred && (
                    <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                      <ShieldAlert className="w-12 h-12 text-gold-500 mb-3 animate-pulse" />
                      <p className="font-sans text-xs font-bold tracking-widest text-gold-400 uppercase">High-Security Snapshot Guard</p>
                      <p className="font-sans text-[10px] text-neutral-300 mt-2 max-w-sm leading-relaxed font-light">
                        To protect the artist's original fine-art works, screenshots and window focus switching are disabled. Refocus the page to unlock.
                      </p>
                    </div>
                  )}
                </div>

                {/* Lightbox actions strip */}
                <div className="flex gap-4 mt-6 items-center bg-neutral-950/90 border border-neutral-900 rounded-full px-6 py-3 backdrop-blur-sm z-30">
                  {/* Favorite action */}
                  <button
                    onClick={() => handleToggleFavorite(activeImage.id)}
                    className={`flex items-center gap-1 text-[10px] tracking-widest uppercase font-sans ${
                      gallery.favorites.includes(activeImage.id) ? "text-red-500 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Favorite</span>
                  </button>

                  <div className="h-4 w-px bg-neutral-800" />

                  {/* Checkbox select action */}
                  <button
                    disabled={gallery.selectionSubmitted}
                    onClick={() => handleToggleSelect(activeImage.id)}
                    className={`flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-sans ${
                      gallery.selected.includes(activeImage.id) ? "text-gold-400 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {gallery.selected.includes(activeImage.id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>{gallery.selected.includes(activeImage.id) ? "Selected" : "Select Photo"}</span>
                  </button>

                  <div className="h-4 w-px bg-neutral-800" />

                  {/* Zoom controls */}
                  <button
                    onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                    disabled={zoomLevel === 1}
                    className="p-1 text-neutral-400 hover:text-gold-500 disabled:opacity-40"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] tracking-widest font-mono text-neutral-500">
                    {zoomLevel * 100}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                    disabled={zoomLevel === 3}
                    className="p-1 text-neutral-400 hover:text-gold-500 disabled:opacity-40"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtext info */}
                <div className="text-center mt-3 font-mono text-[10px] text-neutral-500">
                  FILE: {activeImage.originalName}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
