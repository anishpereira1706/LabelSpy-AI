import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Database, Info, ShieldCheck, Menu, X, Cpu } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Directory", path: "/database", icon: <Database className="w-3.5 h-3.5" /> },
    { name: "About", path: "/about", icon: <Info className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(79,70,229,0.02)] transition-all duration-300">
      <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">

        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9.5 h-9.5 rounded-xl bg-accent/5 group-hover:bg-accent/10 transition-all duration-300 border border-accent/15 group-hover:rotate-[8deg] group-hover:scale-105">
            <ShieldCheck className="w-5.5 h-5.5 text-accent" />
            <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </div>
          <span className="text-lg font-black tracking-tight text-dark group-hover:opacity-90 transition-opacity">
            LabelSpy<span className="text-accent">.ai</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 mr-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 py-1 text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? "text-accent"
                      : "text-dark/60 hover:text-dark"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-accent rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Primary CTA Button */}
          <Link
            to="/scanner"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-primary bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/95 hover:to-indigo-600/95 rounded-xl transition-all shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-white" />
            Start Scanner
          </Link>
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
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 rounded-b-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-accent/10 text-accent font-bold border border-accent/10"
                      : "text-dark/70 hover:bg-secondary/50 hover:text-dark"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
            
            {/* Mobile Scan CTA Link */}
            <Link
              key="mobile-scanner"
              to="/scanner"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                location.pathname === "/scanner"
                  ? "bg-accent/10 text-accent border border-accent/10"
                  : "bg-gradient-to-r from-accent to-indigo-600 text-white hover:opacity-95"
              }`}
            >
              <Search className="w-4 h-4 text-white" />
              Start Scanner
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
