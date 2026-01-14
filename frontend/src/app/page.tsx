"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Shield, FileCheck, Zap, ChevronRight, Globe2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleLaunchApp = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const tl = gsap.timeline();
    
    // Animate the transition overlay
    tl.to(transitionRef.current, {
      clipPath: "circle(150% at 50% 50%)",
      duration: 1.2,
      ease: "power4.inOut",
    })
    .to(".transition-logo", {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.8")
    .to(".transition-text", {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.3")
    .to(".transition-loader", {
      width: "100%",
      duration: 0.8,
      ease: "power2.inOut",
    }, "-=0.2")
    .call(() => {
      router.push("/home");
    }, [], "+=0.3");
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.fromTo(".hero-line", { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.3 });
    gsap.fromTo(".hero-sub", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" });
    gsap.fromTo(".hero-cta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.1, ease: "power2.out" });
    gsap.fromTo(".stat-item", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 1.3, ease: "power2.out" });

    if (marqueeRef.current) {
      const mc = marqueeRef.current.querySelector(".marquee-content");
      if (mc) gsap.to(mc, { x: "-50%", duration: 20, ease: "none", repeat: -1 });
    }

    gsap.utils.toArray(".reveal-section").forEach((section) => {
      const el = section as HTMLElement;
      gsap.fromTo(el.querySelectorAll(".reveal-item"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" } });
    });
  }, { scope: containerRef });

  const stats = [
    { value: "$2.1T", label: "RWA Market", sub: "By 2030 (projected)" },
    { value: "92%", label: "Trust Score", sub: "AI verification" },
    { value: "<$0.01", label: "Gas Fees", sub: "On Celo L2" },
    { value: "Real-time", label: "Oracle Feed", sub: "Yahoo Finance" },
  ];

  const features = [
    { icon: FileCheck, title: "Proof of Reserve", desc: "AI-powered document analysis extracts issuer, face value, maturity & CUSIP from bond PDFs." },
    { icon: Zap, title: "Live Oracle Feed", desc: "Real-time 10Y Treasury yield from Yahoo Finance anchors fair value on-chain." },
    { icon: Shield, title: "Celo Settlement", desc: "Mint verified RWA tokens on Celo Sepolia with immutable proof of authenticity." },
  ];

  const steps = [
    { step: "01", title: "Upload", desc: "Upload your bond certificate PDF for AI analysis.", code: "// Bond PDF → IPFS → AI Analysis" },
    { step: "02", title: "Verify", desc: "Llama 3.3 extracts metadata & generates trust score.", code: "// Groq AI + Yahoo Finance Oracle" },
    { step: "03", title: "Mint", desc: "Create on-chain RWA token with verified proof.", code: "// Celo Sepolia → NFT Receipt" },
  ];

  const footerLinks = [
    { title: "Product", links: ["Platform", "Pricing", "Changelog", "Integrations"] },
    { title: "Developers", links: ["Documentation", "API Reference", "SDKs", "Status"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
  ];

  return (
    <div ref={containerRef} className="bg-[#030712] text-white min-h-screen antialiased">
      <nav className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
        <div 
          className="relative flex items-center gap-1 w-full max-w-5xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 rounded-2xl blur-xl opacity-60"></div>
          
          <Link 
            href="/" 
            className="relative flex items-center gap-2 sm:gap-2.5 px-2 sm:px-4 py-2 rounded-xl hover:bg-white/[0.08] transition-all duration-300 group"
          >
            <div className="relative w-6 h-6 sm:w-7 sm:h-7">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg group-hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-shadow duration-300"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <span className="font-semibold text-xs sm:text-sm text-white block leading-tight">VerifiChain</span>
              <span className="hidden sm:block text-[9px] font-mono text-emerald-400 tracking-wider uppercase opacity-70">Trust Engine</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center mx-2">
            <div className="w-px h-6 bg-white/[0.08]"></div>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {["Platform", "Developers", "Docs"].map((item) => (
              <Link 
                key={item} 
                href={"/" + item.toLowerCase()} 
                className="relative px-4 py-2 text-[13px] text-zinc-400 hover:text-white rounded-xl transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">{item}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center mx-2">
            <div className="w-px h-6 bg-white/[0.08]"></div>
          </div>

          <button 
            onClick={handleLaunchApp}
            className="relative ml-auto bg-gradient-to-b from-white to-zinc-100 text-zinc-900 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold hover:from-emerald-400 hover:to-emerald-500 hover:text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(52,211,153,0.4)] overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative flex items-center gap-1.5 sm:gap-2">
              <span className="hidden xs:inline">Launch App</span>
              <span className="xs:hidden">Launch</span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </nav>

      <section ref={heroRef} className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
          <div className="hero-sub flex items-center gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 sm:px-4 py-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 text-[10px] sm:text-xs font-medium tracking-wide">RWA TRUST ENGINE</span>
            </div>
          </div>
          <div className="overflow-hidden mb-4 sm:mb-6"><h1 className="hero-line text-[clamp(2.5rem,8vw,7rem)] font-display leading-[0.95] tracking-tight"><span className="text-white">Tokenize</span></h1></div>
          <div className="overflow-hidden mb-4 sm:mb-6"><h1 className="hero-line text-[clamp(2.5rem,8vw,7rem)] font-display leading-[0.95] tracking-tight"><span className="text-zinc-500">real-world</span><span className="text-white italic ml-2 sm:ml-4">assets</span></h1></div>
          <div className="overflow-hidden mb-8 sm:mb-12"><h1 className="hero-line text-[clamp(2.5rem,8vw,7rem)] font-display leading-[0.95] tracking-tight"><span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">with trust.</span></h1></div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-10 mb-12 sm:mb-20">
            <p className="hero-sub text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed font-light">AI-powered verification for bonds and securities. Proof of Reserve meets on-chain transparency. <span className="text-white">Built on Celo. Verified by Llama 3.</span></p>
            <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Link href="/home" className="group flex items-center justify-center gap-3 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-emerald-400 transition-all w-full sm:w-auto text-sm sm:text-base"><span>Try Demo</span><ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></Link>
              <Link href="/home" className="flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors px-6 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base"><span>How It Works</span><ChevronRight className="w-4 h-4" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-zinc-800/50">
            {stats.map((stat, i) => (<div key={i} className="stat-item"><div className="text-2xl md:text-3xl font-display text-white mb-1">{stat.value}</div><div className="text-sm text-zinc-400">{stat.label}</div><div className="text-xs text-zinc-600 font-mono">{stat.sub}</div></div>))}
          </div>
        </div>
      </section>

      <div ref={marqueeRef} className="border-y border-zinc-800/50 bg-zinc-900/30 py-4 overflow-hidden">
        <div className="marquee-content flex items-center gap-12 whitespace-nowrap">
          {[0, 1].map((i) => (<div key={i} className="flex items-center gap-12">{["PROOF OF RESERVE", "AI VERIFICATION", "ORACLE FEEDS", "CELO SETTLEMENT", "BOND TOKENIZATION"].map((item, j) => (<div key={j} className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div><span className="text-xs font-mono text-zinc-500 tracking-widest">{item}</span></div>))}</div>))}
        </div>
      </div>

      <section className="reveal-section py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20">
          <div className="reveal-item">
            <div className="text-[10px] sm:text-xs font-mono text-emerald-400 tracking-widest mb-4 sm:mb-6">THE PROBLEM</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white leading-tight mb-6 sm:mb-8">The Trust Gap in RWA tokenization.</h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-6 sm:mb-8">Anyone can claim they&apos;re tokenizing a &quot;$1M bond&quot; — but how do you know it&apos;s real? Traditional finance demands proof, blockchain needs oracles.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">{["No Custody Proof", "No Fair Value", "No Audit Trail"].map((item, i) => (<div key={i} className="flex items-center gap-2 text-orange-400"><div className="w-3 h-3 border-2 border-orange-400 rounded-full"></div><span>{item}</span></div>))}</div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {features.map((item, i) => (<div key={i} className="reveal-item group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer"><div className="flex items-start gap-5"><div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><item.icon className="w-5 h-5 text-emerald-400" /></div><div><h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3><p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p></div></div></div>))}
          </div>
        </div>
      </section>

      <section className="reveal-section py-16 sm:py-24 md:py-32 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div><div className="reveal-item text-[10px] sm:text-xs font-mono text-emerald-400 tracking-widest mb-3 sm:mb-4">HOW IT WORKS</div><h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-display text-white">Three simple steps.</h2></div>
            <p className="reveal-item text-sm sm:text-base text-zinc-500 max-w-md">From PDF to on-chain asset in under 60 seconds.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((item, i) => (<div key={i} className="reveal-item group"><div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 h-full hover:border-emerald-500/30 transition-colors relative"><div className="text-5xl sm:text-6xl md:text-7xl font-display text-zinc-800 absolute top-3 right-3 sm:top-4 sm:right-4 select-none">{item.step}</div><div className="relative z-10"><h3 className="text-xl sm:text-2xl font-display text-white mb-3 sm:mb-4">{item.title}</h3><p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{item.desc}</p><div className="bg-black/50 rounded-lg p-3 sm:p-4 font-mono text-[10px] sm:text-xs text-emerald-400 border border-zinc-800 overflow-x-auto">{item.code}</div></div></div></div>))}
          </div>
        </div>
      </section>

      <section className="reveal-section py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 border border-zinc-800 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-16">
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
              <div>
                <div className="reveal-item text-[10px] sm:text-xs font-mono text-emerald-400 tracking-widest mb-4 sm:mb-6">BUILT ON CELO</div>
                <h2 className="reveal-item text-2xl sm:text-3xl md:text-4xl font-display text-white leading-tight mb-4 sm:mb-6">Carbon-negative settlement for real-world assets.</h2>
                <p className="reveal-item text-sm sm:text-base text-zinc-400 leading-relaxed mb-6 sm:mb-8">Ultra-low gas fees make RWA tokenization accessible. Every verification is permanently anchored on-chain.</p>
                <div className="reveal-item flex flex-wrap items-center gap-4 sm:gap-6"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /><span className="text-xs sm:text-sm text-zinc-400">Celo Sepolia</span></div><div className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-emerald-400" /><span className="text-xs sm:text-sm text-zinc-400">Carbon negative</span></div></div>
              </div>
              <div className="reveal-item relative">
                <div className="aspect-square bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl border border-emerald-500/10 flex items-center justify-center">
                  <div className="relative"><div className="w-48 h-48 border border-zinc-800 rounded-full flex items-center justify-center relative"><div className="w-32 h-32 border border-emerald-500/20 rounded-full flex items-center justify-center"><div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center"><Shield className="w-6 h-6 text-emerald-400" /></div></div><div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div><div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-2 h-2 bg-amber-400 rounded-full"></div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section py-16 sm:py-24 md:py-32 px-4 sm:px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal-item text-[10px] sm:text-xs font-mono text-emerald-400 tracking-widest mb-4 sm:mb-6">READY TO START?</div>
          <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6 sm:mb-8 leading-tight px-4">Tokenize your first asset today.</h2>
          <p className="reveal-item text-zinc-400 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-4">Upload a bond PDF, get AI verification, and mint on-chain — all in one flow.</p>
          <div className="reveal-item flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link href="/home" className="group flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3.5 sm:py-4 rounded-full font-semibold transition-all w-full sm:w-auto text-sm sm:text-base"><span>Launch App</span><ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></Link>
            <Link href="/home" className="flex items-center justify-center gap-2 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-8 py-3.5 sm:py-4 rounded-full transition-all w-full sm:w-auto text-sm sm:text-base"><span>View Demo</span></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-black" strokeWidth={2.5} /></div><div><div className="text-white font-display text-lg tracking-tight">VerifiChain</div><div className="text-emerald-400 text-[10px] font-mono tracking-widest -mt-1">TRUST LAYER</div></div></div>
              <p className="text-sm text-zinc-500 leading-relaxed">The RWA trust layer. AI-powered verification for tokenized real-world assets on Celo.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {footerLinks.map((group, i) => (<div key={i}><div className="text-white font-semibold text-sm mb-4">{group.title}</div><ul className="space-y-3">{group.links.map((link, j) => (<li key={j}><Link href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">{link}</Link></li>))}</ul></div>))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-zinc-800/50 text-xs text-zinc-600"><div>2026 VerifiChain. Built on Celo.</div><div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div><span className="text-zinc-500">All systems operational</span></div></div>
        </div>
      </footer>

      {/* Page Transition Overlay */}
      <div
        ref={transitionRef}
        className="fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        {/* Ambient layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.06),transparent_35%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:120px_120px] opacity-40"></div>

        {/* Center logo with ring */}
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/15 blur-3xl" aria-hidden></div>
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-[2px] shadow-[0_20px_60px_rgba(16,185,129,0.35)]">
              <div className="w-full h-full rounded-3xl bg-[#030712] flex items-center justify-center">
                <div className="transition-logo w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center opacity-0 scale-50">
                  <Shield className="w-8 h-8 text-black" strokeWidth={2.5} />
                </div>
              </div>
              {/* rotating ring */}
              <div className="absolute -inset-3 rounded-[32px] border border-emerald-400/30 animate-spin-slow" aria-hidden></div>
              <div className="absolute -inset-5 rounded-[38px] border border-cyan-400/15 animate-spin-slower" aria-hidden></div>
            </div>
          </div>

          {/* Text stack */}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="overflow-hidden">
              <div className="transition-text text-2xl sm:text-3xl font-display text-white opacity-0 translate-y-8">
                Initializing
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="transition-text text-sm sm:text-base font-mono text-emerald-300 opacity-0 translate-y-8">
                VerifiChain Platform
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-56 sm:w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className="transition-loader h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 rounded-full" style={{ width: "0%" }}></div>
          </div>

          {/* Status list */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-zinc-500 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Connecting to Celo Sepolia</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Syncing Oracle</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <span>Loading UI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
