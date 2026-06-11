import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Database, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-primary px-4">
      <div className="max-w-4xl text-center space-y-8 mt-12 mb-20">
        <div className="inline-flex items-center gap-2 bg-secondary border border-accent/30 px-4 py-1.5 rounded-full text-xs font-semibold text-dark/80 mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,132,137,0.8)]"></span>
          Powered by LabelSpy Engine v2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark leading-tight">
          Ingredient Safety <br />
          <span className="text-accent drop-shadow-sm">Intelligence.</span>
        </h1>

        <p className="text-lg md:text-xl text-dark/70 max-w-2xl mx-auto leading-relaxed">
          Analyze product labels instantly. Our enterprise-grade engine detects
          potential hazards, controversial additives, and hidden toxins in everyday
          foods and cosmetics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            to="/scanner"
            className="w-full sm:w-auto px-8 py-4 bg-dark hover:bg-dark/90 text-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-dark/10 hover:shadow-dark/20"
          >
            Start Scanning
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/database"
            className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-accent/30 text-dark border border-accent/50 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            View Database
          </Link>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="p-6 border border-accent/30 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors shadow-sm">
          <div className="w-12 h-12 bg-primary rounded-xl border border-accent/50 flex items-center justify-center mb-4 shadow-sm">
            <Shield className="w-6 h-6 text-dark" />
          </div>
          <h3 className="font-bold text-dark text-lg mb-2">Automated Hazard Detection</h3>
          <p className="text-dark/70 text-sm leading-relaxed">
            Instantly flags severe toxins, moderate additives, and unknown chemicals using our curated index.
          </p>
        </div>
        <div className="p-6 border border-accent/30 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors shadow-sm">
          <div className="w-12 h-12 bg-primary rounded-xl border border-accent/50 flex items-center justify-center mb-4 shadow-sm">
            <Database className="w-6 h-6 text-dark" />
          </div>
          <h3 className="font-bold text-dark text-lg mb-2">Vector Search Database</h3>
          <p className="text-dark/70 text-sm leading-relaxed">
            Powered by Pinecone RAG architecture to fetch accurate, up-to-date ingredient profiles.
          </p>
        </div>
        <div className="p-6 border border-accent/30 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors shadow-sm">
          <div className="w-12 h-12 bg-primary rounded-xl border border-accent/50 flex items-center justify-center mb-4 shadow-sm">
            <Activity className="w-6 h-6 text-dark" />
          </div>
          <h3 className="font-bold text-dark text-lg mb-2">AI Expert Assistant</h3>
          <p className="text-dark/70 text-sm leading-relaxed">
            Chat interactively with our specialized AI model to get deeper context on any scanned label.
          </p>
        </div>
      </div>
    </div>
  );
}
