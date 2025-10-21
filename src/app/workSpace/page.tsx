"use client";

import { useState } from "react";
import { parseTxtFile, parsePdfFile, parseDocxFile } from "@/lib/fileParsers";
import { processDocument } from "@/lib/understand";
import {
  Upload,
  ArrowLeft,
  FileText,
  Sparkles,
  Languages,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import ChatDrawer from "@/components/chatbot/ChatDrawer";
import ReactMarkdown from "react-markdown";

export default function WorkspacePage() {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [sourceExpanded, setSourceExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [proTips, setProTips] = useState<string | null>(null);
  const [translatedLang, setTranslatedLang] = useState<string | null>(null);

  // state to track the language user intends to translate to
  const [userLang, setUserLang] = useState<string | "en">("en");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setInputText: (text: string) => void,
    setFileName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    setFileName(file.name);

    // console.log("Uploading:", fileName, "Type:", fileType);

    try {
      let text = "";

      if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        text = await parseTxtFile(file);
      } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        text = await parsePdfFile(file);
      } else if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
      ) {
        text = await parseDocxFile(file);
      } else if (fileName.endsWith(".doc")) {
        alert("Legacy .doc files are not supported. Please convert to .docx.");
        return;
      } else if (fileType.startsWith("image/")) {
        alert("OCR for images is coming soon. Please upload text or PDFs.");
        return;
      } else {
        alert("Unsupported file type. Please use PDF, DOCX, or TXT files.");
        return;
      }

      if (text.trim()) {
        setInputText(text);
        // console.log("Extracted:", text.substring(0, 200) + "...");
      } else {
        alert("No readable text found in this file.");
      }
    } catch (err) {
      console.error("File parsing failed:", err);
      alert("Failed to extract text. Try another file format.");
    }
  };

  const handleUnderstand = async () => {
    if (!inputText.trim() && !fileName)
      return alert("Please upload a document or paste text.");
    setShowResults(true);
    setLoading(true);

    // passing users intended language as the second prop
    const result = await processDocument(inputText, userLang);
    if (result) {
      setTranslatedLang(result.translatedLang);
      setActionPlan(result.planEnglish);
      setProTips(result.tipsEnglish);
      console.log("result in workspace.tsx: ", result);
      console.log("translated lang in workspace.tsx: ", result.translatedLang);
      console.log("action plan in workspace.tsx: ", result.planEnglish);
      console.log("pro tips in workspace.tsx: ", result.tipsEnglish);
    }
    setLoading(false);
    setSourceExpanded(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-md rotate-6" />
                <div className="absolute inset-0 w-7 h-7 bg-gradient-to-tr from-emerald-400 to-blue-400 rounded-md -rotate-6" />
              </div>
              <span className="text-lg font-light tracking-tight">Adaptly</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                chatOpen
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Ask questions</span>
            </button>
            {/* <button className="text-sm text-white/60 hover:text-white/80 transition-colors">
              History
            </button> */}
          </div>
        </div>
      </header>

      {/* Main Content with Chat Drawer */}
      <div className="flex max-w-7xl mx-auto">
        {/* Main Workspace */}
        <main
          className={`flex-1 px-6 py-12 space-y-8 transition-all duration-300 ${
            chatOpen ? "mr-96" : ""
          }`}
        >
          {/* Source Document Section */}
          <div className="space-y-4">
            {!showResults ? (
              <>
                {/* Upload Area */}
                <div className="group relative">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) =>
                      handleFileUpload(e, setInputText, setFileName)
                    }
                  />
                  {fileName && <p>Uploaded: {fileName}</p>}
                  <label
                    htmlFor="file-upload"
                    className="block p-12 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <div className="text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                        <Upload className="w-7 h-7 text-white/40" />
                      </div>
                      <div>
                        <p className="text-white/70 font-light">
                          Drop your document here or click to browse
                        </p>
                        <p className="text-sm text-white/40 mt-1">
                          PDF, DOC, TXT, or images
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-white/40 font-light">
                    or paste text
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Text Input */}
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste the text you want to understand..."
                    className="w-full h-48 px-6 py-5 bg-[#111111] border border-white/10 rounded-2xl focus:outline-none focus:border-white/20 resize-none text-white/90 placeholder:text-white/30 font-light transition-colors"
                  />
                </div>

                {/* Language Selection Row */}
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-white/50 mb-2 font-light">
                      Document language
                    </label>
                    <select className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white/90 appearance-none cursor-pointer hover:border-white/20 transition-colors font-light">
                      <option>Auto-detect</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                      <option value="pt">Portuguese</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-white/50 mb-2 font-light">
                      Your language
                    </label>
                    <select
                      className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white/90 appearance-none cursor-pointer hover:border-white/20 transition-colors font-light"
                      onChange={(e) => setUserLang(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                      <option value="pt">Portuguese</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>
                  <button
                    onClick={handleUnderstand}
                    className="px-10 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-100 flex items-center gap-2 shadow-lg bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25"
                  >
                    <Sparkles className="w-4 h-4" />
                    Understand
                  </button>
                </div>
              </>
            ) : (
              /* Collapsed Source */
              <div className="border border-white/10 rounded-2xl bg-[#111111] overflow-hidden">
                <button
                  onClick={() => setSourceExpanded(!sourceExpanded)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white/60" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-light text-white/90">
                        {fileName || "Pasted text"}
                      </p>
                      <p className="text-xs text-white/40">Source document</p>
                    </div>
                  </div>
                  {sourceExpanded ? (
                    <ChevronUp className="w-5 h-5 text-white/40" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  )}
                </button>

                {sourceExpanded && (
                  <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-6">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 max-h-64 overflow-y-auto">
                      <p className="text-white/60 text-sm font-light leading-relaxed">
                        {inputText || "Your uploaded document content..."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm">
                        Replace document
                      </button>
                      <button
                        onClick={handleUnderstand}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Re-analyze
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6 animate-in">
              {/* Summary Card */}
              <div className="p-8 rounded-2xl bg-[#111111] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">Summary</h3>
                    <p className="text-sm text-white/40 font-light">
                      Key points in plain language
                    </p>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  {/* <p className="text-white/70 leading-relaxed font-light"></p> */}
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white/60">
                        Generating action plan...
                      </span>
                    </div>
                  ) : actionPlan ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-white/70 prose-strong:text-white prose-ul:text-white/70 prose-li:text-white/70">
                      <ReactMarkdown>{actionPlan}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-white/50 italic">
                      No action plan generated yet. Click &quot;Understand&quot;
                      to analyze your document.
                    </p>
                  )}
                </div>
              </div>

              {/* Translation Card */}
              <div className="p-8 rounded-2xl bg-[#111111] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Languages className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">
                      Full Translation
                    </h3>
                    <p className="text-sm text-white/40 font-light">
                      Complete text in your language
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-white/60 leading-relaxed font-light">
                    The complete translation will appear here, preserving the
                    original structure and meaning while making it fully
                    accessible in your preferred language. You can copy it and
                    use it as needed.
                  </p>
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Suggested Actions
                    </h3>
                    <p className="text-white/60 font-light leading-relaxed">
                      Based on this document, here are the recommended next
                      steps you should consider taking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Chat Drawer */}
        <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}
