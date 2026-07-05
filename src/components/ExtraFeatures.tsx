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
      a: "Once your photoshoot session concludes, we import the raw proofs and create an encrypted private gallery passcode. You will log in securely, star your favorite captures, and select which items you would like us to apply our final signature fine-art edits on. Once submitted, we will begin detailed post-processing."
    },
    {
      q: "When will I receive my finished photos?",
      a: "For weddings, we deliver a curated 'sneak peek' within 48 hours, and your full completed gallery within 4 to 6 weeks. Portraits and lifestyle edits are delivered within 5 to 7 days."
    },
    {
      q: "Do you travel for international photoshoots?",
      a: "Absolutely! Lumina operates worldwide. Whether you are planning an intimate elopement in Paris or an editorial lookbook campaign in Tokyo, we provide custom travel packages."
    },
    {
      q: "What is your high-end retouching philosophy?",
      a: "We believe in authentic beauty. Our signature grading focuses on balanced lighting, elegant color contrasts, and subtle, natural skin smoothing. We never apply heavy, artificial plastic-looking filters."
    }
  ];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const instagramPosts = [
    { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80", likes: 245, comments: 18 },
    { id: 2, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80", likes: 189, comments: 12 },
    { id: 3, url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80", likes: 312, comments: 24 },
    { id: 4, url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80", likes: 421, comments: 35 }
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
                  The Lumina Dispatch
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light mt-2">Subscribe to our newsletter</h3>
                <p className="text-xs text-neutral-400 font-light mt-2 max-w-md mx-auto leading-relaxed">
                  Join our inner circle for exclusive seasonal travel alerts, styling masterclasses, and photography workshop discounts.
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
              <h4 className="font-serif text-xl font-light">Welcome to the Inner Circle</h4>
              <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">
                You have successfully subscribed to the Lumina Dispatch newsletter. Keep an eye out for our upcoming luxury lookbook.
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
            <h3 className="font-serif text-xl sm:text-2xl font-light mt-1 flex items-center justify-center gap-1.5">
              <Instagram className="w-4.5 h-4.5 text-gold-500" /> Follow us @LuminaFineArt
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 group"
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
