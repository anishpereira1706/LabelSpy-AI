import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, AlertTriangle } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home() {
  return (
    <div className="bg-primary text-dark overflow-x-hidden relative min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Modern dot grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50 z-0"></div>

      {/* 🎬 HERO SECTION */}
      <section className="relative flex-grow flex items-center justify-center px-4 pt-16 pb-16 z-10">
        {/* Ambient Glow Backdrops */}
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full filter blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl w-full mx-auto relative flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Hero Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 flex flex-col items-center lg:items-start max-w-2xl lg:max-w-none">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-dark leading-[1.15]">
              Know what you consume. <br />
              <span className="bg-gradient-to-r from-accent via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Scan ingredients instantly.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-dark/70 leading-relaxed max-w-xl">
              LabelSpy analyzes food and cosmetic ingredient lists to instantly identify toxic hazards, hidden additives, and potential product adulteration warnings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <Link
                to="/scanner"
                className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-dark hover:bg-dark/95 text-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-dark/15 hover:scale-[1.02] cursor-pointer"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer-sweep"></div>
                <span className="relative z-10">Start Scanner</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-accent/5 hover:bg-accent/10 text-accent border border-accent/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right Column: Lottie Animation */}
          <div className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl flex justify-center relative mt-6 lg:mt-0">
            <div className="absolute inset-0 bg-accent/5 rounded-full filter blur-3xl opacity-70 -z-10 animate-pulse-glow"></div>
            <DotLottieReact
              src="/animation.lottie"
              loop
              autoplay
              className="w-full h-auto max-h-[260px] sm:max-h-[340px] md:max-h-[460px] lg:max-h-[580px]"
            />
          </div>
        </div>
      </section>

      {/* 🛠️ CORE FEATURES SECTION */}
      <section id="how-it-works" className="relative px-4 py-16 bg-secondary/20 border-t border-secondary/50 z-10">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.03] transition-all duration-300">
            <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-dark text-sm text-left">Hazard Detection</h3>
              <p className="text-dark/65 text-xs text-left leading-relaxed">
                Flags harmful chemicals, preservatives, and questionable additives inside daily products.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.03] transition-all duration-300">
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-dark text-sm text-left">Hidden Additives</h3>
              <p className="text-dark/65 text-xs text-left leading-relaxed">
                Unmasks trans fats, MSG, and sugars disguised behind complex or proprietary chemical names.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.03] transition-all duration-300">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-dark text-sm text-left">Product Authenticity</h3>
              <p className="text-dark/65 text-xs text-left leading-relaxed">
                Detects product dilution and fraud (like honey or olive oil cut with cheap oils or syrups).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
