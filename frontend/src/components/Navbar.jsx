import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Database, Info, ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Scanner", path: "/scanner", icon: <Search className="w-4 h-4" /> },
    { name: "Knowledge Base", path: "/database", icon: <Database className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldCheck className="w-6 h-6 text-dark group-hover:text-accent transition-colors" />
          <span className="text-xl font-bold tracking-tight text-dark">
            LabelSpy
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === link.path
                  ? "text-accent font-bold"
                  : "text-dark/70 hover:text-dark"
                }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="px-3 py-1 bg-secondary rounded-md border border-secondary text-xs font-mono text-dark/70">
            v2.0
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-dark/70 hover:text-dark hover:bg-secondary focus:outline-none transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-secondary">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-secondary text-accent font-bold"
                    : "text-dark/70 hover:bg-secondary/50 hover:text-dark"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-secondary/50">
            <div className="flex items-center gap-2 text-sm text-dark/50 font-mono">
              LabelSpy Engine v2.0
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
