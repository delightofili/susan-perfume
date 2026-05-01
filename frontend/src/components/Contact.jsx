import { useState } from "react";
import GoldDividerDot from "../components/GoldDividerDot";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = `Hello Susan,%0A%0AMy name is ${form.name}.%0AEmail: ${form.email}%0A%0A${form.message}`;

    window.open(`https://wa.me/2349066188842?text=${text}`, "_blank");
  };

  return (
    <section className="min-h-screen w-full relative pb-20">
      {/* Background */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]" />
      <div className="absolute inset-0 opacity-100 dark:opacity-0 bg-[radial-gradient(ellipse_at_top_right,#f8c8da_0%,#fdf0f5_45%,#fff8f0_100%)]" />

      <div className="relative z-40 max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-playfair text-[#1a0a10] dark:text-[#f5e6a8] mb-4">
            Contact Concierge
          </h1>

          <GoldDividerDot />

          <p className="text-[#1a0a10]/50 dark:text-warm-cream/50 font-inter text-sm mt-4 max-w-md">
            Have a question, custom request, or need assistance with your order?
            Our luxury concierge is here to assist you.
          </p>
        </div>

        {/* Contact Card */}
        <div className="rounded-2xl border border-[#c9a84c]/20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 shadow-xl flex flex-col gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-inter text-[#1a0a10]/50 dark:text-warm-cream/50">
                Your Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="px-4 py-3 rounded-xl text-sm font-inter bg-white/50 dark:bg-black/30 border border-[#c9a84c]/20 text-[#1a0a10] dark:text-[#f5e6a8] outline-none focus:border-[#c9a84c]/60 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-inter text-[#1a0a10]/50 dark:text-warm-cream/50">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="px-4 py-3 rounded-xl text-sm font-inter bg-white/50 dark:bg-black/30 border border-[#c9a84c]/20 text-[#1a0a10] dark:text-[#f5e6a8] outline-none focus:border-[#c9a84c]/60 transition-all"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-inter text-[#1a0a10]/50 dark:text-warm-cream/50">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Tell us how we can assist you..."
                className="px-4 py-3 rounded-xl text-sm font-inter bg-white/50 dark:bg-black/30 border border-[#c9a84c]/20 text-[#1a0a10] dark:text-[#f5e6a8] outline-none focus:border-[#c9a84c]/60 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 py-4 font-cinzel text-xs tracking-[3px] uppercase bg-[image:--luxury-gold-gradient] text-[#1a0a10] font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gold/20"
            >
              Send Message
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#c9a84c]/20" />
            <span className="text-[10px] text-[#c9a84c]/50 font-inter tracking-widest">
              OR
            </span>
            <div className="flex-1 h-[1px] bg-[#c9a84c]/20" />
          </div>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/2349066188842"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-600 dark:text-green-400 font-inter text-xs tracking-widest uppercase hover:bg-green-500/10 transition-all"
          >
            <span className="text-lg">💬</span>
            Chat Susan on WhatsApp
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#1a0a10]/30 dark:text-warm-cream/30 mt-8 font-inter">
          Response time is usually within a few minutes during business hours.
        </p>
      </div>
    </section>
  );
}

export default Contact;
