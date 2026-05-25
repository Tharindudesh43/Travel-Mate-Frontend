"use client";
import React, { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import Footer from "@/components/Footer";

const images = [
  {
    src: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sri Lanka Sigiriay Rock",
  },
  {
    src: "https://images.unsplash.com/photo-1653959699604-1eb000740b57?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sri Lanka Mirissa Beach",
  },
  {
    src: "https://images.unsplash.com/photo-1704797390597-24dea42ffea8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sri Lanka Beach",
  },
  {
    src: "https://images.unsplash.com/photo-1578519050142-afb511e518de?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sri Lanka Ella Train",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Hero />
      <Features />

      <section className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-12">
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-brand-burgundy mb-6 leading-tight font-display font-bold">
                Discover the Magic of <br />
                <span className="text-brand-gold font-display">
                  The Teardrop Island
                </span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto md:mx-0">
                A teardrop island bursting with flavor, color, and wonder.
                Whether you're chasing sunsets over Sigiriya or savoring fresh
                hoppers by the coast, TravelMate turns every Sri Lankan journey
                into a story worth telling.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
                <div className="p-4 bg-brand-cream rounded-2xl border border-brand-gold/10">
                  <div className="text-2xl md:text-3xl font-bold text-brand-burgundy mb-1">
                    8+
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    UNESCO Sites
                  </div>
                </div>
                <div className="p-4 bg-brand-cream rounded-2xl border border-brand-gold/10">
                  <div className="text-2xl md:text-3xl font-bold text-brand-burgundy mb-1">
                    100+
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    Nature Parks
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-md md:max-w-none order-1 md:order-2">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 md:rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={images[current].src}
                  alt={images[current].alt}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: fade ? 1 : 0 }}
                />
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current
                        ? "bg-brand-burgundy w-4"
                        : "bg-brand-gold/40"
                    }`}
                  />
                ))}
              </div>

              <div className="hidden sm:block absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-brand-gold/20 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
