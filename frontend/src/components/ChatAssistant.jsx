import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { API_BASE_URL } from "../config";

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
    }, 15);
    return () => clearInterval(intervalId);
  }, [content]);

  return <>{displayedText}</>;
};

export default function ChatAssistant({ scannedIngredients = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    const updatedHistory = [...history, { role: "user", content: userMessage }];
    setHistory(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: history.map(m => ({ role: String(m.role || ""), content: String(m.content || "") })),
          scanned_ingredients: scannedIngredients,
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

  const isTypingLock = history.some(m => m.isTyping);
  const isDisabled = isLoading || isTypingLock;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 px-5 py-3 rounded-full bg-dark text-primary shadow-[0_4px_20px_rgba(39,35,67,0.3)] hover:bg-dark/90 hover:scale-105 transition-all duration-300 font-bold flex items-center gap-2 z-50"
        >
          <MessageSquare className="w-5 h-5" />
          Ask LabelSpy AI
        </button>
      )}

      {isOpen && (
        <div className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-primary shadow-2xl border-l border-secondary z-[999] flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-secondary bg-secondary/50 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg text-dark border border-secondary shadow-sm">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-dark leading-tight">Safety Analyst AI</h3>
                <p className="text-xs text-dark/60 font-medium">
                  {scannedIngredients.length > 0
                    ? `Context loaded: ${scannedIngredients.length} ingredients`
                    : "Ready to assist"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-dark/40 hover:text-dark hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-primary">
            {history.length === 0 && (
              <div className="text-center my-8">
                <div className="w-16 h-16 bg-secondary/50 border border-secondary text-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Bot className="w-8 h-8 text-accent" />
                </div>
                <p className="text-sm text-dark/60 leading-relaxed px-4 font-medium">
                  Hello! I'm LabelSpy AI. Ask me for deeper details about your scanned ingredients, safe alternatives, or general product safety.
                </p>
              </div>
            )}

            {history.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-4 text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-dark text-primary self-end rounded-2xl rounded-br-sm shadow-md font-medium'
                  : 'bg-secondary text-dark/90 self-start rounded-2xl rounded-bl-sm border border-accent/20'
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
                  msg.content
                )}
              </div>
            ))}

            {isLoading && (
              <div className="bg-secondary p-4 rounded-2xl rounded-bl-sm self-start flex gap-1.5 items-center border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-dark/40 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-dark/40 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 rounded-full bg-dark/40 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-secondary bg-primary flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isDisabled}
              placeholder={isDisabled ? "AI is processing..." : "Ask a question..."}
              className="flex-1 px-4 py-3 bg-secondary/50 border border-secondary rounded-xl text-sm text-dark placeholder-dark/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-60 font-medium"
            />
            <button
              type="submit"
              disabled={isDisabled || !input.trim()}
              className="px-4 py-3 bg-dark text-primary rounded-xl hover:bg-dark/90 disabled:opacity-50 disabled:bg-secondary disabled:text-dark/40 transition-all shadow-sm flex items-center justify-center"
            >
              <Send className="w-4 h-4 text-accent" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
