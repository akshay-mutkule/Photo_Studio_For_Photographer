import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Heart, CheckSquare, Square, Download, Share2, Eye, ShieldAlert, CheckCircle2, RefreshCw, Star, Info, ZoomIn, ZoomOut, Sparkles } from "lucide-react";
import { Gallery, ImageItem } from "../types.js";

interface ClientPortalProps {
  theme: "dark" | "light";
  initialGalleryId?: string;
  onClientAuthenticated: (isAuthenticated: boolean) => void;
}

export default function ClientPortal({ theme, initialGalleryId, onClientAuthenticated }: ClientPortalProps) {
  const isDark = theme === "dark";

  // State Management
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

  // Auth Submit Handler
  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/client/gallery-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
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
    // In production, downloads the actual high-resolution S3/Cloudinary link
    // Here we'll create a synthetic anchor link to download Unsplash proxy for client experience
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
    setPasscode("");
    setSubmissionSuccess(false);
    onClientAuthenticated(false);
  };

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 min-h-[80vh] flex flex-col justify-center ${
      isDark ? "bg-black text-white" : "bg-white text-black"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ================= STAGE 1: AUTHENTICATION ACCESS GATES ================= */}
        {!gallery && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gold-950/20 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-gold-500 animate-pulse" />
              </div>
              <h2 className="font-serif text-3xl font-light mb-2">Secure Proofing Portal</h2>
              <p className={`text-xs font-sans tracking-wide ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Please enter the unique passcode provided by VS Photography to access your private shoot gallery.
              </p>
            </div>

            <div className={`p-8 rounded-xl border ${
              isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
            }`}>
              <form onSubmit={handleAuth} className="space-y-6">
                <div>
                  <label className={`block text-xs font-sans tracking-wider uppercase font-semibold mb-2 ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                    Enter Passcode
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
                  className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Unlock My Gallery</span>
                </button>
              </form>

              <div className="mt-6 text-center text-[10px] text-neutral-500">
                Contact VS Photography Support if you misplaced your passcode credentials.
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
                <span className="text-[10px] tracking-widest text-gold-500 uppercase font-mono font-semibold">
                  Secure Client Proofing Console
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light mt-1 mb-2">{gallery.title}</h2>
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
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setActiveImage(img);
                            setZoomLevel(1);
                          }}
                          className="p-2 bg-neutral-900 text-white hover:text-gold-500 border border-neutral-800 rounded transition-colors"
                          title="Full-Screen Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {gallery.allowDownload && gallery.downloadApproved && (
                          <button
                            onClick={() => handleDownloadImage(img)}
                            className="p-2 bg-neutral-900 text-white hover:text-gold-500 border border-neutral-800 rounded transition-colors"
                            title="Download Proof"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Top Action Tags */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-auto">
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
                {gallery.allowDownload && (
                  <span className={`text-[10px] font-sans px-2.5 py-1 rounded border ${
                    gallery.downloadApproved
                      ? "bg-green-950/20 border-green-500/20 text-green-400"
                      : "bg-amber-950/20 border-amber-500/20 text-amber-400"
                  }`}>
                    {gallery.downloadApproved ? "✔ Downloads Approved" : "⏳ Downloads Pending Approval"}
                  </span>
                )}
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
                  Thank you, <span className="text-gold-400">{gallery.clientName}</span>. Your chosen <span className="text-gold-400 font-bold">{gallery.selected.length}</span> images have been submitted directly to Aria Sterling for premium fine-art retouching and final preparation.
                </p>

                {gallery.allowDownload && gallery.downloadApproved ? (
                  <div className="p-4 rounded border border-green-500/20 bg-green-950/10 mb-6 text-xs text-green-400 font-sans tracking-wide">
                    🎉 Download approval has been pre-granted! You can now close this box to save and download your high-res unwatermarked originals.
                  </div>
                ) : (
                  <div className="p-4 rounded border border-neutral-800 bg-neutral-900/40 mb-6 text-xs text-neutral-400 font-sans tracking-wide">
                    We will notify you once retouching is finished. High-resolution downloads will become available as soon as post-processing completes.
                  </div>
                )}

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
                <div className="relative overflow-hidden rounded border border-neutral-900 bg-neutral-950">
                  <img
                    src={activeImage.url}
                    alt={activeImage.originalName}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-[70vh] object-contain mx-auto transition-transform duration-300"
                  />
                </div>

                {/* Lightbox actions strip */}
                <div className="flex gap-4 mt-6 items-center bg-neutral-950/90 border border-neutral-900 rounded-full px-6 py-3 backdrop-blur-sm">
                  {/* Favorite action */}
                  <button
                    onClick={() => handleToggleFavorite(activeImage.id)}
                    className={`flex items-center gap-1 text-[10px] tracking-widest uppercase font-sans ${
                      gallery.favorites.includes(activeImage.id) ? "text-red-500" : "text-neutral-400 hover:text-white"
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
                      gallery.selected.includes(activeImage.id) ? "text-gold-400" : "text-neutral-400 hover:text-white"
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

                  {gallery.allowDownload && gallery.downloadApproved && (
                    <>
                      <div className="h-4 w-px bg-neutral-800" />
                      <button
                        onClick={() => handleDownloadImage(activeImage)}
                        className="flex items-center gap-1 text-[10px] tracking-widest uppercase font-sans text-neutral-400 hover:text-gold-400"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </>
                  )}
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
