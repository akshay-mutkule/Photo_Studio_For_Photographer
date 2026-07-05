import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  const posts = [
    {
      id: "blog-1",
      title: "How to Choose the Perfect Outfits for Your Sunset Shoot",
      excerpt: "The ultimate guide to coordinating colors, fabrics, and movement style for dramatic, fine-art sunset portraits.",
      date: "June 28, 2026",
      readTime: "5 min read",
      cover: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "blog-2",
      title: "The Art of Natural Lighting: Behind the Scenes",
      excerpt: "A deep dive into how Aria Sterling utilizes golden hour refractions and soft shadow gradients to craft raw, emotional portraits.",
      date: "May 14, 2026",
      readTime: "8 min read",
      cover: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "blog-3",
      title: "Top 5 Secret Photoshoot Locations in Northern California",
      excerpt: "We reveal our favorite, secluded coastal cliffs and misty redwood canopies for breathtaking pre-wedding sessions.",
      date: "April 02, 2026",
      readTime: "6 min read",
      cover: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80"
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
            Our Thoughts
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-2 mb-4">
            The Journal
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`rounded-lg border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                isDark ? "bg-neutral-950 border-neutral-900 hover:border-neutral-800" : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex gap-4 text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-500" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-500" /> {post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-light hover:text-gold-500 transition-colors cursor-pointer leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <button className="text-[10px] tracking-widest uppercase font-sans font-semibold text-gold-500 hover:text-gold-400 flex items-center gap-1 transition-colors">
                  Read Article <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
