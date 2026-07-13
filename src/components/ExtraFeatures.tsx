import React, { useState, FormEvent } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, Instagram, Heart, MessageCircle } from "lucide-react";

export default function ExtraFeatures({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  // FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Newsletter states
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const faqs = [
    {
      q: "How does the client portal and photo selection work?",
      a: "After your shoot, we will send you a secure link and a passcode. You can log in, choose your favorite photos, and tell us which ones you want us to edit. Once you submit, we will start working on them."
    },
    {
      q: "When will I receive my finished photos?",
      a: "For weddings, we will send you some preview photos within 48 hours, and the full gallery in 4 to 6 weeks. Portraits are ready in 5 to 7 days."
    },
    {
      q: "Do you travel for international shoots?",
      a: "Yes, we travel all over the world. We can create a custom travel package for your photo shoot anywhere."
    },
    {
      q: "What is your photo editing style?",
      a: "We believe in natural beauty. We focus on soft, clean lighting, gentle color adjustments, and smooth skin tones. We never make your photos look artificial."
    }
  ];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const instagramPosts = [
    { id: 1, url: "/images/portfolio-wedding-1.jpg", likes: 245, comments: 18 },
    { id: 2, url: "/images/portfolio-wedding-2.jpg", likes: 189, comments: 12 },
    { id: 3, url: "/images/portfolio-pre-wedding.jpg", likes: 312, comments: 24 },
    { id: 4, url: "/images/portfolio-engagement.jpg", likes: 421, comments: 35 }
  ];

  return (
    <div className={`py-12 sm:py-20 transition-colors duration-300 border-t ${
      isDark ? "bg-black text-white border-neutral-900" : "bg-white text-black border-neutral-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* 1. FAQ Accordion Grid */}
        <div>
          <div className="text-center mb-12">
            <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
              Curious minds
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-light mt-1">Frequently Asked Questions</h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  isDark ? "border-neutral-900 bg-neutral-950" : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left p-5 flex justify-between items-center text-sm font-sans font-medium hover:text-gold-500 transition-colors"
                >
                  <span className="flex gap-2 items-center">
                    <HelpCircle className="w-4.5 h-4.5 text-gold-500" />
                    {faq.q}
                  </span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaq === index && (
                  <div className="p-5 border-t border-neutral-900/40 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Newsletter Subscription */}
        <div className={`p-8 sm:p-12 rounded-xl border max-w-4xl mx-auto text-center ${
          isDark ? "bg-neutral-950 border-neutral-900" : "bg-neutral-50 border-neutral-200"
        }`}>
          {!subscribed ? (
            <div className="space-y-6">
              <div>
                <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
                  Newsletter
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light mt-2">Subscribe to our newsletter</h3>
                <p className="text-xs text-neutral-400 font-light mt-2 max-w-md mx-auto leading-relaxed">
                  Join our list for travel schedules, styling tips, and special offers.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 text-sm font-sans px-4 py-3 border rounded outline-none transition-colors ${
                    isDark
                      ? "bg-black border-neutral-800 text-white focus:border-gold-500"
                      : "bg-white border-neutral-200 text-black focus:border-gold-500"
                  }`}
                />
                <button
                  id="newsletter-subscribe-btn"
                  type="submit"
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black font-sans text-xs tracking-widest uppercase font-semibold transition-all rounded flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-gold-500 mx-auto" />
              <h4 className="font-serif text-xl font-light">Thank You for Subscribing</h4>
              <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">
                You have successfully joined our newsletter. We will send you updates and special offers soon.
              </p>
            </div>
          )}
        </div>

        {/* 3. Instagram Feed mockup Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs tracking-widest text-gold-500 uppercase font-sans">
              Behind the lens
            </span>
            <a
              href="https://www.instagram.com/vinayak_sable_photographey?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-serif text-xl sm:text-2xl font-light mt-1 text-neutral-200 hover:text-gold-500 transition-colors group cursor-pointer"
            >
              <Instagram className="w-5 h-5 text-gold-500 group-hover:scale-110 transition-transform" />
              <span>Follow us @vinayak_sable_photographey</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/vinayak_sable_photographey?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 group block cursor-pointer"
              >
                <img
                  src={post.url}
                  alt="Instagram feed"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current text-red-500" />
                    <span className="font-mono">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-current text-neutral-300" />
                    <span className="font-mono">{post.comments}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
