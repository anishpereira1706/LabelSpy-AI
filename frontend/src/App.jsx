import React, { useState } from "react";

function App() {
  const [ingredientText, setIngredientText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ingredientText.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ingredientText }),
      });

      if (!response.ok) throw new Error("Server communication glitch!");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 flex flex-col">
      
      {/* Premium Glassmorphism Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 duration-300">
            <span className="text-2xl drop-shadow-sm">🔍</span>
            <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
              LabelSpy
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Forensic Scanner</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Database Index</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">About AI</a>
            <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-mono text-slate-500 shadow-inner">
              v2.0 Vector RAG
            </div>
          </div>
          {/* Mobile Menu Icon (Visual Only) */}
          <div className="md:hidden text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8 w-full">
        <div className="max-w-4xl w-full space-y-10 mt-4 md:mt-8">

          {/* Hero Header Section */}
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-600 mb-6 tracking-widest uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Vector Cloud
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-800 drop-shadow-sm pb-2">
              Unmask Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">Ingredients</span>
            </h1>
            <p className="text-slate-500 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-medium">
              The universal chemical forensic engine for grocery foods, hair dyes, and skincare. Paste any label below to expose hidden hazards instantly.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white border border-slate-200/60 rounded-[2rem] shadow-2xl shadow-slate-200/50 p-6 md:p-10 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
            
            <form onSubmit={handleScan} className="space-y-6 relative z-10">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">
                  Product Label Scanner
                </label>
                <span className="text-[11px] text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  Auto-Detects Commas
                </span>
              </div>

              <textarea
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                placeholder="Example: Water, Glycerin, Sodium Lauryl Sulfate, Tartrazine, Paraphenylenediamine, Maltodextrin..."
                rows={5}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-white transition-all duration-300 text-sm md:text-base leading-relaxed resize-y shadow-inner"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-base tracking-wide py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-[0.98] group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Running AI Deep Scan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Execute Forensic Scan
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-2xl flex items-center gap-3 shadow-sm mx-auto max-w-2xl">
              <span className="text-xl animate-bounce">⚠️</span> <span className="font-bold">{error}</span>
            </div>
          )}

          {/* Dynamic Scan Results Dashboard */}
          {result && (
            <div className="space-y-10 animate-fadeIn pt-4">

              {/* Metric Metrics Grid (4 Columns) */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow col-span-2 lg:col-span-1 group cursor-default">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Items</span>
                  <span className="text-4xl font-black font-sans text-slate-800 mt-2 group-hover:scale-105 transition-transform origin-left">{result.scanned_count}</span>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-5 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Toxic Hazards</span>
                  <span className="text-4xl font-black font-sans text-rose-600 mt-2 group-hover:scale-105 transition-transform origin-left">{result.dangerous_count}</span>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-5 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Moderate</span>
                  <span className="text-4xl font-black font-sans text-amber-500 mt-2 group-hover:scale-105 transition-transform origin-left">{result.moderate_count}</span>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Verified Safe</span>
                  <span className="text-4xl font-black font-sans text-emerald-500 mt-2 group-hover:scale-105 transition-transform origin-left">{result.safe_count}</span>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Unlisted</span>
                  <span className="text-4xl font-black font-sans text-slate-300 mt-2 group-hover:scale-105 transition-transform origin-left">{result.unlisted_count}</span>
                </div>
              </div>

              {/* Verified Safe Badges Block */}
              {result.safe_count > 0 && (
                <div className="bg-white/60 border border-emerald-100 rounded-3xl p-6 shadow-sm backdrop-blur-md">
                  <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Safe Elements
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {result.safe_items.map((item, i) => (
                      <span key={i} className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-3 py-1.5 rounded-xl text-[13px] font-semibold shadow-sm transition-colors hover:bg-emerald-100 cursor-help" title={item.profile}>
                        {item.ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unlisted/Not Found Warning Block */}
              {result.unlisted_count > 0 && (
                <div className="bg-white/60 border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-md">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> Unknown / Untracked Elements
                  </h4>
                  <p className="text-xs text-slate-400 mb-3 font-medium">
                    Not found in the cloud repository index. Please verify independently:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.not_found_items.map((item, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-xl text-[13px] font-medium shadow-sm opacity-80">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Forensic Detail List (Combines Toxic & Moderate for Report Cards) */}
              {(result.dangerous_count > 0 || result.moderate_count > 0) && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      AI Forensic Flag Report
                    </h3>
                    <div className="flex-grow h-px bg-slate-200"></div>
                  </div>

                  {/* 1. Render Toxic Cards */}
                  {result.flagged_hazards.map((hazard, index) => (
                    <div key={`toxic-${index}`} className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-md shadow-rose-100/50 hover:shadow-xl hover:shadow-rose-100 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="p-6 flex flex-wrap gap-4 items-start justify-between border-b bg-gradient-to-r from-rose-50/50 to-white border-rose-50">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="flex h-3 w-3 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-sm"></span>
                            </span>
                            <h4 className="text-2xl font-black tracking-tight text-slate-800">{hazard.ingredient}</h4>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-rose-100/80 text-rose-700 px-3 py-1 rounded-lg inline-block">
                            {hazard.category}
                          </span>
                        </div>
                        <div className="text-right bg-white px-4 py-2 rounded-xl border border-rose-100 shadow-sm">
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block mb-1">Threat Level</span>
                          <span className="text-sm font-black font-sans text-rose-600">SEVERE TOXICITY</span>
                        </div>
                      </div>
                      <div className="p-6 bg-white relative">
                        {/* Decorative quote mark */}
                        <span className="absolute top-4 left-4 text-6xl text-slate-50 font-serif leading-none select-none">"</span>
                        <p className="text-base text-slate-600 leading-relaxed font-medium relative z-10 pl-4 border-l-2 border-rose-100">
                          {hazard.profile}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* 2. Render Moderate Cards */}
                  {result.moderate_hazards.map((hazard, index) => (
                    <div key={`mod-${index}`} className="bg-white border border-amber-100 rounded-3xl overflow-hidden shadow-md shadow-amber-50/50 hover:shadow-xl hover:shadow-amber-100 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="p-6 flex flex-wrap gap-4 items-start justify-between border-b bg-gradient-to-r from-amber-50/50 to-white border-amber-50">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></span>
                            <h4 className="text-2xl font-black tracking-tight text-slate-800">{hazard.ingredient}</h4>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100/80 text-amber-700 px-3 py-1 rounded-lg inline-block">
                            {hazard.category}
                          </span>
                        </div>
                        <div className="text-right bg-white px-4 py-2 rounded-xl border border-amber-100 shadow-sm">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">Threat Level</span>
                          <span className="text-sm font-black font-sans text-amber-600">MODERATE / CAUTION</span>
                        </div>
                      </div>
                      <div className="p-6 bg-white relative">
                        <span className="absolute top-4 left-4 text-6xl text-slate-50 font-serif leading-none select-none">"</span>
                        <p className="text-base text-slate-600 leading-relaxed font-medium relative z-10 pl-4 border-l-2 border-amber-100">
                          {hazard.profile}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Complete Clean Shield */}
              {result.dangerous_count === 0 && result.moderate_count === 0 && result.unlisted_count === 0 && (
                <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 rounded-[2rem] p-12 text-center shadow-xl shadow-emerald-100/40 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 text-9xl opacity-10">🛡️</div>
                  <div className="text-6xl mb-6 drop-shadow-md relative z-10">✨</div>
                  <h3 className="text-3xl font-black text-emerald-800 mb-3 relative z-10">Perfect Clean Scan</h3>
                  <p className="text-base text-emerald-600/90 max-w-lg mx-auto leading-relaxed font-medium relative z-10">
                    Excellent news! None of the elements on this label match any known toxic hazards, controversial additives, or allergens in our global database.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-400 text-xs font-medium border-t border-slate-200 bg-white/50 mt-12">
        <p>© 2026 LabelSpy AI — Advanced Vector Forensics</p>
      </footer>
    </div>
  );
}

export default App;