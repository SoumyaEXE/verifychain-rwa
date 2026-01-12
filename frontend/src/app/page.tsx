"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, Loader2, ArrowRight, Activity, Globe, Shield, Database, Smartphone, Zap, Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Terminal from "../components/Terminal";

const CONTRACT_ADDRESS = "0x919F737bb0C39c05c459a20A2FaB26035E9734f3"; 
const ABI = [
    "function mintBond(string _name, string _isin, string _docHash, string _ipfsHash, uint256 _yieldRate, uint256 _totalSupply) public",
    "function whitelistUser(address _user) public",
    "function nextBondId() public view returns (uint256)",
    "function bonds(uint256) public view returns (uint256 id, string name, string isin, string docHash, string ipfsHash, uint256 yieldRate, uint256 maturity, bool isActive)"
];

export default function Home() {
  const [signer, setSigner] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [registry, setRegistry] = useState<any[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);


  const fetchRegistry = async () => {
    if(!window.ethereum) return;
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const count = await contract.nextBondId();
        
        let tempRegistry = [];
        
        for(let i = Number(count); i > Math.max(0, Number(count) - 5); i--) {
            const bond = await contract.bonds(i);
            tempRegistry.push({
                id: bond.id.toString(),
                name: bond.name,
                isin: bond.isin,
                yield: Number(bond.yieldRate), 
                ipfs: bond.ipfsHash
            });
        }
        setRegistry(tempRegistry);
    } catch(e) {
        console.error("Error fetching registry", e);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, [signer]); 


  const handleAnalyze = async () => {
    if (!file) return toast.error("Select a file first");
    setLoading(true);
    addLog(`Initiating upload: ${file.name}...`);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      addLog("Sending to Python Secure Backend...");
      const res = await axios.post("http://localhost:5000/analyze_bond", formData);
      
      addLog(`AI Analysis Complete: Found ${res.data.ai_data.bond_name}`);
      addLog(`Yield Detected: ${res.data.ai_data.raw_yield}%`);
      
      setAiData(res.data);
      toast.success("AI Verification Successful");
    } catch (err) {
      addLog("ERROR: Backend Connection Failed");
      toast.error("Analysis Failed");
    }
    setLoading(false);
  };

 
  const handleMint = async () => {
    if (!signer) return toast.error("Connect Wallet First");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const toastId = toast.loading("Minting on Celo...");

    try {
      addLog("Requesting Signature...");
      const tx = await contract.mintBond(
        aiData.ai_data.bond_name,
        aiData.ai_data.isin,
        aiData.hash,
        aiData.ipfs_cid,
        aiData.ai_data.detected_yield,
        10000 
      );
      addLog(`Transaction Sent: ${tx.hash}`);
      await tx.wait();
      
      addLog("Transaction Confirmed on Block!");
      toast.success("Asset Tokenized on Celo", { id: toastId });
      fetchRegistry();
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("KYC")) {
        toast.error("KYC Missing. Run Simulation.", { id: toastId });
        addLog("ERROR: Sender not in Whitelist");
      } else {
        toast.error("Minting Failed", { id: toastId });
      }
    }
  };

 
  const handleKYC = async () => {
    if (!signer) return toast.error("Connect Wallet First");
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const userAddr = await signer.getAddress();
      addLog(`Running KYC Check for ${userAddr}...`);
      const tx = await contract.whitelistUser(userAddr);
      await tx.wait();
      addLog("KYC Verified. Identity Whitelisted.");
      toast.success("KYC Approved");
    } catch (e) {
      toast.error("KYC Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30 font-sans">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#0a0a0a', color: '#fff', border: '1px solid #222' }
      }}/>
      
      <Navbar setSigner={setSigner} signer={signer} />

    
      <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Bring <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Real World Assets</span><br/>
            On-Chain with Trust.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The first AI-Powered RWA Verification Layer on Celo. Tokenize Government Bonds and Corporate Debt with automated legal audits and cryptographic proof.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => document.getElementById('app')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-full font-bold text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
              Launch App
            </button>
            <button onClick={() => document.getElementById('docs')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all">
              Read Docs
            </button>
          </div>
        </motion.div>
      </section>

   
      <div id="app" className="py-20 bg-gradient-to-b from-black to-green-950/20 border-y border-white/5">
        <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8">
          
        
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Shield className="text-green-500" size={24}/> Asset Origination
              </h2>
              <p className="text-gray-400 mb-8 text-sm max-w-md">
                Upload Sovereign Bonds. The AI engine will verify yield, risk rating, and ISIN before on-chain minting.
              </p>
              
              <div className="border border-dashed border-gray-700 hover:border-green-500/50 hover:bg-green-500/5 transition-all rounded-xl p-10 text-center relative group">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  id="file-upload"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="text-green-400" size={32} />
                  </div>
                  <span className="text-lg font-medium">
                    {file ? <span className="text-green-400 font-bold">{file.name}</span> : "Drop PDF Document Here"}
                  </span>
                  <span className="text-xs text-gray-500 mt-2">Supports .PDF (Max 10MB)</span>
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-6 w-full bg-white text-black hover:bg-green-400 hover:scale-[1.01] transition-all font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>RUN AI VERIFICATION <ArrowRight size={18} /></>}
              </button>
            </div>

            <div className="h-64">
              <Terminal logs={logs} />
            </div>
          </div>

          
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl flex justify-between items-center border border-white/5">
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Compliance Status</p>
                <h3 className="text-lg font-bold flex items-center gap-2">
                   {signer ? (
                     <span className="flex items-center gap-2 text-green-400"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Connected</span>
                   ) : (
                     <span className="text-gray-500">Waiting for Wallet...</span>
                   )}
                </h3>
              </div>
              <button 
                onClick={handleKYC} 
                className="text-xs border border-green-500/30 text-green-400 hover:bg-green-500/10 px-4 py-2 rounded-lg transition"
              >
                Run KYC Simulation
              </button>
            </div>

            <div className={`glass-panel p-8 rounded-2xl border-t-4 min-h-[400px] flex flex-col ${aiData ? 'border-t-green-500 neon-glow' : 'border-t-gray-800'}`}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Verification Output</h2>
                {aiData && <CheckCircle className="text-green-500 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]" size={24} />}
              </div>

              {!aiData ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
                  <Activity size={64} className="mb-4 text-gray-500" />
                  <p className="text-lg">Waiting for Analysis...</p>
                  <p className="text-xs text-gray-500 mt-2">AI Engine Standby</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-gray-400">Instrument Name</span>
                      <span className="font-bold text-right">{aiData.ai_data.bond_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-gray-400">ISIN Code</span>
                      <span className="font-mono text-green-200 bg-green-900/20 px-2 rounded">{aiData.ai_data.isin}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-gray-400">Risk Rating</span>
                      <span className="text-green-400 font-bold">{aiData.ai_data.risk_rating}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-400">Annual Yield</span>
                      <div className="text-right">
                          <span className="text-3xl font-bold text-white block">{aiData.ai_data.raw_yield}%</span>
                          <span className="text-[10px] text-green-500">VERIFIED BY LLAMA 3.3</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Immutable Proof</span>
                      <a href={`https://gateway.pinata.cloud/ipfs/${aiData.ipfs_cid}`} target="_blank" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                        <Globe size={12} /> View Source PDF
                      </a>
                    </div>
                    <div className="font-mono text-[10px] text-gray-600 truncate bg-black/50 p-2 rounded border border-white/5">
                      {aiData.hash}
                    </div>
                  </div>

                  <button 
                    onClick={handleMint}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                  >
                    MINT FRACTIONAL TOKEN
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500/10 p-2 rounded-lg"><Database className="text-blue-400"/></div>
            <h2 className="text-3xl font-bold">Live On-Chain Registry</h2>
        </div>
        
        {registry.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500">No tokens minted yet, or wallet not connected.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-3 gap-6">
                {registry.map((bond) => (
                    <div key={bond.id} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-green-500/30 transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">Active Bond</span>
                            <span className="text-gray-500 text-xs">#{bond.id}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1 truncate">{bond.name}</h3>
                        <p className="text-gray-400 text-xs mb-4">{bond.isin}</p>
                        <div className="flex justify-between items-center border-t border-white/10 pt-4">
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 uppercase">Yield</p>
                                <p className="font-bold text-green-400">{(bond.yield / 100).toFixed(2)}%</p>
                            </div>
                            <a href={`https://gateway.pinata.cloud/ipfs/${bond.ipfs}`} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                                <FileText size={16} className="text-blue-400"/>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      
      <section id="docs" className="py-20 bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            
            
            <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Zap className="text-yellow-400"/> How it Works</h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                            <h3 className="font-bold">AI Verification</h3>
                            <p className="text-gray-400 text-sm">Issuer uploads PDF. Llama 3.3 extracts Yield, ISIN, and Risk Rating locally.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                            <h3 className="font-bold">Cryptographic Hashing</h3>
                            <p className="text-gray-400 text-sm">Document is hashed (SHA-256) and pinned to IPFS for immutability.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                            <h3 className="font-bold">Celo Tokenization</h3>
                            <p className="text-gray-400 text-sm">Smart Contract mints fractional ERC20 tokens representing the bond.</p>
                        </div>
                    </div>
                </div>
            </div>

            
            <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Leaf className="text-green-400"/> Why Celo?</h2>
                <div className="grid gap-6">
                    <div className="glass-panel p-5 rounded-xl">
                        <h3 className="font-bold mb-2 flex items-center gap-2"><Smartphone size={18}/> Mobile First</h3>
                        <p className="text-sm text-gray-400">Designed for MiniPay and Opera Mini, allowing rural investors in India to buy bonds on 2G networks.</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl">
                        <h3 className="font-bold mb-2 flex items-center gap-2"><Leaf size={18}/> Carbon Negative</h3>
                        <p className="text-sm text-gray-400">VerifyChain runs on Celo's carbon-negative infrastructure, aligning with Green Bond standards.</p>
                    </div>
                    <div className="glass-panel p-5 rounded-xl">
                        <h3 className="font-bold mb-2 flex items-center gap-2"><Database size={18}/> Low Cost</h3>
                        <p className="text-sm text-gray-400">Minting a fractional bond costs less than ₹0.01, making micro-investing profitable.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5">
        <p>&copy; 2026 Team LowEnd Corp. , Built for East-India Blockchain Summit 2.0</p>
      </footer>

    </div>
  );
}