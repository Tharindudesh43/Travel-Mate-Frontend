"use client";
import React from "react";
import { motion } from "framer-motion"; 
import { MessageSquare, Map } from "lucide-react";
import { Logo } from "./Logo";
import LandscapImage from "@/assests/input_file_0.png";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[110vh] flex items-center pt-20 lg:pt-10 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-right sm:bg-center transition-transform duration-1000"
        style={{
          backgroundImage: `url("${LandscapImage.src}")`,
          opacity: 1,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/90 via-brand-cream/80 to-brand-cream/40 md:bg-gradient-to-r md:from-brand-cream md:via-brand-cream/80 md:to-transparent z-1" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-center md:text-left" 
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-brand-burgundy font-display font-bold leading-[1.15] md:leading-[1.1] mb-6">
            Your Journey in <br className="hidden sm:block" />
            <span className="text-brand-gold">Sri Lanka,</span>{" "}
            <br className="hidden sm:block" />
            Made Easy.
          </h1>
          <div className="w-16 md:w-20 h-1 bg-brand-gold mb-6 md:mb-8 mx-auto md:mx-0" />

          <p className="text-base sm:text-lg text-gray-700 mb-8 md:mb-10 leading-relaxed max-w-md mx-auto md:mx-0">
            TravelMate is your AI travel companion for Sri Lanka. Get instant
            answers, travel tips, local insights, and help whenever you need it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
            onClick={() => {window.location.href = "/chat";}}
            className="flex items-center cursor-pointer justify-center gap-2 bg-brand-burgundy text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-xl">
              <MessageSquare className="w-5 h-5" />
              Chat now
            </button>
            <button className="flex items-center cursor-pointer justify-center gap-2 bg-white/80 backdrop-blur-sm text-brand-burgundy border-2 border-brand-gold/30 px-8 py-4 rounded-xl font-semibold hover:border-brand-gold transition-all">
              <Map className="w-5 h-5 text-brand-gold" />
              Explore Map
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex justify-center items-center"
        >
          <div className="relative">
            <div className="absolute -inset-10 bg-brand-gold/10 rounded-full blur-3xl animate-pulse" />
            <Logo className="scale-[1.5] lg:scale-[3]" showText={true} />
          </div>
        </motion.div>
      </div>
      <div className="hidden sm:block absolute top-1/4 right-10 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -z-10" />
      <div className="hidden sm:block absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-burgundy/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
