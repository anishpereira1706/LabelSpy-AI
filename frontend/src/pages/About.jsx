import React from "react";
import { Shield, Eye, Heart, ArrowRight, CheckCircle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-primary text-dark overflow-x-hidden relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-6 py-16">
      {/* Modern dot grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0"></div>

      {/* Ambient Glow Backdrops */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-5xl w-full mx-auto relative z-10 flex-grow flex flex-col justify-center">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/5 border border-accent/15 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-dark leading-tight">
            Empowering Consumer <br />
            <span className="bg-gradient-to-r from-accent via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Health & Transparency
            </span>
          </h1>
          <p className="text-base sm:text-lg text-dark/75 leading-relaxed">
            LabelSpy.ai was built to bring absolute transparency to the products you use and consume daily. We believe everyone has the right to know exactly what is in their food and cosmetics without needing a degree in organic chemistry.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Card 1 */}
          <div className="group p-8 border border-slate-200/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:shadow-accent/[0.02] hover:border-accent/30 transition-all duration-300 flex flex-col text-left space-y-4">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Heart className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-dark text-lg">Consumer Health</h3>
            <p className="text-dark/65 text-sm leading-relaxed">
              Many daily items contain controversial additives, trans fats, or heavy sugars hidden under complex scientific aliases. We make these instantly visible.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 border border-slate-200/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:shadow-accent/[0.02] hover:border-accent/30 transition-all duration-300 flex flex-col text-left space-y-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Eye className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-dark text-lg">Instant Clarity</h3>
            <p className="text-dark/65 text-sm leading-relaxed">
              Simply paste an ingredient text or upload a label photo. Our scanner cross-references the ingredients to highlight toxic risk profiles and product dilution.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 border border-slate-200/80 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:shadow-accent/[0.02] hover:border-accent/30 transition-all duration-300 flex flex-col text-left space-y-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-dark text-lg">Verification Driven</h3>
            <p className="text-dark/65 text-sm leading-relaxed">
              No forced signups, no hidden costs. We provide a completely transparent safety scanning tool to check food adulterations, additives, and safety profiles.
            </p>
          </div>
        </div>

        {/* Informational Details Section */}
        <div className="w-full border border-slate-200/80 rounded-2xl bg-white/40 backdrop-blur-sm p-8 mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-dark flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" /> Why LabelSpy?
            </h3>
            <p className="text-sm text-dark/70 leading-relaxed">
              Modern manufacturers often use complex alternate names for controversial ingredients—such as naming MSG as "yeast extract", or trans fats as "hydrogenated oils". LabelSpy identifies these hidden aliases instantly to protect your wellness.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-dark flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" /> How does it work?
            </h3>
            <p className="text-sm text-dark/70 leading-relaxed">
              We leverage advanced OCR engines alongside precise matching systems to extract ingredients from a label photo. The extracted ingredients are then verified through our health database to flag any hazards.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-dark text-primary rounded-3xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-black">Ready to check your ingredients?</h2>
            <p className="text-primary/75 text-sm md:text-base leading-relaxed">
              Analyze your first product label today to inspect what you apply to your skin and consume in your diet.
            </p>
            <div className="pt-2">
              <Link
                to="/scanner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/95 hover:to-indigo-600/95 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/25 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer"
              >
                Start Scanning Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

