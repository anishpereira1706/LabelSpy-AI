import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Database from "./pages/Database";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary text-dark font-sans selection:bg-accent selection:text-dark flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/database" element={<Database />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="w-full py-8 text-center text-dark/50 text-xs font-medium border-t border-secondary mt-auto">
          <p>
            © {new Date().getFullYear()} LabelSpy Analytics. Created by{" "}
            <a 
              href="https://github.com/anishpereira1706" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accent hover:text-accent/80 transition-colors font-bold"
              title="Anish Larson Pereira"
            >
              Anish Larson Pereira
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;