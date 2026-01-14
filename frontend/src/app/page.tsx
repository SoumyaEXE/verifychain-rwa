"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Shield, Fingerprint, FileCheck, Zap, ChevronRight, Lock, Globe2 } from "lucide-react";

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
    { value: "2.4M+", label: "Verifications", sub: "All time" },
    { value: "<$0.001", label: "Per Proof", sub: "Avg. cost" },
    { value: "340ms", label: "Latency", sub: "P95 response" },
    { value: "99.99%", label: "Uptime", sub: "Last 12 months" },
  ];

  const features = [
    { icon: Fingerprint, title: "Immutable Fingerprints", desc: "SHA-256 hash of every AI input/output, timestamped on-chain." },
    { icon: Lock, title: "Zero Data Exposure", desc: "Client-side hashing. Your data never leaves your infrastructure." },
    { icon: FileCheck, title: "Audit-Ready Reports", desc: "One-click compliance exports for SOC2, ISO, and regulatory bodies." },
  ];

  const steps = [
    { step: "01", title: "Hash", desc: "Your AI output is hashed client-side using SHA-256.", code: "const hash = await verifi.hash(output)" },
    { step: "02", title: "Anchor", desc: "The hash is anchored to Celo L2 with a timestamp.", code: "const proof = await verifi.anchor(hash)" },
    { step: "03", title: "Verify", desc: "Anyone can verify the proof using just the proof ID.", code: "const valid = await verifi.verify(proofId)" },
  ];

  const footerLinks = [
    { title: "Product", links: ["Platform", "Pricing", "Changelog", "Integrations"] },
    { title: "Developers", links: ["Documentation", "API Reference", "SDKs", "Status"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
  ];

  return (
    <div ref={containerRef} className="bg-[#030712] text-white min-h-screen antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-display text-lg tracking-tight">VerifiChain</div>
              <div className="text-emerald-400 text-[10px] font-mono tracking-widest -mt-1">TRUST LAYER</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
            {["Platform", "Developers", "Enterprise", "Docs"].map((item) => (
              <Link key={item} href={"/" + item.toLowerCase()} className="px-5 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>MAINNET</span>
              <span className="text-zinc-600">|</span>
              <span className="text-emerald-400">{currentTime}</span>
            </div>
            <button 
              onClick={handleLaunchApp}
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="hero-sub flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 text-xs font-medium tracking-wide">NOW ON CELO MAINNET</span>
            </div>
          </div>
          <div className="overflow-hidden mb-6"><h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-display leading-[0.95] tracking-tight"><span className="text-white">Cryptographic</span></h1></div>
          <div className="overflow-hidden mb-6"><h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-display leading-[0.95] tracking-tight"><span className="text-zinc-500">proof for</span><span className="text-white italic ml-4">every</span></h1></div>
          <div className="overflow-hidden mb-12"><h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-display leading-[0.95] tracking-tight"><span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">AI decision.</span></h1></div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <p className="hero-sub text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed font-light">Enterprise-grade verification infrastructure. Anchor AI outputs to immutable on-chain records. <span className="text-white">SOC2 compliant. Zero data exposure.</span></p>
            <div className="hero-cta flex items-center gap-4">
              <Link href="/platform" className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-emerald-400 transition-all"><span>Start Building</span><ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></Link>
              <Link href="/docs" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-6 py-4"><span>Read Docs</span><ChevronRight className="w-4 h-4" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-zinc-800/50">
            {stats.map((stat, i) => (<div key={i} className="stat-item"><div className="text-2xl md:text-3xl font-display text-white mb-1">{stat.value}</div><div className="text-sm text-zinc-400">{stat.label}</div><div className="text-xs text-zinc-600 font-mono">{stat.sub}</div></div>))}
          </div>
        </div>
      </section>

      <div ref={marqueeRef} className="border-y border-zinc-800/50 bg-zinc-900/30 py-4 overflow-hidden">
        <div className="marquee-content flex items-center gap-12 whitespace-nowrap">
          {[0, 1].map((i) => (<div key={i} className="flex items-center gap-12">{["SHA-256 HASHING", "ZERO-KNOWLEDGE PROOFS", "ON-CHAIN ANCHORING", "SOC2 REPORTS", "API ACCESS"].map((item, j) => (<div key={j} className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div><span className="text-xs font-mono text-zinc-500 tracking-widest">{item}</span></div>))}</div>))}
        </div>
      </div>

      <section className="reveal-section py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="reveal-item">
            <div className="text-xs font-mono text-emerald-400 tracking-widest mb-6">THE PROBLEM</div>
            <h2 className="text-4xl md:text-5xl font-display text-white leading-tight mb-8">Your AI systems operate in the dark.</h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">Regulators demand proof. Auditors need trails. Your stakeholders require transparency.</p>
            <div className="flex items-center gap-6 text-sm">{["EU AI Act", "SOC2 Type II", "ISO 27001"].map((item, i) => (<div key={i} className="flex items-center gap-2 text-orange-400"><div className="w-3 h-3 border-2 border-orange-400 rounded-full"></div><span>{item}</span></div>))}</div>
          </div>
          <div className="space-y-4">
            {features.map((item, i) => (<div key={i} className="reveal-item group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer"><div className="flex items-start gap-5"><div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><item.icon className="w-5 h-5 text-emerald-400" /></div><div><h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3><p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p></div></div></div>))}
          </div>
        </div>
      </section>

      <section className="reveal-section py-32 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div><div className="reveal-item text-xs font-mono text-emerald-400 tracking-widest mb-4">HOW IT WORKS</div><h2 className="reveal-item text-4xl md:text-5xl font-display text-white">Three lines of code.</h2></div>
            <p className="reveal-item text-zinc-500 max-w-md">Integrate verification into your existing AI pipeline in under 10 minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((item, i) => (<div key={i} className="reveal-item group"><div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 h-full hover:border-emerald-500/30 transition-colors relative overflow-hidden"><div className="text-7xl font-display text-zinc-800 absolute -top-2 -right-2 select-none">{item.step}</div><div className="relative z-10"><h3 className="text-2xl font-display text-white mb-4">{item.title}</h3><p className="text-zinc-500 text-sm leading-relaxed mb-6">{item.desc}</p><div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-emerald-400 border border-zinc-800">{item.code}</div></div></div></div>))}
          </div>
        </div>
      </section>

      <section className="reveal-section py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 border border-zinc-800 rounded-3xl p-10 md:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="reveal-item text-xs font-mono text-emerald-400 tracking-widest mb-6">BUILT ON CELO</div>
                <h2 className="reveal-item text-3xl md:text-4xl font-display text-white leading-tight mb-6">Carbon-negative infrastructure for compliant enterprises.</h2>
                <p className="reveal-item text-zinc-400 leading-relaxed mb-8">Ultra-low gas fees and mobile-first design make verification accessible at any scale.</p>
                <div className="reveal-item flex items-center gap-6"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /><span className="text-sm text-zinc-400">340ms finality</span></div><div className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-emerald-400" /><span className="text-sm text-zinc-400">Carbon negative</span></div></div>
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

      <section className="reveal-section py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal-item text-xs font-mono text-emerald-400 tracking-widest mb-6">READY TO START?</div>
          <h2 className="reveal-item text-4xl md:text-6xl font-display text-white mb-8 leading-tight">Build verifiable AI systems today.</h2>
          <p className="reveal-item text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">Join the enterprises already using VerifiChain to meet compliance requirements.</p>
          <div className="reveal-item flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-full font-semibold transition-all"><span>Get API Keys</span><ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></Link>
            <Link href="/demo" className="flex items-center gap-2 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-8 py-4 rounded-full transition-all"><span>Book a Demo</span></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-black" strokeWidth={2.5} /></div><div><div className="text-white font-display text-lg tracking-tight">VerifiChain</div><div className="text-emerald-400 text-[10px] font-mono tracking-widest -mt-1">TRUST LAYER</div></div></div>
              <p className="text-sm text-zinc-500 leading-relaxed">The institutional trust layer for AI. Cryptographic proof for enterprise compliance.</p>
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
        className="fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center pointer-events-none"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <div className="transition-logo w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center opacity-0 scale-50 mb-8">
          <Shield className="w-10 h-10 text-black" strokeWidth={2.5} />
        </div>
        <div className="overflow-hidden">
          <div className="transition-text text-3xl font-display text-white opacity-0 translate-y-8">
            Initializing
          </div>
        </div>
        <div className="overflow-hidden mt-2">
          <div className="transition-text text-lg font-mono text-emerald-400 opacity-0 translate-y-8">
            VerifiChain Platform
          </div>
        </div>
        <div className="mt-8 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="transition-loader h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: "0%" }}></div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-zinc-500">CONNECTING TO CELO MAINNET</span>
        </div>
      </div>
    </div>
  );
}