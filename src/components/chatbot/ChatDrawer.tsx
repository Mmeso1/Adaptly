"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Sparkles, Send, Loader2 } from "lucide-react";
import {
  initChatSession,
  askQuestion,
  destroyChatSession,
} from "@/lib/ai/chatSession";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const placeholder = "Ask me anything about your document...";
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [documentContext, setDocumentContext] = useState<string | null>(null);
  const [userLang, setUserLang] = useState<string>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const context = localStorage.getItem("documentContext");
      const language = localStorage.getItem("userLang") || "en";

      setDocumentContext(context);
      setUserLang(language);
    }
  }, []);

  useEffect(() => {
    if (documentContext) {
      initChatSession(documentContext, userLang);
    }

    return () => destroyChatSession();
  }, [documentContext]);

  const showToast = (message: string, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const handleSendMessage = async () => {
    if (!documentContext || documentContext.trim().length === 0) {
      showToast("⏳ Please wait — I’m still reading your document summary.");
      return;
    }

    if (!chatMessage || !chatMessage.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: chatMessage };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatMessage("");
    setChatLoading(true);

    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setChatHistory((prev) => [...prev, assistantMsg]);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      let lastUpdate = 0;
      await askQuestion(
        chatMessage,
        (chunk) => {
          const now = Date.now();
          if (now - lastUpdate > 100) {
            setChatHistory((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (updated[lastIndex]?.role === "assistant") {
                updated[lastIndex] = { ...updated[lastIndex], content: chunk };
              }
              return updated;
            });
            lastUpdate = now;
          }
        },
        controller.signal
      );
    } catch (error) {
      if ((error as any).name === "AbortError") {
        console.log("Chat generation stopped by user.");
      } else {
        console.error(error);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ Sorry, something went wrong. The model might not be ready or available yet.",
          },
        ]);
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <aside
      className={`fixed right-0 top-0 h-screen w-[440px] bg-[#0A0A0A] border-l border-white/10 transform transition-transform duration-300 z-30 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            {/* <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-xs text-white/40">{subtitle}</p>
            </div> */}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/40 text-sm font-light">
                Ask me anything about your document
              </p>
            </div>
          ) : (
            chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles
                      className={`w-4 h-4 text-blue-400 ${
                        chatLoading ? "animate-pulse" : ""
                      }`}
                    />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white/5 border border-white/10 text-white/80"
                  }`}
                >
                  <p className="text-sm font-light leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 bg-[#111111] border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white/90 placeholder:text-white/30 text-sm font-light"
            />
            {chatLoading ? (
              <button
                onClick={() => abortController?.abort()}
                className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 
               border border-red-500/20 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || !documentContext}
                className="w-12 h-12 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 text-white/90 px-4 py-3 rounded-xl text-sm backdrop-blur-md shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}
    </aside>
  );
}
