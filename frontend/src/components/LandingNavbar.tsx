"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ShieldCheck, BookOpen, Globe, Database, Network } from "lucide-react";

declare global {
  interface Window {
    ethereum?: {
      selectedAddress?: string;
      request?: (args: { method: string }) => Promise<string[]>;
    };
  }
}

export default function LandingNavbar() {
  const [address, setAddress] = useState("");
  const navRef = useRef(null);

  const connectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
        try {
            const accounts = await window.ethereum.request?.({ method: 'eth_requestAccounts' });
            const _addr = accounts?.[0] || '';
            setAddress(_addr);
        } catch (e) {
            console.error(e);
        }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
      // Use timeout to avoid calling setState synchronously in effect
      const timeoutId = setTimeout(() => {
        connectWallet();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [connectWallet]);

  useGSAP(() => {
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "back.out(1.7)", delay: 0.2 }
    );
  });

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div ref={navRef} className="pointer-events-auto">
        <div className="bg-[#0A0E27]/80 backdrop-blur-xl border border-[#2A3150] rounded-full pl-6 pr-2 py-2 shadow-2xl flex items-center gap-6">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
                <ShieldCheck className="text-[#00D9A3]" size={24} strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00D9A3] rounded-full border border-[#0A0E27]"></div>
            </div>
            
            <div className="hidden md:flex flex-col">
                <span className="font-display italic font-medium text-white tracking-tight text-lg leading-none">VerifiChain.RWA</span>
                <span className="text-[9px] text-[#00D9A3] font-mono tracking-wider leading-none mt-0.5">VERIFIED NODE</span>
            </div>
          </div>

          <div className="h-5 w-px bg-[#2A3150]"></div>

          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/registry" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#A8B2D1] hover:text-white hover:bg-white/5 rounded-full h-8 text-xs font-medium")}>
                    <Database className="mr-2 h-3 w-3" />
                    Registry
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/explorer" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#A8B2D1] hover:text-white hover:bg-white/5 rounded-full h-8 text-xs font-medium")}>
                    <Globe className="mr-2 h-3 w-3" />
                    Explorer
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/network" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#A8B2D1] hover:text-white hover:bg-white/5 rounded-full h-8 text-xs font-medium")}>
                      <Network className="mr-2 h-3 w-3" />
                      Network
                    </Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="https://docs.verifychain.com" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-[#A8B2D1] hover:text-white hover:bg-white/5 rounded-full h-8 text-xs font-medium")}>
                    <BookOpen className="mr-2 h-3 w-3" />
                    Docs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Status & Profile */}
          <div className="flex items-center gap-4">
             {address ? (
                <div className="flex items-center gap-3 bg-[#161B33] rounded-full pl-3 pr-1 py-1 border border-[#2A3150]">
                    <span className="font-mono text-[10px] text-[#A8B2D1]">{address.slice(0, 6)}...{address.slice(-4)}</span>
                    <div className="rounded-full overflow-hidden w-6 h-6 bg-black border border-[#2A3150]">
                            <Image 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} 
                            alt="avatar"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                            />
                    </div>
                </div>
            ) : (
                <button 
                    onClick={connectWallet}
                    className="text-xs font-medium bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0E27] px-4 py-1.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,217,163,0.3)] font-semibold"
                >
                    Connect Wallet
                </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
