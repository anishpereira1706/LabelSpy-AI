import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Database, Info, ShieldCheck, Menu, X, Cpu } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Scanner", path: "/scanner", icon: <Search className="w-4 h-4" /> },
    { name: "Knowledge Base", path: "/database", icon: <Database className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 border border-accent/20">
            <ShieldCheck className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-dark to-accent bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            LabelSpy<span className="text-accent">.ai</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 ${isActive
                    ? "bg-white text-accent shadow-sm border border-slate-200"
                    : "text-dark/70 hover:text-dark hover:bg-white/50 border border-transparent"
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-dark/70 hover:text-dark hover:bg-secondary focus:outline-none transition-all duration-200 border border-transparent hover:border-secondary"
          >
            {isMobileMenuOpen ? (
              <X className="block h-5 w-5" />
            ) : (
              <Menu className="block h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? "bg-accent/10 text-accent font-bold border border-accent/10"
                    : "text-dark/70 hover:bg-secondary/50 hover:text-dark"
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-dark/50 font-mono">
              <Cpu className="w-3.5 h-3.5 text-accent/70 animate-pulse" />
              LabelSpy Engine Active
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

