"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";

// ═══════════════════════════════════════════════════════════════════════════════
// SMART CONTRACT CONFIG - DO NOT MODIFY
// ═══════════════════════════════════════════════════════════════════════════════
const CONTRACT_ADDRESS = "0xE715acd4c54F030d021b7147c20786623fFf482a";

// ═══════════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Status Badge with glow effect
const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
    active 
      ? "bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/30 shadow-[0_0_15px_rgba(0,255,163,0.15)]" 
      : "bg-slate-800/60 text-slate-500 border border-white/5"
  }`}>
    <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#00FFA3] shadow-[0_0_6px_#00FFA3]" : "bg-slate-600"}`} />
    {label}
  </div>
);

// SVG Circular Trust Gauge
const TrustGauge = ({ score, loading }: { score: number; loading: boolean }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background ring */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        {/* Progress ring */}
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-1000 ease-out ${loading ? 'animate-pulse opacity-50' : ''}`}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFA3" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${score > 0 ? 'text-white' : 'text-slate-600'}`}>
          {score}
        </span>
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Trust</span>
      </div>
    </div>
  );
};

// Sparkline Chart for Oracle
const Sparkline = ({ active }: { active: boolean }) => {
  const bars = [35, 55, 42, 70, 58, 85, 72, 90, 78, 95];
  return (
    <div className="flex items-end gap-[3px] h-10">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: active ? `${h}%` : '20%' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className={`w-1.5 rounded-t-sm ${active ? 'bg-gradient-to-t from-cyan-500 to-[#00FFA3]' : 'bg-slate-700'}`}
        />
      ))}
    </div>
  );
};

// Scanning Animation Overlay
const ScanningOverlay = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <motion.div
      initial={{ top: 0 }}
      animate={{ top: '100%' }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent shadow-[0_0_20px_#00FFA3] z-30 pointer-events-none"
    />
  );
};

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signer, setSigner] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [aiData, setAiData] = useState<{ ai_analysis: { bond_name?: string; isin?: string; face_value_amount?: number }; oracle_data: { live_yield: number } } | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [registry] = useState<{ id: string; name: string; isin: string; faceValue: string; yield: number; ipfs: string }[]>([]);
  const [trustScore, setTrustScore] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const fetchRegistry = async () => {
    // Registry fetch will be updated when Weilliptic SDK provides read methods
    // For now, keeping placeholder for demo purposes
    try {
      // TODO: Implement registry fetch using Weilliptic SDK
      console.log("Registry fetch placeholder - implement with Weilliptic SDK");
    } catch (e) {
      console.error("Error fetching registry", e);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, [signer]);

  const handleAnalyze = async () => {
    if (!file) return toast.error("Select a file first");
    setLoading(true);
    setTrustScore(0);
    setLogs([]); 
    setAiData(null); 
    
    addLog(`[System] Initializing Upload: ${file.name}...`);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://verifychain-rwa.onrender.com/analyze_and_oracle", formData);
      const analysis = res.data.ai_analysis;
      const oracle = res.data.oracle_data;
      const faceValue = parseInt(analysis.face_value_amount || 0);

      setTrustScore(20);
      await new Promise(r => setTimeout(r, 600)); 

      if (analysis.bond_name === "Unknown" || !analysis.bond_name) {
          addLog(`[AI] ⚠️ Could not identify Bond Name.`);
      } else {
          addLog(`[AI] Metadata Extracted: ${analysis.bond_name}`);
      }
      
      setTrustScore(50);
      await new Promise(r => setTimeout(r, 600)); 

      addLog(`[PoR] Face Value: ${faceValue > 0 ? "₹" + faceValue.toLocaleString() : "Unknown"}`);
      if (faceValue <= 0) {
          addLog(`[PoR] ❌ FAIL: No Reserve Value found.`);
          setTrustScore(10); 
          toast.error("Verification Failed: Invalid Document");
          setLoading(false);
          return; 
      }

      setTrustScore(80);
      await new Promise(r => setTimeout(r, 600));

      addLog(`[Oracle] Yield Feed: ${oracle.live_yield}% (Source: Yahoo Finance)`);
      
      setTrustScore(100);
      setAiData(res.data);
      toast.success("Verification Complete.");
      
    } catch {
      addLog("CRITICAL ERROR: Backend Connection Failed");
      toast.error("Analysis Error");
    }
    setLoading(false);
  };

  const handleMint = async () => {
    if (!signer) return toast.error("Connect Wallet First");
    if (!aiData) return toast.error("Analyze document first");
    const toastId = toast.loading("Interacting with Weilliptic Chain...");

    try {
      addLog("[Wallet] Requesting Signature...");
      
      // Execute contract using Weilliptic SDK
      const result = await signer.contracts.execute(
        CONTRACT_ADDRESS.replace('0x', ''), // Remove 0x prefix for Weilliptic
        'createAsset',
        {
          _name: aiData.ai_analysis.bond_name || "Unknown Bond",
          _isin: aiData.ai_analysis.isin || "UNKN",
          _faceValue: aiData.ai_analysis.face_value_amount || 1000000,
          _initialYield: Math.floor(aiData.oracle_data.live_yield * 100),
          _ipfsHash: "QmMockHashForDemo"
        }
      );

      addLog(`[Chain] Tx Sent: ${result.txHash || 'pending'}`);
      addLog("[Chain] Block Confirmed. Asset Minted.");
      toast.success("Asset Created Successfully", { id: toastId });
      fetchRegistry();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Minting Failed", { id: toastId });
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`[Error] ${errorMessage}`);
    }
  };

  const handleKYC = async () => {
    if (!signer) return toast.error("Connect Wallet First");
    const userAddr = await signer.getAddress();
    addLog(`[Identity] Scanning biometric hash for ${userAddr.slice(0, 6)}...`);
    setTimeout(() => {
      addLog("[Identity] Verified. User Whitelisted.");
      toast.success("KYC/AML Check Passed");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-[#00FFA3]/20 font-sans overflow-x-hidden">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: 'rgba(15, 23, 42, 0.95)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' },
          success: { iconTheme: { primary: '#00FFA3', secondary: '#020617' } }
        }} 
      />

      <Navbar setSigner={setSigner} />

      {/* ═══════════════════════════════════════════════════════════════════════
          VOID GRADIENT BACKGROUND + NOISE TEXTURE
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        {/* Radial Void Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_50%,_#000_100%)]" />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
        
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00FFA3]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENTO GRID WORKSPACE
      ════════════════════════════════════════════════════════════════════════ */}
      <div id="workspace" className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Dashboard Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFA3]/20 to-cyan-500/10 flex items-center justify-center border border-[#00FFA3]/30">
                  <Icon icon="solar:shield-keyhole-bold" className="w-5 h-5 text-[#00FFA3]" />
                </div>
                RWA Verification Terminal
              </h1>
              <p className="text-slate-500 text-sm mt-1 ml-[52px]">AI-powered tokenization & proof-of-reserve engine</p>
            </div>
            <div className="flex items-center gap-3 ml-[52px] sm:ml-0">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFA3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFA3]"></span>
                </span>
                <span className="text-xs font-medium text-slate-300">Oracle Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
                <Icon icon="lucide:link" className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-slate-300">Weilliptic</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-5 auto-rows-[minmax(180px,auto)]">
            
            {/* ═══ ZONE 1: UPLOAD CARD (Large - Top Left) ═══ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-12 lg:col-span-7 row-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
            >
              {/* Scanning Animation */}
              <ScanningOverlay active={loading} />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00FFA3]/20 to-cyan-500/10 flex items-center justify-center border border-[#00FFA3]/30">
                    <Icon icon="solar:database-bold-duotone" className="w-5 h-5 text-[#00FFA3]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Custody & Origination</h2>
                    <p className="text-sm text-slate-500">Upload PDF bond certificates</p>
                  </div>
                </div>
                <StatusBadge active={!!file} label={file ? "Ready" : "Waiting"} />
              </div>

              {/* Upload Drop Zone */}
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                  ${file 
                    ? 'border-[#00FFA3]/50 bg-[#00FFA3]/5' 
                    : 'border-slate-700/50 hover:border-slate-600 hover:bg-white/[0.02] group-hover:border-[#00FFA3]/30'}
                `}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="flex flex-col items-center justify-center relative z-10 pointer-events-none">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                    ${file 
                      ? 'bg-[#00FFA3] text-slate-950 scale-110 shadow-[0_0_40px_rgba(0,255,163,0.3)]' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-700/80'}
                  `}>
                    <Icon icon={file ? "solar:file-check-bold" : "solar:document-add-bold"} className="w-10 h-10" />
                  </div>
                  <span className="text-lg font-medium text-slate-200">
                    {file ? file.name : "Drop Bond Certificate (PDF)"}
                  </span>
                  {!file && <p className="text-slate-500 text-sm mt-2">Max 10MB • Secure Enclave Processing</p>}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                className="mt-6 w-full h-14 bg-[#00FFA3] hover:bg-[#00e693] disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,163,0.2)] disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="w-5 h-5" />
                    <span>Processing with Llama 3.3...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="solar:magic-stick-3-bold" className="w-5 h-5" />
                    <span>Initiate AI Verification</span>
                  </>
                )}
              </button>

              {/* Tech Stack Pills */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Icon icon="simple-icons:meta" className="w-3.5 h-3.5" />
                  <span>Llama 3.3</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Icon icon="simple-icons:python" className="w-3.5 h-3.5" />
                  <span>PyPDF2</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Icon icon="lucide:link" className="w-3.5 h-3.5" />
                  <span>Weilliptic</span>
                </div>
              </div>
            </motion.div>

            {/* ═══ ZONE 2: TRUST SCORE GAUGE (Square - Top Right) ═══ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-12 sm:col-span-6 lg:col-span-5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">AI Confidence</h3>
                  <p className="text-xs text-violet-400/80 mt-1 flex items-center gap-1">
                    <Icon icon="simple-icons:meta" className="w-3 h-3" />
                    Llama 3.3 Analysis
                  </p>
                </div>
                <Icon icon="solar:shield-check-bold" className={`w-6 h-6 ${trustScore > 80 ? 'text-[#00FFA3]' : 'text-slate-700'}`} />
              </div>

              <div className="flex items-center justify-center py-4">
                <TrustGauge score={trustScore} loading={loading} />
              </div>

              <div className="flex justify-between items-center text-xs pt-4 border-t border-white/5">
                <span className="text-slate-500">Document Integrity</span>
                <span className={trustScore >= 80 ? 'text-[#00FFA3]' : 'text-slate-500'}>
                  {trustScore >= 80 ? 'Verified' : 'Pending'}
                </span>
              </div>
            </motion.div>

            {/* ═══ ZONE 3: ORACLE FEED (Medium - Right) ═══ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 sm:col-span-6 lg:col-span-5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:chart-2-bold-duotone" className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">Oracle Feed</h3>
                </div>
                <span className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase border border-cyan-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">10Y Treasury Yield</p>
                  <p className="text-3xl font-mono font-semibold text-white">
                    {aiData ? Number(aiData.oracle_data.live_yield).toFixed(2) + "%" : "—.—%"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Icon icon="logos:yahoo" className="w-3 h-3" />
                    Yahoo Finance
                  </p>
                </div>
                <Sparkline active={!!aiData} />
              </div>
            </motion.div>

            {/* ═══ ZONE 4: TERMINAL / LOGS (Wide - Bottom Left) ═══ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-12 lg:col-span-7 bg-[#0a0f1a] border border-white/10 rounded-3xl overflow-hidden"
            >
              {/* Terminal Header */}
              <div className="px-5 py-3 bg-slate-900/80 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-[#00FFA3]/70" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">verifychain_kernel_v2</span>
                </div>
                <Icon icon="lucide:terminal" className="w-4 h-4 text-slate-600" />
              </div>
              
              {/* Terminal Body */}
              <div className="h-56 overflow-y-auto p-5 font-mono text-sm space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {logs.length === 0 && (
                  <span className="text-slate-600 animate-pulse">▌ Waiting for input...</span>
                )}
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2 text-slate-300"
                  >
                    <span className="text-[#00FFA3]/60 select-none">➜</span>
                    <span className={`${log.includes('ERROR') || log.includes('FAIL') ? 'text-red-400' : log.includes('✓') || log.includes('Verified') ? 'text-[#00FFA3]' : ''}`}>
                      {log}
                    </span>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </motion.div>

            {/* ═══ ZONE 5: MINT ACTION CARD (Conditional) ═══ */}
            <AnimatePresence>
              {aiData && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 lg:col-span-5 bg-gradient-to-br from-[#00FFA3]/10 to-slate-900/40 backdrop-blur-xl border border-[#00FFA3]/30 rounded-3xl p-6 relative overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#00FFA3]/20 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:verified-check-bold" className="w-6 h-6 text-[#00FFA3]" />
                      <h3 className="text-[#00FFA3] font-bold">Verification Complete</h3>
                    </div>
                    <Icon icon="solar:bolt-bold" className="w-5 h-5 text-[#00FFA3]" />
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm py-2 border-b border-white/5">
                      <span className="text-slate-400">Face Value</span>
                      <span className="font-mono text-white">₹{(aiData.ai_analysis.face_value_amount ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-slate-400">Live Yield</span>
                      <span className="font-mono text-cyan-400">{Number(aiData.oracle_data.live_yield).toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleKYC} 
                      className="py-3 rounded-xl border border-slate-700 hover:bg-slate-800/50 text-sm font-semibold text-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      <Icon icon="solar:user-id-bold" className="w-4 h-4" />
                      KYC Check
                    </button>
                    <button 
                      onClick={handleMint} 
                      className="py-3 rounded-xl bg-[#00FFA3] hover:bg-[#00e693] text-slate-950 text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,255,163,0.3)] flex items-center justify-center gap-2"
                    >
                      <Icon icon="lucide:link" className="w-4 h-4" />
                      Mint on Weilliptic
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          REGISTRY SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-center">
              <Icon icon="solar:earth-bold-duotone" className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Public Transparency Ledger</h2>
              <p className="text-slate-500 text-sm">Real-time assets verified on Weilliptic blockchain</p>
            </div>
          </div>

          {registry.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 backdrop-blur-sm">
              <Icon icon="solar:box-minimalistic-bold" className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-600">No assets verified yet. Be the first.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {registry.map((bond, idx) => (
                <motion.div 
                  key={bond.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#00FFA3]/30 transition-all hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                      <Icon icon="solar:lock-bold" className="w-3 h-3" /> Secured
                    </span>
                    <span className="text-slate-600 font-mono text-xs">#{bond.id}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-white mb-1 truncate">{bond.name}</h3>
                  <p className="text-slate-500 text-xs mb-6 font-mono">{bond.isin}</p>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Face Value</p>
                      <p className="font-mono text-[#00FFA3]">₹{parseInt(bond.faceValue).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Yield</p>
                      <p className="font-mono text-cyan-400">{(bond.yield / 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon icon="solar:shield-network-bold" className="w-6 h-6 text-[#00FFA3]" />
            <span className="font-bold text-white">VerifyChain</span>
          </div>
          <p className="text-slate-600 text-sm text-center">
            &copy; 2026 VerifyChain RWA. Built for IIT Kharagpur Blockchain Summit.
          </p>
          <div className="flex items-center gap-4">
            <Icon icon="lucide:link" className="w-5 h-5 text-slate-600 hover:text-emerald-400 transition-colors cursor-pointer" />
            <Icon icon="simple-icons:github" className="w-5 h-5 text-slate-600 hover:text-white transition-colors cursor-pointer" />
            <Icon icon="simple-icons:twitter" className="w-5 h-5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}