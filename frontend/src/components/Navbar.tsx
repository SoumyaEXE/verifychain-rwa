"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Wallet, ShieldCheck, Power } from "lucide-react";
import toast from "react-hot-toast";


declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Navbar({ setSigner, signer }: any) {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("MetaMask not found");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await provider.getSigner();
      setSigner(_signer);
      const _addr = await _signer.getAddress();
      setAddress(_addr);
      toast.success("Wallet Connected");
    } catch (e) {
      toast.error("Connection Failed");
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setAddress("");
    toast.success("Disconnected");
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet(); 
      }
    };
    checkConnection();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
            <ShieldCheck className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">VERIFYCHAIN<span className="text-green-500">.RWA</span></h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Institutional Trust Layer</p>
          </div>
        </div>

        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#00ff00]"></span>
            Celo Sepolia
          </div>
          
          {!address ? (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all bg-white text-black hover:bg-green-400 hover:scale-105"
            >
              <Wallet size={18} />
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/20 border border-green-500/50 text-green-400 font-mono text-sm">
                 {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              <button 
                onClick={disconnectWallet}
                className="p-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                title="Disconnect Wallet"
              >
                <Power size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}