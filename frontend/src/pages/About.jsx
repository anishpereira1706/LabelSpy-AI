import React from "react";
import { Shield, Eye, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] bg-primary px-4 py-16">
      
      {/* Header Section */}
      <div className="max-w-3xl text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-dark">
          About <span className="text-accent drop-shadow-sm">LabelSpy</span>
        </h1>
        <p className="text-base sm:text-lg text-dark/70 leading-relaxed">
          LabelSpy was built to bring absolute transparency to the products you use and consume daily. We believe everyone has the right to know exactly what is in their food and cosmetics without needing a degree in chemistry.
        </p>
      </div>

      {/* Grid Features */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-6 border border-secondary rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-dark text-base">Consumer Health</h3>
          <p className="text-dark/65 text-xs leading-relaxed">
            Many daily items contain controversial additives, trans fats, or heavy sugars hidden under complex scientific aliases. We make these instantly visible.
          </p>
        </div>

        <div className="p-6 border border-secondary rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-dark text-base">Instant Clarity</h3>
          <p className="text-dark/65 text-xs leading-relaxed">
            Simply paste an ingredient text or upload a label photo. Our scanner cross-references the ingredients to highlight toxic risk profiles and product dilution.
          </p>
        </div>

        <div className="p-6 border border-secondary rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-dark text-base">Privacy Focused</h3>
          <p className="text-dark/65 text-xs leading-relaxed">
            No forced sign-ups, no user tracking, and no credits system. We provide completely free, public safety scanning tools.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-4xl bg-dark text-primary rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Ready to check your ingredients?</h2>
        <p className="text-primary/75 mb-6 max-w-md mx-auto relative z-10 text-sm">
          Run your first label analysis today and inspect what you eat and apply.
        </p>
        <Link
          to="/scanner"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-primary font-bold rounded-xl transition-transform hover:scale-105 shadow-md shadow-accent/20 relative z-10 cursor-pointer"
        >
          Open Scanner <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
