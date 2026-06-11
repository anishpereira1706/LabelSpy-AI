import React, { useState } from "react";
import { ScanSearch, AlertTriangle, ShieldCheck, HelpCircle, AlertCircle } from "lucide-react";
import ChatAssistant from "../components/ChatAssistant";
import { API_BASE_URL } from "../config";

export default function Scanner() {
  const [ingredientText, setIngredientText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scannedIngredients, setScannedIngredients] = useState([]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ingredientText.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ingredientText }),
      });

      if (!response.ok) throw new Error("Server communication error.");
      const data = await response.json();
      setResult(data);

      const allIngredients = [
        ...data.flagged_hazards.map(h => h.ingredient),
        ...data.moderate_hazards.map(h => h.ingredient),
        ...data.safe_items.map(h => h.ingredient),
        ...data.not_found_items
      ];
      setScannedIngredients(allIngredients);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-dark tracking-tight mb-2">Analysis Scanner</h1>
        <p className="text-dark/60">Paste an ingredient list below to generate a safety report.</p>
      </div>

      <div className="bg-primary border border-secondary rounded-2xl shadow-sm p-6 mb-8">
        <form onSubmit={handleScan} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-dark/90">Ingredient Input</label>
            <span className="text-xs text-dark/60 bg-secondary px-2 py-1 rounded border border-accent/50 font-medium">
              Comma-separated list
            </span>
          </div>

          <textarea
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            placeholder="e.g. Water, Glycerin, Sodium Lauryl Sulfate, Maltodextrin..."
            rows={5}
            className="w-full bg-secondary/50 border border-secondary rounded-xl p-4 text-dark placeholder-dark/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-y font-mono text-sm"
          />

          <button
            type="submit"
            disabled={loading || !ingredientText.trim()}
            className="w-full md:w-auto px-8 py-3 bg-dark hover:bg-dark/90 disabled:bg-secondary disabled:text-dark/40 disabled:cursor-not-allowed text-primary font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ScanSearch className="w-4 h-4" />
                Analyze Label
              </span>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in duration-500">

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-primary border border-secondary p-4 rounded-xl shadow-sm">
              <span className="text-xs text-dark/50 font-bold uppercase tracking-wider">Total Items</span>
              <div className="text-3xl font-extrabold text-dark mt-1">{result.scanned_count}</div>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-red-600 font-bold uppercase tracking-wider">High Risk</span>
              <div className="text-3xl font-extrabold text-red-700 mt-1">{result.dangerous_count}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Moderate</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{result.moderate_count}</div>
            </div>
            <div className="bg-secondary/40 border border-secondary p-4 rounded-xl shadow-sm">
              <span className="text-xs text-dark/50 font-bold uppercase tracking-wider">Safe</span>
              <div className="text-3xl font-extrabold text-dark/70 mt-1">{result.safe_count}</div>
            </div>
            <div className="bg-secondary/50 border border-secondary p-4 rounded-xl shadow-sm">
              <span className="text-xs text-dark/40 font-bold uppercase tracking-wider">Unlisted</span>
              <div className="text-3xl font-extrabold text-dark/70 mt-1">{result.unlisted_count}</div>
            </div>
          </div>

          {/* Perfect Scan */}
          {result.dangerous_count === 0 && result.moderate_count === 0 && result.unlisted_count === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex items-center gap-6">
              <div className="bg-green-100 p-4 rounded-full text-green-600">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-1">Clear Safety Profile</h3>
                <p className="text-green-700 text-sm">
                  No toxic hazards or controversial additives detected in our database.
                </p>
              </div>
            </div>
          )}

          {/* Badges List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.safe_count > 0 && (
              <div className="border border-secondary rounded-xl p-5 bg-primary shadow-sm">
                <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified Safe Elements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.safe_items.map((item, i) => (
                    <span key={i} className="bg-secondary/50 border border-accent/50 text-dark px-2.5 py-1 rounded-md text-xs font-semibold" title={item.profile}>
                      {item.ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.unlisted_count > 0 && (
              <div className="border border-secondary rounded-xl p-5 bg-primary shadow-sm">
                <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-dark/30"></span> Untracked Elements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.not_found_items.map((item, i) => (
                    <span key={i} className="bg-secondary/30 text-dark/60 px-2.5 py-1 rounded-md text-xs border border-secondary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hazard Reports */}
          {(result.dangerous_count > 0 || result.moderate_count > 0) && (
            <div className="space-y-4 pt-4 border-t border-secondary">
              <h3 className="text-lg font-bold text-dark mb-4">Detailed Findings</h3>
              
              {result.flagged_hazards.map((hazard, index) => (
                <div key={`toxic-${index}`} className="border border-red-200 rounded-xl bg-primary shadow-sm overflow-hidden">
                  <div className="p-4 bg-red-50/80 border-b border-red-100 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <h4 className="font-bold text-dark">{hazard.ingredient}</h4>
                      </div>
                      <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
                        {hazard.category}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">High Risk</span>
                  </div>
                  <div className="p-4 text-sm text-dark/80 leading-relaxed">
                    {hazard.profile}
                  </div>
                </div>
              ))}

              {result.moderate_hazards.map((hazard, index) => (
                <div key={`mod-${index}`} className="border border-amber-200 rounded-xl bg-primary shadow-sm overflow-hidden">
                  <div className="p-4 bg-amber-50/80 border-b border-amber-100 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        <h4 className="font-bold text-dark">{hazard.ingredient}</h4>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
                        {hazard.category}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Moderate</span>
                  </div>
                  <div className="p-4 text-sm text-dark/80 leading-relaxed">
                    {hazard.profile}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Render Chat Assistant ONLY on Scanner page when there are scanned ingredients, or just make it globally available on scanner page */}
      <ChatAssistant scannedIngredients={scannedIngredients} />
    </div>
  );
}
