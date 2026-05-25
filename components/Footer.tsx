import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-brand-burgundy text-brand-cream py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-start mb-12">
          
          <div className="text-center md:text-left space-y-4">
            <div className="text-3xl font-display font-bold">
              Travel<span className="text-brand-gold">Mate</span>
            </div>
            <p className="text-sm font-sans font-normal opacity-70 max-w-xs mx-auto md:mx-0 leading-relaxed">
              Your intelligent companion for exploring the teardrop of the Indian Ocean.
            </p>
          </div>

          <div className="flex justify-around sm:justify-start sm:gap-16 lg:gap-24 font-medium">
            <div className="flex flex-col gap-3">
              <span className="text-brand-gold uppercase text-[10px] tracking-widest font-bold mb-1">Platform</span>
              <a href="/" className="text-sm hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-sm hover:text-white transition-colors">About Us</a>
              <a href="/contact" className="text-sm hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-brand-gold uppercase text-[10px] tracking-widest font-bold mb-1">Legal</span>
              <a href="/privacy-policy" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <div className="bg-white/5 p-6 rounded-3xl backdrop-blur-sm border border-white/10 text-center md:text-right">
              <div className="text-sm font-medium mb-1 opacity-90">Ready for your adventure?</div>
              <div className="text-xl font-display font-bold text-brand-gold">Ayubowan!</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] md:text-sm opacity-60 text-center">
          <div>© 2026 TravelMate Sri Lanka. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="italic">Designed for Travelers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}