import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-primary text-dark overflow-x-hidden relative min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Modern dot grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50 z-0"></div>

      {/* 🎬 HERO SECTION */}
      <section className="relative flex-grow flex items-center justify-center px-4 pt-20 pb-20 z-10">
        {/* Ambient Glow Backdrop */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-3xl w-full mx-auto relative flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-dark leading-[1.15]">
            Know what you consume. <br />
            <span className="bg-gradient-to-r from-accent via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scan ingredients instantly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-dark/70 leading-relaxed max-w-xl">
            LabelSpy analyzes food and cosmetic ingredient lists to instantly identify toxic hazards, hidden additives, and potential product adulteration warnings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/scanner"
              className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-dark hover:bg-dark/95 text-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-dark/10 hover:scale-[1.02] cursor-pointer"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer-sweep"></div>
              <span className="relative z-10">Start Scanner</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-slate-200/80 text-dark border border-slate-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* 🛠️ CORE FEATURES SECTION */}
      <section id="how-it-works" className="relative px-4 py-16 bg-secondary/20 border-t border-secondary/50 z-10">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-dark text-base">Hazard Detection</h3>
            <p className="text-dark/60 text-xs leading-relaxed">
              Flags harmful chemicals, preservatives, and questionable additives inside daily products.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-dark text-base">Hidden Additives</h3>
            <p className="text-dark/60 text-xs leading-relaxed">
              Unmasks trans fats, MSG, and sugars disguised behind complex or proprietary chemical names.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-dark text-base">Product Authenticity</h3>
            <p className="text-dark/60 text-xs leading-relaxed">
              Detects product dilution and fraud (like honey or olive oil cut with cheap oils or syrups).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
