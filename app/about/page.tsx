"use client";
import React from "react";
import { motion } from "motion/react";
import { Target, Heart, Award } from "lucide-react";
import SrilankanCulture from "@/assests/Srilankan_culture_01.jpg";
import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <div className="pt-32">
      <div className="container mx-auto px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-20"
        >
          <div className="w-20 h-1 bg-brand-gold mb-8" />
          <h1 className="text-5xl md:text-6xl text-brand-burgundy mb-8">
            Empowering Your <br />
            <span className="text-brand-gold">Sri Lankan Odyssey</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            TravelMate is designed to make travel easier and more enjoyable by 
            combining smart technology with real world insights. It helps users 
            discover new places, plan better trips, and experience destinations 
            in a more convenient and meaningful way.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: <Target />,
              title: "Mission",
              desc: "To make Sri Lanka the most accessible and enjoyable travel destination in the world through smart AI integration.",
            },
            {
              icon: <Heart />,
              title: "Passion",
              desc: "We love this island. Every recommendation is crafted with local knowledge and genuine care for your journey.",
            },
            {
              icon: <Award />,
              title: "Standard",
              desc: "Precision, safety, and authenticity are at the core of every answer our AI provides.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="w-14 h-14 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-burgundy mb-6">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: "w-7 h-7",
                })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-4xl overflow-hidden shadow-2xl">
            <img
              src={SrilankanCulture.src}
              alt="Sri Lanka Culture"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <h2 className="text-4xl text-brand-burgundy mb-6">
              Local Knowledge, Powered by AI
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              TravelMate is shaped by real experiences of navigating Sri Lanka’s roads, markets, 
              and coastlines, turning local understanding into thoughtful travel 
              recommendations.
            </p>
            <p className="text-gray-600 leading-relaxed">
             Advanced AI combined with local insights creates a 
             smarter way to explore Sri Lanka beyond the usual tourist routes.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
