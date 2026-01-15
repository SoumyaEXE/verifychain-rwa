import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
        <Navbar />
        
        <div className="relative pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Your Portfolio
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    Track your assets, achievements, and verifications on chain.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Cards */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="group relative bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                        <div className="relative space-y-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Icon icon="lucide:box" className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Asset #{i}</h3>
                            <p className="text-sm text-zinc-500">
                                Detailed information about your verified asset and its current status on the blockchain.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </main>
  );
}
