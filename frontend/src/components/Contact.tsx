"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SectionDivider } from "./SectionDivider.js";
import { useToast } from "../context/ToastContext.js";

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast("Please fill in all fields", "error");
      return;
    }
    addToast("Thank you! Your message has been sent to our Atelier concierges.", "success");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-[#fff8fb] dark:bg-[#090e1b] transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <SectionDivider
          title="Contact Atelier Concierge"
          subtitle="Speak with our fragrance specialists for bespoke advice and orders."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <div className="space-y-6 lg:col-span-1 bg-white dark:bg-[#0e1728] p-6 rounded-2xl border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-cinzel text-xs font-bold uppercase text-gray-500">Email Us</p>
                <p className="font-inter text-sm font-semibold text-gray-800 dark:text-gray-200">concierge@susanperfume.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-cinzel text-xs font-bold uppercase text-gray-500">Call Concierge</p>
                <p className="font-inter text-sm font-semibold text-gray-800 dark:text-gray-200">+1 (800) 555-SUSAN</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-cinzel text-xs font-bold uppercase text-gray-500">Flagship Atelier</p>
                <p className="font-inter text-sm font-semibold text-gray-800 dark:text-gray-200">740 Fifth Avenue, New York, NY</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4 bg-white dark:bg-[#0e1728] p-8 rounded-2xl border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-[#fff8fb] dark:bg-[#141d2f] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#fff8fb] dark:bg-[#141d2f] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Your Inquiry
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How may our concierges assist you today?"
                className="w-full px-4 py-3 rounded-xl bg-[#fff8fb] dark:bg-[#141d2f] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
