import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Database, Activity, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-primary text-dark overflow-x-hidden">
      
      {/* 🎬 SECTION 1: HERO VIEWPORT */}
      <section className="relative min-h-0 lg:min-h-[calc(100vh-4rem)] flex items-start justify-center px-4 pt-8 md:pt-16 pb-12 overflow-hidden border-b border-secondary">
        
        {/* 🌌 Ambient Glow Backdrop for Section 1 */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
          
          {/* Banner Tag */}
          <div className="inline-flex items-center gap-2 bg-secondary border border-accent/30 px-4 py-1.5 rounded-full text-xs font-semibold text-dark/80 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '4s' }} />
            <span>Powered by LabelSpy Engine v2.0</span>
          </div>

          {/* Centered Hero Content */}
          <div className="max-w-4xl text-center space-y-6 mt-8 mb-12 flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-dark leading-tight">
              Ingredient Safety <br />
              <span className="text-accent bg-gradient-to-r from-accent to-dark bg-clip-text text-transparent">
                Intelligence.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-dark/70 max-w-2xl mx-auto leading-relaxed">
              Analyze product labels instantly. Our enterprise-grade engine detects
              potential hazards, controversial additives, and hidden toxins in everyday
              foods and cosmetics using semantic RAG database search.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto">
              <Link
                to="/scanner"
                className="w-full sm:w-auto px-8 py-4 bg-dark hover:bg-dark/90 text-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-dark/15 hover:scale-[1.02]"
              >
                Start Scanning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-accent/20 text-dark border border-accent/40 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                Explore Features
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 🚀 SECTION 2: FEATURES & ANALYTICS VIEWPORT */}
      <section id="features" className="relative min-h-0 lg:min-h-screen flex items-center justify-center px-4 py-16 bg-secondary/15 overflow-hidden">
        
        {/* Glow backdrop for Section 2 */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center space-y-16">
          
          <div className="text-center max-w-xl space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight">Enterprise Infrastructure</h2>
            <p className="text-sm text-dark/60">Built on modern vector search indexes and safety datasets for high-fidelity compliance reports.</p>
          </div>

          {/* Statistics Banner */}
          <div className="w-full bg-primary border border-secondary rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-dark">15,000+</div>
              <div className="text-xs text-dark/50 font-bold uppercase tracking-wider mt-1">Chemicals Indexed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-accent">99.8%</div>
              <div className="text-xs text-dark/50 font-bold uppercase tracking-wider mt-1">OCR Parser Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-dark">Instant</div>
              <div className="text-xs text-dark/50 font-bold uppercase tracking-wider mt-1">Vector Search</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-accent">24 / 7</div>
              <div className="text-xs text-dark/50 font-bold uppercase tracking-wider mt-1">AI Safety Support</div>
            </div>
          </div>

          {/* Feature Pillars Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 border border-secondary/80 rounded-2xl bg-primary/70 hover:bg-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-secondary rounded-xl border border-accent/40 flex items-center justify-center mb-5 shadow-sm">
                <Shield className="w-5 h-5 text-dark" />
              </div>
              <h3 className="font-bold text-dark text-lg mb-2">Automated Hazard Detection</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                Instantly flags severe toxins, moderate additives, and unknown chemicals using our curated index.
              </p>
            </div>

            <div className="p-8 border border-secondary/80 rounded-2xl bg-primary/70 hover:bg-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-secondary rounded-xl border border-accent/40 flex items-center justify-center mb-5 shadow-sm">
                <Database className="w-5 h-5 text-dark" />
              </div>
              <h3 className="font-bold text-dark text-lg mb-2">Vector Search Database</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                Powered by Pinecone RAG architecture to fetch accurate, up-to-date ingredient profiles.
              </p>
            </div>

            <div className="p-8 border border-secondary/80 rounded-2xl bg-primary/70 hover:bg-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-secondary rounded-xl border border-accent/40 flex items-center justify-center mb-5 shadow-sm">
                <Activity className="w-5 h-5 text-dark" />
              </div>
              <h3 className="font-bold text-dark text-lg mb-2">AI Expert Assistant</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                Chat interactively with our specialized AI model to get deeper context on any scanned label.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
