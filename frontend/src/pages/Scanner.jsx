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
import { ScanSearch, AlertTriangle, ShieldCheck, HelpCircle, AlertCircle, Upload, Camera, Sparkles, ShieldAlert, EyeOff } from "lucide-react";
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
  const [scanMode, setScanMode] = useState("local"); // Tracks OCR vs AI mode
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

  // 🧪 Automatic Image Enhancement Pipeline (HTML5 Canvas Filters)
  const preprocessImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // 📐 Scale down extremely large camera photos (e.g. 4K) to optimal OCR sizes
          // Tesseract performs best when text font height is around 20-30px.
          const MAX_DIM = 1600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Apply high-contrast grayscale filter to binarize text and filter shadows
          ctx.filter = "grayscale(1) contrast(1.8) brightness(0.95)";

          // Draw image with the filters active
          ctx.drawImage(img, 0, 0, width, height);

          // Convert processed canvas back to data URL
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.onerror = () => reject(new Error("Failed to load image file."));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });
  };

  // 📸 OCR Worker Execution Function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset the input value so the same file can be uploaded consecutively
    e.target.value = "";

    setLoading(true);
    setError("");
    setResult(null);
    setIngredientText("");
    setOcrProgress("Enhancing label contrast...");

    try {
      if (scanMode === "ai") {
        setOcrProgress("Enhancing label contrast...");
        const enhancedImageDataUrl = await preprocessImage(file);

        setOcrProgress("Uploading to Deep AI Engine...");
        const response = await fetch(`${API_BASE_URL}/extract-vision`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_data: enhancedImageDataUrl }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || "AI Extraction failed.");
        }

        const data = await response.json();
        setIngredientText(data.extracted_text);

        await new Promise(r => setTimeout(r, 1500));
        setOcrProgress("");
        setLoading(false);

      } else {
        setOcrProgress("Enhancing label contrast...");
        const enhancedImageDataUrl = await preprocessImage(file);

        setOcrProgress("Initializing scanner pipeline...");

        Tesseract.recognize(
          enhancedImageDataUrl,
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

            setTimeout(() => {
              setOcrProgress("");
              setLoading(false);
            }, 1500);
          })
          .catch((err) => {
            setError(err.message || "OCR Engine failed to read image file.");
            setOcrProgress("");
            setLoading(false);
          });
      }
    } catch (err) {
      setError(err.message || "Image preprocessing failed.");
      setLoading(false);
    }
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
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const getScoreAndGrade = (res) => {
    if (!res) return { score: 100, grade: "A", color: "text-green-500", stroke: "#22c55e", bg: "bg-green-500/10", label: "Excellent" };
    const dCount = res.dangerous_count || 0;
    const mCount = res.moderate_count || 0;
    
    // Deduct points for alerts based on severity
    let alertDeduction = 0;
    if (res.alerts && res.alerts.length > 0) {
      res.alerts.forEach((alert) => {
        if (alert.severity === "high") {
          alertDeduction += 15;
        } else {
          alertDeduction += 8;
        }
      });
    }

    const score = Math.max(1, Math.min(100, 100 - (dCount * 20) - (mCount * 8) - alertDeduction));

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
        <div className="bg-gradient-to-br from-accent/5 via-primary to-primary border border-secondary rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.02] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-dark flex items-center gap-2">
                <span className="w-1.5 h-3 rounded-full bg-accent"></span>
                Label Scanner
              </h3>

              {/* Scan Mode Toggle */}
              <div className="bg-secondary/50 p-1 rounded-lg flex items-center gap-1 border border-secondary">
                <button
                  type="button"
                  onClick={() => setScanMode("local")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scanMode === "local"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark/50 hover:text-dark/80 hover:bg-white/50"
                    }`}
                >
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode("ai")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scanMode === "ai"
                      ? "bg-accent text-primary shadow-sm"
                      : "text-dark/50 hover:text-dark/80 hover:bg-white/50"
                    }`}
                >
                  Use AI
                </button>
              </div>
            </div>

            <div
              className={`group relative flex flex-col items-center justify-center border-2 border-dashed border-accent/30 hover:border-accent rounded-xl p-8 bg-primary/40 hover:bg-accent/[0.03] transition-all text-center cursor-pointer overflow-hidden ${loading ? "opacity-60 cursor-not-allowed" : ""
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

              {/* Custom Laser Scan Animation */}
              {loading && ocrProgress && (
                <>
                  <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-[0_0_15px_3px_rgba(79,70,229,0.6)] animate-laser pointer-events-none z-10"></div>
                </>
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
        <div className="bg-gradient-to-br from-primary via-primary to-accent/[0.02] border border-secondary rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.02] transition-all duration-300">
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
              className={`w-full px-6 py-3.5 text-primary font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 disabled:cursor-not-allowed ${loading && !ocrProgress
                  ? 'bg-gradient-to-r from-accent via-purple-500 to-accent animate-gradient-x shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-[0.98]'
                  : 'bg-accent hover:bg-accent/90 disabled:bg-secondary disabled:text-dark/40 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5'
                }`}
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
          <div className="bg-gradient-to-br from-primary via-primary to-accent/[0.01] border border-accent/15 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            {/* Circular Progress Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-accent/5 rounded-full filter blur-md -z-10 animate-pulse-glow"></div>
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
              <div className="border border-accent/10 rounded-xl p-4 bg-primary shadow-sm">
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
              <div className="border border-accent/10 rounded-xl p-4 bg-primary shadow-sm">
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

          {/* Authenticity & Hidden Ingredient Alerts */}
          {result.alerts && result.alerts.length > 0 && (
            <div className="bg-accent/[0.01] border border-accent/15 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-indigo-950/90 flex items-center gap-2 tracking-wider uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Authenticity & Hidden Ingredient Warnings ({result.alerts.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {result.alerts.map((alert, idx) => {
                  const isHigh = alert.severity === "high";
                  
                  // Clean up labels and styles to remove redundant "hidden" wording
                  const alertLabels = {
                    adulteration: { text: "Product Dilution", style: "bg-rose-50 text-rose-700 border-rose-100" },
                    hidden_sugar: { text: "Sugar Alias", style: "bg-amber-50 text-amber-700 border-amber-100" },
                    hidden_msg: { text: "MSG & Glutamates", style: "bg-orange-50 text-orange-700 border-orange-100" },
                    hidden_trans_fat: { text: "Trans Fats", style: "bg-red-50 text-red-700 border-red-100" }
                  };
                  
                  const labelInfo = alertLabels[alert.type] || { 
                    text: alert.type.replace("hidden_", "").replace("_", " "), 
                    style: isHigh ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100" 
                  };

                  return (
                    <div
                      key={idx}
                      className={`border border-l-4 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
                        isHigh
                          ? "bg-rose-500/[0.01] border-slate-200 border-l-rose-500 hover:shadow-md hover:shadow-rose-500/5 hover:border-rose-200"
                          : "bg-amber-500/[0.01] border-slate-200 border-l-amber-500 hover:shadow-md hover:shadow-amber-500/5 hover:border-amber-200"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isHigh ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {isHigh ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900">{alert.title}</h4>
                        </div>
                        {alert.ingredient && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                            <span>Detected:</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                              {alert.ingredient}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-slate-600/90 leading-relaxed font-semibold">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hazard Reports */}
          {(result.dangerous_count > 0 || result.moderate_count > 0) && (
            <div className="bg-accent/[0.01] border border-accent/15 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-indigo-950/90 flex items-center gap-2 tracking-wider uppercase">
                <span className="w-1.5 h-3 rounded-full bg-rose-500"></span>
                Detailed Chemical & Toxicity Profiles ({result.dangerous_count + result.moderate_count})
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {result.flagged_hazards.map((hazard, index) => {
                  const hasDifferentMatch = hazard.matched_as && hazard.matched_as.toLowerCase() !== hazard.ingredient.toLowerCase();
                  return (
                    <div
                      key={`toxic-${index}`}
                      className="border border-slate-200 border-l-4 border-l-red-500 bg-rose-500/[0.01] hover:shadow-md hover:border-red-200 hover:-translate-y-0.5 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4 transition-all duration-300"
                    >
                      <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {hazard.matched_as || hazard.ingredient}
                            {hasDifferentMatch && (
                              <span className="text-xs font-normal text-slate-400 ml-1.5">
                                (scanned: {hazard.ingredient})
                              </span>
                            )}
                          </h4>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100">
                            High Risk
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                            {hazard.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600/90 leading-relaxed font-semibold">
                          {hazard.profile}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {result.moderate_hazards.map((hazard, index) => {
                  const hasDifferentMatch = hazard.matched_as && hazard.matched_as.toLowerCase() !== hazard.ingredient.toLowerCase();
                  return (
                    <div
                      key={`mod-${index}`}
                      className="border border-slate-200 border-l-4 border-l-amber-500 bg-amber-500/[0.01] hover:shadow-md hover:border-amber-200 hover:-translate-y-0.5 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4 transition-all duration-300"
                    >
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {hazard.matched_as || hazard.ingredient}
                            {hasDifferentMatch && (
                              <span className="text-xs font-normal text-slate-400 ml-1.5">
                                (scanned: {hazard.ingredient})
                              </span>
                            )}
                          </h4>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                            Moderate
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                            {hazard.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600/90 leading-relaxed font-semibold">
                          {hazard.profile}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <ChatAssistant scannedIngredients={scannedIngredients} scanResult={result} />
    </div>
  );
}