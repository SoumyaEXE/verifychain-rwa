"use client";
import { useState, useEffect, useCallback } from "react";
import { WeilWalletConnection } from "@weilliptic/weil-sdk";
import { Icon } from "@iconify/react";
import Link from "next/link";
import toast from "react-hot-toast";

declare global {
  interface Window {
    ethereum?: {
      selectedAddress?: string;
      request?: (args: { method: string }) => Promise<string[]>;
    };
  }
}

interface NavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSigner?: (signer: any) => void;
}

export default function Navbar({ setSigner }: NavbarProps) {
  const [address, setAddress] = useState("");
  const [aura, setAura] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem("userAura") || "0");
    }
    return 0;
  });

  useEffect(() => {
    // Listen for updates
    const handleStorageChange = () => {
        const updatedAura = parseInt(localStorage.getItem("userAura") || "0");
        setAura(updatedAura);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      // Initialize Weilliptic wallet connection
      const wallet = new WeilWalletConnection({
        // @ts-expect-error - window.ethereum type compatibility with WeilWalletProvider
        walletProvider: window.ethereum,
      });
      setSigner?.(wallet);
      // Get address from wallet provider
      const accounts = await window.ethereum?.request?.({ method: 'eth_requestAccounts' });
      const _addr = accounts?.[0] || '';
      setAddress(_addr);
      toast.success("Wallet Connected");
    } catch (e) {
      console.error(e);
      toast.error("Connection Failed");
    }
  }, [setSigner]);

  const disconnectWallet = () => {
    setSigner?.(null);
    setAddress("");
    toast.success("Disconnected");
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      // Use timeout to avoid calling setState synchronously in effect
      const timeoutId = setTimeout(() => {
        connectWallet();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [connectWallet]);

  return (
    <nav className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <div 
        className="relative flex items-center gap-1 w-full max-w-5xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
      >
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 rounded-2xl blur-xl opacity-60 pointer-events-none"></div>
        
        {/* Logo */}
        <Link 
          href="/" 
          className="relative flex items-center gap-2 sm:gap-2.5 px-2 sm:px-4 py-2 rounded-xl hover:bg-white/[0.08] transition-all duration-300 group"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg group-hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-shadow duration-300"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <Icon icon="lucide:shield" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
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

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link 
            href="/home" 
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <Icon icon="lucide:home" className="w-4 h-4" />
            Home
          </Link>
          <Link 
            href="/courses" 
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <Icon icon="lucide:book-open" className="w-4 h-4" />
            Learning
          </Link>
          <Link 
            href="/portfolio" 
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <Icon icon="lucide:briefcase" className="w-4 h-4" />
            Portfolio
          </Link>
        </div>

        {/* Network Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Weilliptic</span>
        </div>

        <div className="flex-1"></div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-2">
            {/* Aura Display */}
            {aura > 0 && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                    <Icon icon="lucide:zap" className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{aura} Aura</span>
                </div>
            )}
            
            {!address ? (
            <button
                onClick={connectWallet}
            className="relative bg-gradient-to-b from-white to-zinc-100 text-zinc-900 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold hover:from-emerald-400 hover:to-emerald-500 hover:text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(52,211,153,0.4)] overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative flex items-center gap-1.5 sm:gap-2">
              <Icon icon="lucide:wallet" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Connect Wallet</span>
              <span className="xs:hidden">Connect</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs sm:text-sm">
              <Icon icon="lucide:link" className="w-3.5 h-3.5" />
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            <button 
              onClick={disconnectWallet}
              className="relative p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
              title="Disconnect Wallet"
            >
              <Icon icon="lucide:power" className="w-4 h-4" />
            </button>
          </div>
        )}
        </div>
      </div>
    </nav>
  );
}