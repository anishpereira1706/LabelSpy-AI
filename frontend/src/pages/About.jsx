import React from "react";
import { Shield, Server, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] bg-primary px-4 py-16">
      
      {/* Header Section */}
      <div className="max-w-3xl text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-dark">
          Empowering Consumer <span className="text-accent drop-shadow-sm">Safety</span>
        </h1>
        <p className="text-lg md:text-xl text-dark/70 leading-relaxed">
          LabelSpy is a cutting-edge SaaS intelligence platform. We leverage vector embeddings and advanced AI models to decode complex chemical compositions in everyday products, bringing transparency to your health.
        </p>
      </div>

      {/* Grid Features */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 border border-secondary rounded-3xl bg-secondary/30 hover:bg-secondary/60 transition-colors shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl border border-accent/50 flex items-center justify-center mb-6 shadow-sm">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-bold text-dark text-xl mb-3">Uncompromising Safety</h3>
          <p className="text-dark/70 leading-relaxed">
            We hold ourselves to the highest standards. Our database flags hidden toxins and moderate additives with enterprise-grade accuracy.
          </p>
        </div>

        <div className="p-8 border border-secondary rounded-3xl bg-secondary/30 hover:bg-secondary/60 transition-colors shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl border border-accent/50 flex items-center justify-center mb-6 shadow-sm">
            <Server className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-bold text-dark text-xl mb-3">RAG Architecture</h3>
          <p className="text-dark/70 leading-relaxed">
            By utilizing Pinecone Vector search, LabelSpy queries massive data sets in milliseconds to deliver instant, reliable reports.
          </p>
        </div>

        <div className="p-8 border border-secondary rounded-3xl bg-secondary/30 hover:bg-secondary/60 transition-colors shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl border border-accent/50 flex items-center justify-center mb-6 shadow-sm">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-bold text-dark text-xl mb-3">User-Centric Design</h3>
          <p className="text-dark/70 leading-relaxed">
            We've stripped away the noise. You get a clean, beautiful, and distraction-free experience focused on delivering intelligence fast.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-4xl bg-dark text-primary rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to start analyzing?</h2>
        <p className="text-primary/80 mb-8 max-w-xl mx-auto relative z-10 text-lg">
          Join thousands of users who trust LabelSpy for their ingredient research.
        </p>
        <Link
          to="/scanner"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary font-bold rounded-xl transition-transform hover:scale-105 shadow-lg shadow-accent/20 relative z-10"
        >
          Try the Scanner <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}
