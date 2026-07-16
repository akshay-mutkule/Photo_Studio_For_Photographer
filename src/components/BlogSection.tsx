import { useState } from "react";
import { Calendar, Clock, ArrowRight, X, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  cover: string;
  subtitle: string;
  paragraphs: {
    heading?: string;
    text: string;
  }[];
}

export default function BlogSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const posts: BlogPost[] = [
    {
      id: "blog-1",
      title: "How to Choose the Perfect Outfits for Your Sunset Shoot",
      subtitle: "A professional guide to coordinating fabrics, colors, and textures for the ultimate golden hour aesthetic.",
      excerpt: "Our simple guide to choosing the best colors, clothes, and styles for your sunset photo shoot.",
      date: "June 28, 2026",
      readTime: "5 min read",
      cover: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      paragraphs: [
        {
          text: "Planning a sunset photoshoot is an exciting journey, but one of the most common questions clients ask is: 'What should we wear?' The right outfit doesn’t just complement the background; it elevates the entire visual narrative. Here are the principal styling rules from my years behind the lens:"
        },
        {
          heading: "1. Embrace Earthy & Warm Neutrals",
          text: "During golden hour, the sun bathes everything in warm, orange, and amber tones. Outfits in earthy shades—such as terracotta, sage green, cream, beige, mustard, or soft rust—blend seamlessly into nature. Avoid bright neon colors or extremely dark, heavy blacks unless you are specifically aiming for a high-contrast silhouette."
        },
        {
          heading: "2. Flowing Fabrics Create Magic",
          text: "Movement is the secret ingredient to raw, emotional imagery. I highly recommend dresses or skirts made of lightweight, flowing materials like chiffon, silk, or soft linen. As the evening breeze picks up, these fabrics catch the wind, creating a beautiful sense of motion and grace in your photos."
        },
        {
          heading: "3. Textures Over Loud Patterns",
          text: "Loud, busy patterns or graphic t-shirts draw attention away from your facial expressions and the raw emotion of the moment. Instead, bring depth to your outfit through rich textures. Think lace details, knit sweaters, linen shirts, or subtle embroidery. Textures react beautifully with directional sunset light, catching shadows and highlights exquisitely."
        },
        {
          heading: "4. Coordinate, Don’t Match",
          text: "Gone are the days of everyone wearing identical white shirts and blue jeans. Modern aesthetics focus on coordination. Choose a cohesive color palette of 3 to 4 complementary tones and distribute them across your outfits. This looks natural, deliberate, and high-fashion."
        },
        {
          heading: "5. Prioritize Comfort and Footwear",
          text: "A sunset shoot often involves walking through meadows, climbing gentle coastal slopes, or walking along sandy beaches. Wear footwear that is both stylish and practical—leather boots, elegant flats, or sturdy wedges are perfect. If you want to wear high heels, bring a comfortable pair of slip-ons to walk between locations!"
        }
      ]
    },
    {
      id: "blog-2",
      title: "The Art of Natural Lighting: Behind the Scenes",
      subtitle: "Understanding the science of shadows, highlights, and golden hour positioning.",
      excerpt: "Learn how Vinayak Sable uses soft golden hour lighting and natural shadows to take beautiful, emotional photos.",
      date: "May 14, 2026",
      readTime: "8 min read",
      cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      paragraphs: [
        {
          text: "To a photographer, light is not merely a tool—it is the paint with which we compose stories. While artificial flash has its place, nothing can replicate the emotional depth and organic warmth of natural sunlight. Today, I invite you behind the scenes to explore how we harness natural light to make time stand still."
        },
        {
          heading: "1. The Myth of the Midday Sun",
          text: "Many beginners believe that a bright, sunny afternoon is the ideal time for photos. In reality, the high-noon sun is a photographer’s greatest challenge. It creates harsh, unflattering shadows under the eyes and nose, washes out skin tones, and squinting subjects. We almost always schedule our sessions during the sweet spots: the Golden Hour and the Blue Hour."
        },
        {
          heading: "2. The Majesty of Golden Hour",
          text: "Golden Hour occurs during the final sixty minutes before the sun dips below the horizon. The sun is low in the sky, meaning its rays travel through more atmosphere, scattering blue light and leaving behind a soft, warm, amber glow. During this window, we utilize backlighting (rim lighting) to illuminate hair and clothing outlines, side lighting to add depth, and front lighting to bathe subjects in exceptionally soft warmth."
        },
        {
          heading: "3. Navigating the Diffused Skies",
          text: "Do not fear overcast days! Cloud cover acts as a giant, natural softbox, scattering sunlight evenly in all directions. This creates an incredibly flattering, low-contrast environment perfect for raw, close-up editorial portraits."
        },
        {
          heading: "4. Keeping the Gear Lightweight",
          text: "By mastering natural light, we eliminate the need for bulky flashes, heavy light stands, and artificial softboxes. This keeps our sessions feeling like a relaxed walk in nature rather than a stressful commercial set. It allows you to focus purely on your partner, your family, and your authentic feelings."
        }
      ]
    },
    {
      id: "blog-3",
      title: "Top 5 Secret Photoshoot Locations in Maharashtra",
      subtitle: "Handpicked, breathtaking backdrops for couples seeking cinematic romance.",
      excerpt: "We share our favorite coastal cliffs and quiet green hills for beautiful pre-wedding photo shoots.",
      date: "April 02, 2026",
      readTime: "6 min read",
      cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      paragraphs: [
        {
          text: "Every couple deserves a backdrop that matches the epic scale of their love story. Maharashtra is blessed with some of the most diverse, dramatic, and poetic landscapes in India. Here are five of my absolute favorite, handpicked photoshoot locations:"
        },
        {
          heading: "1. Kaas Plateau (Satara)",
          text: "Known as Maharashtra's Valley of Flowers, the Kaas Plateau in Satara is a UNESCO World Natural Heritage site. For a few weeks after the monsoons, this volcanic plateau bursts into an incredible carpet of wild, multicolored blooms. It is an ethereal, fairytale-like backdrop that yields romantic, dreamy pre-wedding and maternity portraits."
        },
        {
          heading: "2. Bhandardara Lake & Sandhan Valley",
          text: "Nestled near the Sahyadris, the pristine Arthur Lake of Bhandardara and the dramatic gorges of Sandhan Valley offer stunning wilderness backdrops. The deep rock ravines, towering cliffs, and tranquil lakeside waters reflecting misty blue mountain peaks provide an epic, adventurous backdrop for cinematic couple portraits."
        },
        {
          heading: "3. Matheran Canopy Forests",
          text: "As Asia’s only automobile-free hill station, Matheran is a quiet sanctuary of deep red laterite pathways, ancient trees, and dense forest canopies. The soft sunlight filtering through giant, green evergreen leaves onto couples walking down the historic paths creates a beautifully nostalgic and vintage-inspired romance narrative."
        },
        {
          heading: "4. Mahabaleshwar Kate's Point Clifftops",
          text: "With views dropping thousands of feet into the lush, green valleys of Panchgani, the clifftops at Kate's Point and Needle Hole offer absolute panoramic grandeur. Surrounded by strawberry fields, mist, and sunset horizons, standing above the clouds creates a stunning, high-altitude editorial mood."
        },
        {
          heading: "5. Harihareshwar Coastal Cliffs",
          text: "Where the black sands and dramatic volcanic rock formations of the Konkan coast meet the raw wave energy of the Arabian Sea. Harihareshwar's secluded, rugged coastal cliffs offer powerful, moody, and deeply romantic backgrounds, especially during twilight when silhouettes are cast against the golden waves."
        }
      ]
    }
  ];

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 border-t ${
      isDark ? "bg-black text-white border-neutral-900" : "bg-white text-black border-neutral-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
            Our Journal
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            Latest Articles
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className={`rounded-lg border overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer group ${
                isDark ? "bg-neutral-950 border-neutral-900 hover:border-gold-500/30" : "bg-neutral-50 border-neutral-200 hover:border-gold-500/30"
              }`}
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex gap-4 text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-500" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-500" /> {post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-light group-hover:text-gold-500 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className={`text-xs font-light leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {post.excerpt}
                  </p>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePost(post);
                  }}
                  className="text-[10px] tracking-widest uppercase font-sans font-semibold text-gold-500 group-hover:text-gold-400 flex items-center gap-1 transition-colors"
                >
                  Read More <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Interactive Article Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative w-full max-w-3xl rounded-xl shadow-2xl border overflow-hidden my-8 max-h-[90vh] flex flex-col ${
                isDark ? "bg-neutral-950 border-neutral-800 text-neutral-300" : "bg-white border-neutral-200 text-neutral-800"
              }`}
            >
              {/* Sticky Modal Header with Close Button */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                isDark ? "border-neutral-900 bg-neutral-950" : "border-neutral-100 bg-neutral-50"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] tracking-widest font-sans uppercase font-bold bg-gold-500 text-black rounded">
                    Fine Art Journal
                  </span>
                </div>
                <button
                  onClick={() => setActivePost(null)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isDark ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                  }`}
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="space-y-3">
                  <div className="flex gap-4 text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-500" /> {activePost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-500" /> {activePost.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold-500" /> By Vinayak Sable
                    </span>
                  </div>
                  <h1 className={`font-serif text-2xl sm:text-4xl font-light leading-tight ${
                    isDark ? "text-white" : "text-black"
                  }`}>
                    {activePost.title}
                  </h1>
                  <p className="text-sm font-sans font-medium text-gold-500 italic">
                    {activePost.subtitle}
                  </p>
                </div>

                {/* Banner Image */}
                <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                  <img
                    src={activePost.cover}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Main Article Copy */}
                <div className="space-y-6 font-sans leading-relaxed text-sm sm:text-base font-light">
                  {activePost.paragraphs.map((p, index) => (
                    <div key={index} className="space-y-2">
                      {p.heading && (
                        <h4 className={`font-serif text-lg sm:text-xl font-medium mt-6 ${
                          isDark ? "text-white" : "text-black"
                        }`}>
                          {p.heading}
                        </h4>
                      )}
                      <p className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                        {p.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Aesthetic Closing Divider */}
                <div className="py-4 text-center">
                  <div className="w-16 h-0.5 bg-gold-500/30 mx-auto rounded"></div>
                </div>

                {/* Dynamic Author Signature / Bio Block - PERFECTLY matching requested format */}
                <div className={`border-t pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-6 ${
                  isDark ? "border-neutral-900" : "border-neutral-100"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500 bg-neutral-950">
                      <img
                        src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80"
                        alt="Vinayak Sable"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] tracking-widest text-gold-500 uppercase font-mono block mb-0.5">
                        Author of Article
                      </span>
                      <h5 className={`font-serif text-base font-semibold leading-none ${
                        isDark ? "text-white" : "text-black"
                      }`}>
                        Vinayak Sable
                      </h5>
                      <p className={`text-xs mt-1 ${
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      }`}>
                        Bespoke Fine-Art & Wedding Photographer
                      </p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right font-mono text-[10px] tracking-widest uppercase">
                    <p className={isDark ? "text-neutral-500" : "text-neutral-400"}>
                      VS Photography © 2026
                    </p>
                    <p className="text-gold-500 font-semibold mt-0.5">
                      ASHTI, INDIA
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
