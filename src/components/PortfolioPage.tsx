import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, ZoomIn, ZoomOut, Share2, ArrowRight, Grid, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { PortfolioImage } from "../types.js";

interface PortfolioPageProps {
  theme: "dark" | "light";
}

export default function PortfolioPage({ theme }: PortfolioPageProps) {
  const isDark = theme === "dark";
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<PortfolioImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAISearch, setIsAISearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<PortfolioImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [sharingStatus, setSharingStatus] = useState<string | null>(null);

  const categories = [
    "All",
    "Weddings",
    "Pre-Wedding",
    "Engagement",
    "Portraits",
    "Family",
    "Maternity",
    "Fashion",
    "Wildlife",
    "Commercial",
  ];

  // Fetch portfolio images
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setFilteredImages(data);
      })
      .catch((err) => console.error("Failed to load portfolio:", err));
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    if (isAISearch) return; // Skip standard filter if client is executing AI Search

    let result = images;

    if (selectedCategory !== "All") {
      result = result.filter((img) => img.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(q) ||
          img.category.toLowerCase().includes(q) ||
          img.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    setFilteredImages(result);
  }, [selectedCategory, searchQuery, images, isAISearch]);

  // Execute AI Search powered by Gemini
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setIsAISearch(true);

    try {
      const response = await fetch("/api/gemini/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, type: "portfolio" }),
      });

      const data = await response.json();
      if (data.matches) {
        setFilteredImages(data.matches);
      }
    } catch (err) {
      console.error("AI Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setIsAISearch(false);
    setSelectedCategory("All");
    setFilteredImages(images);
  };

  const handleShare = (img: PortfolioImage) => {
    const url = window.location.href;
    navigator.clipboard.writeText(`${url}?image=${img.id}`);
    setSharingStatus(img.id);
    setTimeout(() => setSharingStatus(null), 3000);
  };

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
            Our Masterpieces
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            The Fine-Art Gallery
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Filter and Search Controls */}
        <div className="mb-12 space-y-6">
          {/* Search bar with AI Option */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${
              isDark ? "bg-neutral-950 border-neutral-800" : "bg-neutral-50 border-neutral-200"
            }`}>
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by keyword, color, mood, or context..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (isAISearch && e.target.value === "") {
                    setIsAISearch(false);
                  }
                }}
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-sans"
              />
              {searchQuery && (
                <button
                  onClick={resetSearch}
                  className="text-neutral-400 hover:text-gold-500 text-xs uppercase tracking-wider font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* AI Search Prompt Trigger */}
            <button
              id="ai-search-trigger-btn"
              onClick={handleAISearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-5 py-2.5 bg-gold-950/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500 hover:text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSearching ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>AI Search</span>
            </button>
          </div>

          {/* AI Search Notification */}
          {isAISearch && (
            <div className="flex items-center justify-center gap-2 text-xs text-gold-500 font-sans tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Displaying conceptual AI matches for "{searchQuery}"</span>
              <button onClick={resetSearch} className="underline text-neutral-400 hover:text-white ml-2">
                Reset to normal
              </button>
            </div>
          )}

          {/* Categories Pill Navigation */}
          <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`portfolio-cat-${cat}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsAISearch(false); // Cancel AI search upon switching categories
                }}
                className={`px-3.5 py-1.5 rounded text-[10px] tracking-widest uppercase font-sans transition-all duration-300 ${
                  selectedCategory === cat && !isAISearch
                    ? "bg-gold-500 text-black font-semibold"
                    : isDark
                    ? "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900"
                    : "bg-neutral-50 text-neutral-600 hover:text-black border border-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Masonry Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.id}
                id={`portfolio-card-${img.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-lg aspect-[4/3] cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  {/* Category Header */}
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 bg-gold-500 text-black text-[9px] tracking-widest font-sans uppercase font-semibold rounded">
                      {img.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(img);
                        }}
                        className="p-1.5 bg-black/40 border border-white/10 rounded hover:border-gold-500 transition-colors"
                        title="Copy Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5 text-neutral-300 hover:text-gold-400" />
                      </button>
                    </div>
                  </div>

                  {/* Title and Action */}
                  <div>
                    <h4 className="font-serif text-lg text-white mb-1 font-light">
                      {img.title}
                    </h4>
                    {/* Tags */}
                    <div className="flex gap-1 flex-wrap mb-4">
                      {img.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] text-neutral-400 bg-neutral-900/60 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setLightboxImage(img);
                        setZoomLevel(1);
                      }}
                      className="inline-flex items-center gap-1.5 text-gold-400 text-xs tracking-widest uppercase font-sans hover:text-gold-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Expand Artwork</span>
                    </button>
                  </div>
                </div>

                {/* Sharing toast indicator */}
                {sharingStatus === img.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-center z-10 p-4">
                    <div>
                      <p className="text-gold-400 text-xs tracking-widest uppercase font-semibold">
                        Link Copied!
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Share this specific fine-art image with friends.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <AlertCircle className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-sans tracking-wide">No artwork matches your search criteria.</p>
            <button onClick={resetSearch} className="text-gold-500 underline text-xs mt-2">
              Reset Filters
            </button>
          </div>
        )}

        {/* Fullscreen Lightbox with Zoom */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setLightboxImage(null)}
            >
              <button
                className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xs uppercase tracking-widest font-sans font-semibold border border-neutral-800 px-3 py-1.5 rounded bg-neutral-900/60"
                onClick={() => setLightboxImage(null)}
              >
                Close
              </button>

              <div
                className="relative max-w-4xl max-h-[80vh] w-full flex flex-col items-center justify-center select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Container with Dynamic Zoom */}
                <div className="relative overflow-hidden rounded-lg border border-neutral-900 bg-neutral-950/40">
                  <img
                    src={lightboxImage.url}
                    alt={lightboxImage.title}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-[70vh] object-contain mx-auto transition-transform duration-300"
                  />
                </div>

                {/* Lightbox Controls */}
                <div className="flex gap-4 mt-6 items-center bg-neutral-950/80 border border-neutral-900 rounded-full px-6 py-2.5 backdrop-blur">
                  <button
                    onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                    disabled={zoomLevel === 1}
                    className="p-1.5 text-neutral-400 hover:text-gold-500 disabled:opacity-40"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] tracking-widest font-mono text-neutral-400">
                    ZOOM: {zoomLevel * 100}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                    disabled={zoomLevel === 3}
                    className="p-1.5 text-neutral-400 hover:text-gold-500 disabled:opacity-40"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-neutral-800" />
                  <button
                    onClick={() => handleShare(lightboxImage)}
                    className="p-1.5 text-neutral-400 hover:text-gold-500 flex items-center gap-1 text-[10px] tracking-widest uppercase font-sans"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Subtext info */}
                <div className="text-center mt-3">
                  <h4 className="font-serif text-lg text-white font-light">
                    {lightboxImage.title}
                  </h4>
                  <p className="text-gold-400 text-[10px] tracking-widest uppercase font-sans mt-0.5">
                    {lightboxImage.category} Collection
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
