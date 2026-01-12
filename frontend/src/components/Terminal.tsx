import { TerminalSquare } from "lucide-react";

export default function Terminal({ logs }: { logs: string[] }) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden h-full flex flex-col">
      <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <TerminalSquare size={14} /> SYSTEM LOGS
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="p-4 font-mono text-xs space-y-2 overflow-y-auto max-h-[200px] flex-1">
        {logs.length === 0 && <span className="text-gray-600 animate-pulse">Waiting for input...</span>}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-green-500">➜</span>
            <span className="text-gray-300">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}