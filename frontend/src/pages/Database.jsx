import React, { useEffect, useState } from "react";
import { Database as DatabaseIcon, Search } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Database() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
  }, []);

  const filtered = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.category && i.category.toLowerCase().includes(search.toLowerCase()))
  );
  
  const displayItems = search.trim() === "" ? (ingredients.length > 0 ? [ingredients[0]] : []) : filtered;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center border border-accent/20 shadow-sm">
          <DatabaseIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Ingredient Directory</h1>
          <p className="text-xs text-dark/60">Search our reference list of food and cosmetic ingredients.</p>
        </div>
      </div>

      <div className="bg-primary border border-secondary rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-secondary bg-secondary/50 flex items-center gap-3">
          <Search className="w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Search ingredients by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-dark placeholder-dark/40 font-medium text-sm"
          />
        </div>

        {!loading && search.trim() === "" && (
          <div className="px-6 py-2.5 border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-dark/50 text-center sm:text-left">
            Showing example ingredient (type in the search box to browse all)
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-dark/45 font-medium flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></span>
              Loading directory...
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-4 space-y-3">
              {displayItems.map(item => (
                <div key={item.id} className="bg-white border border-secondary rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{item.name}</h3>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">{item.category}</span>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${
                      item.type === 'toxic' ? 'bg-red-50 text-red-700 border-red-200' :
                      item.type === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600/90 leading-relaxed font-semibold border-t border-slate-100 pt-2">
                    {item.profile || "No description available."}
                  </p>
                </div>
              ))}
              {displayItems.length === 0 && (
                <div className="py-12 text-center text-dark/40 font-medium">
                  No matching ingredients found.
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/35 text-slate-800/80 font-black border-b border-secondary tracking-wider uppercase">
                  <tr>
                    <th className="px-6 py-4 w-1/4">Ingredient</th>
                    <th className="px-6 py-4 w-1/6">Safety Rating</th>
                    <th className="px-6 py-4">Safety Profile Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/50 font-semibold text-slate-700">
                  {displayItems.map(item => (
                    <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 text-sm block">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mt-0.5">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${
                          item.type === 'toxic' ? 'bg-red-50 text-red-700 border-red-200' :
                          item.type === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600/90 leading-relaxed text-xs max-w-md">
                        {item.profile || "No description available."}
                      </td>
                    </tr>
                  ))}
                  {displayItems.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-dark/40 font-medium">
                        No matching ingredients found in the directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
