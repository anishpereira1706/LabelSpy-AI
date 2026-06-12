// import React, { useState } from "react";
// import { ScanSearch, AlertTriangle, ShieldCheck, HelpCircle, AlertCircle } from "lucide-react";
// import ChatAssistant from "../components/ChatAssistant";
// import { API_BASE_URL } from "../config";

// export default function Scanner() {
//   const [ingredientText, setIngredientText] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [scannedIngredients, setScannedIngredients] = useState([]);

//   const handleScan = async (e) => {
//     e.preventDefault();
//     if (!ingredientText.trim()) return;

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/analyze`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: ingredientText }),
//       });

//       if (!response.ok) {
//         const errData = await response.json().catch(() => ({}));
//         throw new Error(errData.detail || "Server communication error.");
//       }
//       const data = await response.json();
//       setResult(data);

//       const allIngredients = [
//         ...data.flagged_hazards.map(h => h.ingredient),
//         ...data.moderate_hazards.map(h => h.ingredient),
//         ...data.safe_items.map(h => h.ingredient),
//         ...data.not_found_items
//       ];
//       setScannedIngredients(allIngredients);
//     } catch (err) {
//       setError(err.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col min-h-screen">
//       <div className="mb-10">
//         <h1 className="text-3xl font-bold text-dark tracking-tight mb-2">Analysis Scanner</h1>
//         <p className="text-dark/60">Paste an ingredient list below to generate a safety report.</p>
//       </div>

//       <div className="bg-primary border border-secondary rounded-2xl shadow-sm p-6 mb-8">
//         <form onSubmit={handleScan} className="space-y-4">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-bold text-dark/90">Ingredient Input</label>
//             <span className="text-xs text-dark/60 bg-secondary px-2 py-1 rounded border border-accent/50 font-medium">
//               Comma-separated list
//             </span>
//           </div>

//           <textarea
//             value={ingredientText}
//             onChange={(e) => setIngredientText(e.target.value)}
//             placeholder="e.g. Water, Glycerin, Sodium Lauryl Sulfate, Maltodextrin..."
//             rows={5}
//             className="w-full bg-secondary/50 border border-secondary rounded-xl p-4 text-dark placeholder-dark/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-y font-mono text-sm"
//           />

//           <button
//             type="submit"
//             disabled={loading || !ingredientText.trim()}
//             className="w-full md:w-auto px-8 py-3 bg-dark hover:bg-dark/90 disabled:bg-secondary disabled:text-dark/40 disabled:cursor-not-allowed text-primary font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
//                 Processing...
//               </span>
//             ) : (
//               <span className="flex items-center gap-2">
//                 <ScanSearch className="w-4 h-4" />
//                 Analyze Label
//               </span>
//             )}
//           </button>
//         </form>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl flex items-center gap-3 mb-8">
//           <AlertCircle className="w-5 h-5" />
//           <span className="font-medium">{error}</span>
//         </div>
//       )}

//       {result && (
//         <div className="space-y-8 animate-in fade-in duration-500">

//           {/* Metrics Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <div className="bg-primary border border-secondary p-4 rounded-xl shadow-sm">
//               <span className="text-xs text-dark/50 font-bold uppercase tracking-wider">Total Items</span>
//               <div className="text-3xl font-extrabold text-dark mt-1">{result.scanned_count}</div>
//             </div>
//             <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
//               <span className="text-xs text-red-600 font-bold uppercase tracking-wider">High Risk</span>
//               <div className="text-3xl font-extrabold text-red-700 mt-1">{result.dangerous_count}</div>
//             </div>
//             <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
//               <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Moderate</span>
//               <div className="text-3xl font-extrabold text-amber-600 mt-1">{result.moderate_count}</div>
//             </div>
//             <div className="bg-secondary/40 border border-secondary p-4 rounded-xl shadow-sm">
//               <span className="text-xs text-dark/50 font-bold uppercase tracking-wider">Safe</span>
//               <div className="text-3xl font-extrabold text-dark/70 mt-1">{result.safe_count}</div>
//             </div>
//             <div className="bg-secondary/50 border border-secondary p-4 rounded-xl shadow-sm">
//               <span className="text-xs text-dark/40 font-bold uppercase tracking-wider">Unlisted</span>
//               <div className="text-3xl font-extrabold text-dark/70 mt-1">{result.unlisted_count}</div>
//             </div>
//           </div>

//           {/* Perfect Scan */}
//           {result.dangerous_count === 0 && result.moderate_count === 0 && result.unlisted_count === 0 && (
//             <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex items-center gap-6">
//               <div className="bg-green-100 p-4 rounded-full text-green-600">
//                 <ShieldCheck className="w-10 h-10" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-green-800 mb-1">Clear Safety Profile</h3>
//                 <p className="text-green-700 text-sm">
//                   No toxic hazards or controversial additives detected in our database.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Badges List */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {result.safe_count > 0 && (
//               <div className="border border-secondary rounded-xl p-5 bg-primary shadow-sm">
//                 <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
//                   <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified Safe Elements
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {result.safe_items.map((item, i) => (
//                     <span key={i} className="bg-secondary/50 border border-accent/50 text-dark px-2.5 py-1 rounded-md text-xs font-semibold" title={item.profile}>
//                       {item.ingredient}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {result.unlisted_count > 0 && (
//               <div className="border border-secondary rounded-xl p-5 bg-primary shadow-sm">
//                 <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
//                   <span className="w-2 h-2 rounded-full bg-dark/30"></span> Untracked Elements
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {result.not_found_items.map((item, i) => (
//                     <span key={i} className="bg-secondary/30 text-dark/60 px-2.5 py-1 rounded-md text-xs border border-secondary">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Hazard Reports */}
//           {(result.dangerous_count > 0 || result.moderate_count > 0) && (
//             <div className="space-y-4 pt-4 border-t border-secondary">
//               <h3 className="text-lg font-bold text-dark mb-4">Detailed Findings</h3>

//               {result.flagged_hazards.map((hazard, index) => (
//                 <div key={`toxic-${index}`} className="border border-red-200 rounded-xl bg-primary shadow-sm overflow-hidden">
//                   <div className="p-4 bg-red-50/80 border-b border-red-100 flex justify-between items-start">
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <AlertTriangle className="w-4 h-4 text-red-500" />
//                         <h4 className="font-bold text-dark">{hazard.ingredient}</h4>
//                       </div>
//                       <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
//                         {hazard.category}
//                       </span>
//                     </div>
//                     <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">High Risk</span>
//                   </div>
//                   <div className="p-4 text-sm text-dark/80 leading-relaxed">
//                     {hazard.profile}
//                   </div>
//                 </div>
//               ))}

//               {result.moderate_hazards.map((hazard, index) => (
//                 <div key={`mod-${index}`} className="border border-amber-200 rounded-xl bg-primary shadow-sm overflow-hidden">
//                   <div className="p-4 bg-amber-50/80 border-b border-amber-100 flex justify-between items-start">
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <HelpCircle className="w-4 h-4 text-amber-500" />
//                         <h4 className="font-bold text-dark">{hazard.ingredient}</h4>
//                       </div>
//                       <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
//                         {hazard.category}
//                       </span>
//                     </div>
//                     <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Moderate</span>
//                   </div>
//                   <div className="p-4 text-sm text-dark/80 leading-relaxed">
//                     {hazard.profile}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Render Chat Assistant ONLY on Scanner page when there are scanned ingredients, or just make it globally available on scanner page */}
//       <ChatAssistant scannedIngredients={scannedIngredients} />
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { ScanSearch, AlertTriangle, ShieldCheck, HelpCircle, AlertCircle, Upload, Camera, Sparkles } from "lucide-react";
import Tesseract from "tesseract.js"; // Integrated OCR Engine
import ChatAssistant from "../components/ChatAssistant";
import { API_BASE_URL } from "../config";

export default function Scanner() {
  const [ingredientText, setIngredientText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [ocrProgress, setOcrProgress] = useState(""); // Tracks OCR percentage updates
  const reportRef = useRef(null);

  useEffect(() => {
    if (result && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  // 🧪 Supercharged Regex Data Cleaner & Ingredient Isolator
  const cleanAndExtractIngredients = (rawText) => {
    if (!rawText) return "";

    // 1. Flatten all messy multi-line linebreaks into spaces first
    let flattenedText = rawText.replace(/\s+/g, " ");

    // 2. Clear out percentages and numbers like "(12.7%)" or "23.6%" which break matches
    flattenedText = flattenedText.replace(/\d+(\.\d+)?%/g, "");

    // 3. Swap tricky characters and raw OCR typos (like vertical bars and brackets) with clean spaces/commas
    let cleanedText = flattenedText.replace(/[|{}⌈⌉\[\]()]/g, " ");

    // 4. Scan text for target anchor indicators where labels officially start listing items
    const regex = /(?:ingredients|contains|composition|ingredients:)\s*(.*)/i;
    const match = cleanedText.match(regex);

    // 5. Isolate the matched grouping slice. Fall back to whole cleaned string if anchor keyword wasn't hit
    let targetSection = match ? match[1] : cleanedText;

    // 5.5 Filter out trailing non-ingredient sections using stop words (e.g. nutrition, distributor details)
    const stopWords = /(?:nutrition facts|nutritional information|manufactured by|mfd|pkgd|net qty|net weight|best before|dist\. by|distributed by|customer care|store in a cool)/i;
    const stopMatch = targetSection.match(stopWords);
    if (stopMatch) {
      targetSection = targetSection.substring(0, stopMatch.index);
    }

    // 6. Clean up formatting overhead (condense whitespace lines, eliminate duplicated commas)
    let finalOutput = targetSection
      .replace(/,+/g, ",") // Remove double commas
      .replace(/\s+/g, " ") // Clean up double spaces
      .trim();

    // 7. Dynamic Comma Conversion: If the text doesn't use commas but has lots of spaces,
    // let's ensure words are grouped smartly or clean up loose symbols
    finalOutput = finalOutput
      .replace(/\s*:\s*/g, ", ") // Turn colons into comma separators
      .replace(/\s*•\s*/g, ", "); // Turn bullet points into commas

    // 8. Trim trailing or leading dangling punctuation cleanups
    if (finalOutput.startsWith(",")) finalOutput = finalOutput.substring(1).trim();
    if (finalOutput.endsWith(".")) finalOutput = finalOutput.slice(0, -1).trim();

    return finalOutput;
  };

  // 📸 OCR Worker Execution Function
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setOcrProgress("Initializing scanner pipeline...");

    Tesseract.recognize(
      file,
      "eng", // Extract English alphabet characters
      {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(`Reading Label Image: ${Math.round(m.progress * 100)}%`);
          }
        },
      }
    )
      .then(({ data: { text } }) => {
        if (!text.trim()) {
          throw new Error("Could not detect legible characters in image. Try a clearer angle.");
        }

        // ✨ Filter raw OCR blocks into clean comma-separated lists automatically
        const parsedIngredients = cleanAndExtractIngredients(text);

        setIngredientText(parsedIngredients); // Pushes the cleaned data string right into your input box
        setOcrProgress("");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "OCR Engine failed to read image file.");
        setOcrProgress("");
        setLoading(false);
      });
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
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

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Server communication error.");
      }
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

  const getScoreAndGrade = (res) => {
    if (!res) return { score: 100, grade: "A", color: "text-green-500", stroke: "#22c55e", bg: "bg-green-500/10", label: "Excellent" };
    const dCount = res.dangerous_count || 0;
    const mCount = res.moderate_count || 0;
    const score = Math.max(1, Math.min(100, 100 - (dCount * 20) - (mCount * 8)));
    
    if (score >= 90) return { score, grade: "A", color: "text-green-500", stroke: "#22c55e", bg: "bg-green-500/10", label: "Excellent" };
    if (score >= 75) return { score, grade: "B", color: "text-teal-500", stroke: "#14b8a6", bg: "bg-teal-500/10", label: "Good / Low Risk" };
    if (score >= 50) return { score, grade: "C", color: "text-amber-500", stroke: "#f59e0b", bg: "bg-amber-500/10", label: "Moderate Risk" };
    return { score, grade: "D", color: "text-red-500", stroke: "#ef4444", bg: "bg-red-500/10", label: "High Risk / Avoid" };
  };

  const { score, grade, color: scoreColor, stroke: scoreStroke, bg: scoreBg, label: scoreLabel } = getScoreAndGrade(result);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Analysis Scanner</h1>
        <p className="text-dark/60">Paste an ingredient list or upload an image to generate a safety report.</p>
      </div>

      {/* SECTION 1: Inputs 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-8">
        
        {/* Left Column: File Uploader */}
        <div className="bg-gradient-to-br from-accent/5 via-primary to-primary border border-secondary rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-accent/30 transition-all duration-300">
          <div>
            <h3 className="text-sm font-extrabold text-dark mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 rounded-full bg-accent"></span>
              Label Scanner
            </h3>
            
            <div
              className={`group relative flex flex-col items-center justify-center border-2 border-dashed border-accent/30 hover:border-accent rounded-xl p-8 bg-primary/40 hover:bg-accent/[0.03] transition-all text-center cursor-pointer overflow-hidden ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <input
                id="label-camera-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="bg-accent/10 p-3 rounded-full text-accent mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-dark/90 mb-1">
                {ocrProgress ? "Processing Image Layer" : "Upload Label Image"}
              </p>
              <p className="text-xs text-dark/50 px-4">
                {ocrProgress ? ocrProgress : "Click to select or upload an ingredient label photo"}
              </p>
              
              {/* Custom Scanning Bar Animation */}
              {loading && ocrProgress && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary overflow-hidden">
                  <div className="h-full bg-accent animate-slide-progress w-1/3"></div>
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl flex items-center gap-3 mt-4">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Form Input */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent/[0.02] border border-secondary rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:border-accent/30 transition-all duration-300">
          <form onSubmit={handleScan} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-dark/95 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  Ingredient Input
                </label>
                <span className="text-xs text-accent/80 bg-accent/5 px-2.5 py-1 rounded border border-accent/20 font-bold">
                  Comma-separated list
                </span>
              </div>

              <textarea
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                placeholder="e.g. Water, Glycerin, Sodium Lauryl Sulfate, Maltodextrin..."
                rows={5}
                disabled={loading}
                className="w-full bg-secondary/50 border border-secondary rounded-xl p-4 text-dark placeholder-dark/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !ingredientText.trim()}
              className="w-full px-6 py-3.5 bg-accent hover:bg-accent/90 disabled:bg-secondary disabled:text-dark/40 disabled:cursor-not-allowed text-primary font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-accent/15 flex items-center justify-center gap-2 mt-4"
            >
              {loading && !ocrProgress ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analyzing...
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

      </div>

      {/* SECTION 2: Analytics Dashboard (Single Column) */}
      {result && (
        <div ref={reportRef} className="border-t border-secondary pt-8 mt-4 scroll-mt-20 space-y-6 animate-in fade-in duration-500">
          
          {/* Score card & Circle progress */}
          <div className="bg-primary border border-secondary rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            {/* Circular Progress Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-secondary"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke={scoreStroke}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-dark">{score}</span>
                <span className="text-xs font-bold text-dark/50">Score</span>
              </div>
            </div>

            {/* Score details */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md ${scoreBg} ${scoreColor}`}>
                  Grade {grade}
                </span>
                <span className="text-sm font-bold text-dark">{scoreLabel}</span>
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">Safety Index Report</h3>
              <p className="text-xs text-dark/60 leading-relaxed">
                This safety index is dynamically computed based on the toxicity severity of matched database profiles.
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-primary border border-secondary p-3 rounded-xl shadow-sm text-center">
              <span className="text-[10px] text-dark/50 font-bold uppercase tracking-wider block">Total</span>
              <div className="text-xl font-extrabold text-dark mt-0.5">{result.scanned_count}</div>
            </div>
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl shadow-sm text-center">
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">High Risk</span>
              <div className="text-xl font-extrabold text-red-700 mt-0.5">{result.dangerous_count}</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl shadow-sm text-center">
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Moderate</span>
              <div className="text-xl font-extrabold text-amber-600 mt-0.5">{result.moderate_count}</div>
            </div>
            <div className="bg-secondary/30 border border-secondary p-3 rounded-xl shadow-sm text-center">
              <span className="text-[10px] text-dark/50 font-bold uppercase tracking-wider block">Safe</span>
              <div className="text-xl font-extrabold text-dark/70 mt-0.5">{result.safe_count}</div>
            </div>
            <div className="bg-secondary/40 border border-secondary p-3 rounded-xl shadow-sm text-center">
              <span className="text-[10px] text-dark/40 font-bold uppercase tracking-wider block">Unlisted</span>
              <div className="text-xl font-extrabold text-dark/70 mt-0.5">{result.unlisted_count}</div>
            </div>
          </div>

          {/* Clean Grouped Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.safe_count > 0 && (
              <div className="border border-secondary rounded-xl p-4 bg-primary shadow-sm">
                <h4 className="text-xs font-bold text-dark mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified Safe ({result.safe_count})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.safe_items.map((item, i) => (
                    <span key={i} className="bg-secondary/50 border border-accent/40 text-dark px-2 py-0.5 rounded text-[10px] font-semibold" title={item.profile}>
                      {item.ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.unlisted_count > 0 && (
              <div className="border border-secondary rounded-xl p-4 bg-primary shadow-sm">
                <h4 className="text-xs font-bold text-dark mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-dark/30"></span> Untracked ({result.unlisted_count})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.not_found_items.map((item, i) => (
                    <span key={i} className="bg-secondary/35 text-dark/60 px-2 py-0.5 rounded text-[10px] border border-secondary/60">
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
              <h3 className="text-base font-bold text-dark mb-3">Detailed Warnings</h3>

              {result.flagged_hazards.map((hazard, index) => {
                const hasDifferentMatch = hazard.matched_as && hazard.matched_as.toLowerCase() !== hazard.ingredient.toLowerCase();
                return (
                  <div key={`toxic-${index}`} className="border border-red-100 rounded-xl bg-primary shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 bg-red-50/50 border-b border-red-100/50 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                          <h4 className="font-bold text-dark text-sm">
                            {hazard.matched_as || hazard.ingredient}
                            {hasDifferentMatch && (
                              <span className="text-xs font-normal text-dark/40 ml-1.5">
                                (scanned: {hazard.ingredient})
                              </span>
                            )}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-red-700 bg-red-100/80 border border-red-200/50 px-2 py-0.5 rounded">
                          {hazard.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider bg-red-100/40 px-2 py-0.5 rounded">
                        High Risk
                      </span>
                    </div>
                    <div className="p-4 text-xs text-dark/80 leading-relaxed">
                      {hazard.profile}
                    </div>
                  </div>
                );
              })}

              {result.moderate_hazards.map((hazard, index) => {
                const hasDifferentMatch = hazard.matched_as && hazard.matched_as.toLowerCase() !== hazard.ingredient.toLowerCase();
                return (
                  <div key={`mod-${index}`} className="border border-amber-100 rounded-xl bg-primary shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-50/50 border-b border-amber-100/50 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <h4 className="font-bold text-dark text-sm">
                            {hazard.matched_as || hazard.ingredient}
                            {hasDifferentMatch && (
                              <span className="text-xs font-normal text-dark/40 ml-1.5">
                                (scanned: {hazard.ingredient})
                              </span>
                            )}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 border border-amber-200/50 px-2 py-0.5 rounded">
                          {hazard.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider bg-amber-100/40 px-2 py-0.5 rounded">
                        Moderate
                      </span>
                    </div>
                    <div className="p-4 text-xs text-dark/80 leading-relaxed">
                      {hazard.profile}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ChatAssistant scannedIngredients={scannedIngredients} />
    </div>
  );
}