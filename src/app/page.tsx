import {
  ArrowRight,
  Globe,
  MessageCircle,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import FeaturesGrid from "@/components/ui/homeFeatureSection/FeaturesGrid";
import TeamGrid from "@/components/ui/homeTeamSection/TeamGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-lg rotate-6" />
            <div className="absolute inset-0 w-9 h-9 bg-gradient-to-tr from-emerald-400 to-blue-400 rounded-lg -rotate-6" />
          </div>
          <span className="text-2xl font-light tracking-tight">Adaptly</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/70">
              Powered by Gemini Nano
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-extralight tracking-tight leading-[1.1]">
            Navigate any language
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              with confidence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
            Understand foreign documents instantly and craft perfect responses.
            Built for migrants, expats, and international students.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <Link
              href="/workspace"
              className="group px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl shadow-white/10"
            >
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {/* <button className="px-8 py-4 bg-white/5 text-white rounded-full font-medium hover:bg-white/10 transition-all border border-white/10">
              See how it works
            </button> */}
          </div>

          {/* Demo Preview */}
          <div className="pt-16">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 blur-3xl -z-10" />

              {/* Preview Card */}
              <div className="bg-[#111111] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-[#1a1a1a] px-6 py-4 border-b border-white/5 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded-full w-3/4" />
                      <div className="h-3 bg-white/5 rounded-full w-full" />
                      <div className="h-3 bg-white/5 rounded-full w-2/3" />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded-full w-2/3" />
                      <div className="h-3 bg-white/5 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extralight mb-4">
            How it works
          </h2>
          <p className="text-white/50 text-lg font-light">
            Three simple steps to understanding any document
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection lines */}
          {/* <div className="hidden md:block absolute top-24 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-blue-500/50 via-emerald-500/50 to-purple-500/50" /> */}

          {/* Step 1 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-white/10 flex items-center justify-center relative z-10">
                  <Upload className="w-10 h-10 text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-sm font-medium">
                  1
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Upload Document</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Drop any document or paste text in any language. We support
                  PDFs, images, and more.
                </p>
              </div>
              {/* Mock screen */}
              <div className="w-full p-4 rounded-xl bg-[#111111] border border-white/10">
                <div className="aspect-video rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                    <p className="text-xs text-white/40">Drop file here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-white/10 flex items-center justify-center relative z-10">
                  <Sparkles className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-sm font-medium">
                  2
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">AI Analysis</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Our AI instantly analyzes and translates your document with
                  contextual understanding.
                </p>
              </div>
              {/* Mock screen */}
              <div className="w-full p-4 rounded-xl bg-[#111111] border border-white/10">
                <div className="aspect-video rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <div className="h-2 bg-emerald-500/30 rounded-full w-24" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-white/5 rounded-full w-full" />
                    <div className="h-1.5 bg-white/5 rounded-full w-5/6" />
                    <div className="h-1.5 bg-white/5 rounded-full w-4/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-white/10 flex items-center justify-center relative z-10">
                  <MessageCircle className="w-10 h-10 text-purple-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-sm font-medium">
                  3
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Get Results</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Receive clear summaries, full translations, and actionable
                  insights instantly.
                </p>
              </div>
              {/* Mock screen */}
              <div className="w-full p-4 rounded-xl bg-[#111111] border border-white/10">
                <div className="aspect-video rounded-lg bg-purple-500/5 border border-purple-500/20 p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-purple-500/20" />
                    <div className="space-y-1 flex-1">
                      <div className="h-1.5 bg-white/5 rounded-full w-full" />
                      <div className="h-1.5 bg-white/5 rounded-full w-4/6" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-500/20" />
                    <div className="space-y-1 flex-1">
                      <div className="h-1.5 bg-white/5 rounded-full w-5/6" />
                      <div className="h-1.5 bg-white/5 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Technology Stack Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extralight mb-4">
            Powered by cutting-edge technology
          </h2>
          <p className="text-white/50 text-lg font-light">
            Built with modern tools for reliability and performance
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Tech 1 */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all text-center">
            <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="currentColor"
                  className="text-blue-400"
                  opacity="0.5"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  className="text-blue-400"
                  strokeWidth="2"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  className="text-blue-400"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-white/70">React</h3>
          </div>

          {/* Tech 2 */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all text-center">
            <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <rect
                  x="6"
                  y="6"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="text-emerald-400"
                  opacity="0.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="currentColor"
                  className="text-emerald-400"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-white/70">Supabase</h3>
          </div>

          {/* Tech 3 */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all text-center">
            <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-white/70">OpenAI</h3>
          </div>

          {/* Tech 4 */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all text-center">
            <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                  stroke="currentColor"
                  className="text-blue-400"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M12 7V17"
                  stroke="currentColor"
                  className="text-blue-400"
                  strokeWidth="2"
                />
                <path
                  d="M7 10L17 10"
                  stroke="currentColor"
                  className="text-blue-400"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-white/70">TypeScript</h3>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extralight mb-4">
            Meet the team
          </h2>
          <p className="text-white/50 text-lg font-light">
            Passionate about breaking language barriers
          </p>
        </div>

        <TeamGrid />
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 blur-3xl" />
          <div className="relative p-16 rounded-3xl bg-[#111111] border border-white/10 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-extralight">
              Ready to get started?
            </h2>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
              Join thousands of migrants, expats, and students who trust Adaptly
              to navigate foreign documents with confidence.
            </p>
            <button
              // onClick={onGetStarted}
              className="group px-10 py-5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl shadow-white/10 mx-auto text-lg"
            >
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-sm font-light">
            Helping you navigate the world, one document at a time.
          </p>
          <div className="flex items-center gap-8 text-sm text-white/40">
            <button className="hover:text-white/60 transition-colors">
              Privacy
            </button>
            <button className="hover:text-white/60 transition-colors">
              Terms
            </button>
            <button className="hover:text-white/60 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
