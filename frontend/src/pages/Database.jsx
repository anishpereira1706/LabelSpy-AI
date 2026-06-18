import React, { useEffect, useState } from "react";
import { Database as DatabaseIcon, Search, Cloud } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Database() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pineconeCount, setPineconeCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Fetch local ingredients dataset
    fetch(`${API_BASE_URL}/ingredients`)
      .then(res => res.json())
      .then(data => {
        setIngredients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching database:", err);
        setLoading(false);
      });

    // Fetch Pinecone live index statistics
    fetch(`${API_BASE_URL}/database-stats`)
      .then(res => res.json())
      .then(data => {
        setPineconeCount(data.total_vectors);
        setLoadingStats(false);
      })
      .catch(err => {
        console.error("Error fetching Pinecone stats:", err);
        setLoadingStats(false);
      });
  }, []);

  const filtered = ingredients.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const displayItems = search.trim() === "" ? (ingredients.length > 0 ? [ingredients[0]] : []) : filtered;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-accent/20 text-accent rounded-xl flex items-center justify-center border border-accent/50 shadow-sm">
          <DatabaseIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-dark tracking-tight">Knowledge Base</h1>
          <p className="text-dark/60">Search the indexed Pinecone vector database.</p>
        </div>
      </div>

      <div className="bg-primary border border-secondary rounded-2xl shadow-sm overflow-hidden flex-1">
        <div className="p-4 border-b border-secondary bg-secondary/50 flex items-center gap-3">
          <Search className="w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Search chemical index (e.g., aloe, paraben)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-dark placeholder-dark/40 font-medium"
          />
        </div>

        {!loading && (
          <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-dark/60 font-semibold">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                Local Dataset: <span className="font-extrabold text-dark">{ingredients.length} chemicals</span>
              </div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-accent" />
                Pinecone Cloud Index:{" "}
                {loadingStats ? (
                  <span className="text-dark/40 font-normal">loading...</span>
                ) : (
                  <span className={`font-extrabold flex items-center gap-1.5 ${pineconeCount > 0 ? "text-emerald-600" : "text-amber-600"}`}>
                    {pineconeCount} vectors
                    <span className={`relative flex h-2 w-2`}>
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${pineconeCount > 0 ? "bg-emerald-400 animate-ping" : "bg-amber-400 animate-ping"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${pineconeCount > 0 ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                    </span>
                  </span>
                )}
              </div>
            </div>
            {search.trim() === "" && (
              <div className="text-[11px] font-medium text-dark/50 bg-slate-200/50 px-2 py-0.5 rounded border border-slate-200/60">
                Showing example ingredient (type to search all)
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-dark/40 font-medium">Loading index...</div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="md:hidden p-4 space-y-4">
              {displayItems.map(item => (
                <div key={item.id} className="bg-secondary/20 border border-secondary rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-base text-dark">{item.name}</h3>
                      <p className="text-xs text-dark/60 mt-0.5">{item.category}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-bold border ${item.type === 'toxic' ? 'bg-red-50 text-red-700 border-red-200' :
                        item.type === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-secondary/50 text-dark/60 border-secondary/80'
                      }`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="border-t border-secondary/60 pt-2.5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-dark/40 uppercase tracking-wider">Chemical ID</span>
                    <span className="font-mono text-xs text-dark/50">{item.id}</span>
                  </div>
                </div>
              ))}
              {displayItems.length === 0 && (
                <div className="py-12 text-center text-dark/40 font-medium">
                  No matching chemicals found in the index.
                </div>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/30 text-dark/60 font-bold border-b border-secondary">
                  <tr>
                    <th className="px-6 py-4">Chemical ID</th>
                    <th className="px-6 py-4">Ingredient Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Safety Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/50">
                  {displayItems.map(item => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-dark/50">{item.id}</td>
                      <td className="px-6 py-4 font-bold text-dark">{item.name}</td>
                      <td className="px-6 py-4 text-dark/70 font-medium">{item.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${item.type === 'toxic' ? 'bg-red-50 text-red-700 border-red-200' :
                            item.type === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-secondary/50 text-dark/60 border-secondary/80'
                          }`}>
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {displayItems.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-dark/40 font-medium">
                        No matching chemicals found in the index.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
