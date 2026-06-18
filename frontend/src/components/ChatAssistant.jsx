import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Trash2, Copy, Check, Sparkles, User } from "lucide-react";
import { API_BASE_URL } from "../config";

// 🧪 Custom Inline Highlight & Format Parser
const FormattedMessage = ({ text, isUser = false }) => {
  if (!text) return null;
  const lines = text.split("\n");
  
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        const isBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•");
        if (isBullet) {
          trimmed = trimmed.replace(/^[-*•]\s*/, "");
        }
        
        const parseInline = (str) => {
          if (!str) return "";
          const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
          return parts.map((part, pIdx) => {
            if (part && part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pIdx} className={`font-extrabold ${isUser ? "text-primary font-black" : "text-dark"}`}>{part.slice(2, -2)}</strong>;
            }
            if (part && part.startsWith("`") && part.endsWith("`")) {
              return (
                <span key={pIdx} className={`px-1.5 py-0.5 border rounded font-mono text-xs ${isUser ? "bg-white/20 border-white/30 text-primary" : "bg-accent/10 border-accent/20 text-accent"}`}>
                  {part.slice(1, -1)}
                </span>
              );
            }
            return part;
          });
        };

        if (isBullet) {
          return (
            <div key={idx} className="flex gap-2 items-start pl-2">
              <span className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${isUser ? "bg-white/80" : "bg-accent"}`} />
              <span className={`text-sm ${isUser ? "text-primary/95" : "text-dark/95"}`}>{parseInline(trimmed)}</span>
            </div>
          );
        }
        
        return <p key={idx} className={`text-sm leading-relaxed ${isUser ? "text-primary/95" : "text-dark/95"}`}>{parseInline(line)}</p>;
      })}
    </div>
  );
};

const TypingBubble = ({ content, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const safeContent = content || "";
    const intervalId = setInterval(() => {
      setDisplayedText(safeContent.slice(0, i + 1));
      i++;
      if (i >= safeContent.length) {
        clearInterval(intervalId);
        onComplete();
      }
    }, 12);
    return () => clearInterval(intervalId);
  }, [content]);

  return <FormattedMessage text={displayedText} />;
};

export default function ChatAssistant({ scannedIngredients = [], scanResult = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isLoading, isOpen]);

  // Starter prompt suggestion lists based on state
  const hasScanned = scanResult && scannedIngredients.length > 0;
  const starterChips = hasScanned
    ? [
        { label: "🔍 Summarize Hazards", prompt: "What are the high-risk safety hazards identified in this product?" },
        { label: "💡 Safe Alternatives", prompt: "Suggest some safe, clean alternatives to the flagged toxic ingredients." },
        { label: "👶 Is this baby-safe?", prompt: "Is this product formula safe to use for infants or young children?" },
      ]
    : [
        { label: "🧴 Cosmetic Hazards", prompt: "What are the most common toxic chemicals found in bathing soaps and facewashes?" },
        { label: "🧬 Endocrine Disruptors", prompt: "What are endocrine disruptors, and which ingredients list them?" },
        { label: "🍫 Soya Lecithin Info", prompt: "What is Soya Lecithin and is it safe to consume in packaged foods?" },
      ];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = messageText;
    setInput("");
    setIsLoading(true);

    const updatedHistory = [...history, { role: "user", content: userMessage }];
    setHistory(updatedHistory);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: history.map(m => ({ role: String(m.role || ""), content: String(m.content || "") })),
          scanned_ingredients: scannedIngredients,
          analysis_results: scanResult,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.reply) {
        throw new Error("Server error or invalid response format.");
      }

      setHistory([...updatedHistory, { role: "assistant", content: data.reply, isTyping: true }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setHistory([...updatedHistory, { role: "assistant", content: "Failed to connect to the assistant server.", isTyping: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the conversation history?")) {
      setHistory([]);
    }
  };

  const isTypingLock = history.some(m => m.isTyping);
  const isDisabled = isLoading || isTypingLock;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 px-6 py-3.5 rounded-full bg-gradient-to-r from-dark to-slate-800 text-primary shadow-[0_4px_24px_rgba(15,23,42,0.25)] hover:scale-105 transition-all duration-300 font-extrabold flex items-center gap-2.5 z-50 border border-slate-700"
        >
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          Ask LabelSpy AI
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-primary shadow-2xl border-l border-slate-200 z-[999] flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-dark border border-slate-200 shadow-sm">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-extrabold text-dark text-sm leading-tight">Safety Analyst AI</h3>
                <p className="text-[11px] text-dark/60 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {hasScanned
                    ? `Context loaded: ${scannedIngredients.length} ingredients`
                    : "Ready to assist"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  title="Clear Chat History"
                  className="p-2 text-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-dark/40 hover:text-dark hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages view list */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-primary/60">
            {history.length === 0 && (
              <div className="my-auto text-center px-4">
                <div className="w-14 h-14 bg-accent/10 border border-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Bot className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-dark text-sm mb-1.5">Consult LabelSpy AI</h4>
                <p className="text-xs text-dark/60 leading-relaxed max-w-xs mx-auto mb-6 font-medium">
                  Ask me scientific details about ingredients, safety hazards, toxicity indexes, or clean alternative products.
                </p>
                
                {/* Starter Chips Grid */}
                <div className="flex flex-col gap-2 max-w-sm mx-auto">
                  <span className="text-[10px] text-dark/40 font-bold uppercase tracking-wider block text-left mb-1 pl-1">
                    Quick suggestions
                  </span>
                  {starterChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(chip.prompt)}
                      disabled={isDisabled}
                      className="text-left px-3 py-2.5 rounded-xl border border-slate-200 hover:border-accent bg-slate-50 hover:bg-accent/[0.02] text-xs font-semibold text-dark/80 hover:text-accent transition-all duration-200 shadow-sm flex items-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-75" />
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {history.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} className={`flex items-start gap-2.5 max-w-[88%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>
                  {/* Icon Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                    isUser ? "bg-dark text-primary border-slate-800" : "bg-slate-50 text-accent border-slate-200"
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`relative group p-3.5 rounded-2xl ${
                    isUser
                      ? "bg-dark text-primary rounded-tr-none border border-slate-800 shadow-md font-semibold text-sm"
                      : "bg-slate-100/90 text-dark rounded-tl-none border border-slate-200/80 text-sm"
                  }`}>
                    {msg.isTyping ? (
                      <TypingBubble
                        content={msg.content}
                        onComplete={() => {
                          setHistory(prev => {
                            const copy = [...prev];
                            copy[idx].isTyping = false;
                            return copy;
                          });
                        }}
                      />
                    ) : (
                      <FormattedMessage text={msg.content} isUser={isUser} />
                    )}

                    {/* Copy action button for assistant responses */}
                    {!isUser && !msg.isTyping && (
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-slate-50 border border-slate-200 text-dark/50 hover:text-dark rounded transition-all shadow-sm"
                        title="Copy Response"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200/60 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dark/40 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-dark/40 animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-dark/40 animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendSubmit} className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isDisabled}
              placeholder={isDisabled ? "AI Analyst thinking..." : "Ask about chemical safety..."}
              className="flex-1 px-4 py-3 bg-primary border border-slate-200 rounded-xl text-xs sm:text-sm text-dark placeholder-dark/40 focus:outline-none focus:ring-1.5 focus:ring-accent focus:border-accent transition-all disabled:opacity-60 font-semibold"
            />
            <button
              type="submit"
              disabled={isDisabled || !input.trim()}
              className="px-4 py-3 bg-dark hover:bg-slate-800 text-primary rounded-xl disabled:opacity-50 disabled:bg-slate-200 disabled:text-dark/40 transition-all shadow-sm flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4 text-accent" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
