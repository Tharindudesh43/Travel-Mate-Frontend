"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Mail, Send, MessageCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ContactUs() {
  return (
    <div className="pt-32 ">
      <div className="container mx-auto px-6 pb-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-20 h-1 bg-brand-gold mb-8" />
            <h1 className="text-5xl md:text-6xl text-brand-burgundy mb-8">
              Let's Start a <br />
              <span className="text-brand-gold">Conversation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Have questions about your trip? Need technical support? 
              Or just want to share your Sri Lankan adventure with us? 
              We're here to help.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail />, label: "Email Us", info: "tharindudeshanhimahansa43@gmail.com" },
                // { icon: <Phone />, label: "Call Us", info: "+94 71 018 2874" },
                // { icon: <MapPin />, label: "Visit Us", info: "Galle Face Terrace, Colombo 03, Sri Lanka" },
                { icon: <MessageCircle />, label: "Chat", info: "Available 24/7 in-app" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition-all">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-lg font-bold text-gray-800">{item.info}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-4xl shadow-2xl border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-burgundy transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-burgundy transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-burgundy transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-burgundy transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-brand-burgundy text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-burgundy/20 transition-all flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
