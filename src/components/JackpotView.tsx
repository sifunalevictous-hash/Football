import { Jackpot, JackpotMatch } from '../types';
import { cn } from '../lib/utils';
import { Brain, Star, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface JackpotViewProps {
  jackpot: Jackpot;
}

export function JackpotView({ jackpot }: JackpotViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-bold text-brand">{jackpot.name}</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Multi-Match Neural Forecasting</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold truncate">Est. Jackpot Prize</div>
          <div className="text-2xl font-display font-bold text-white">{jackpot.prizePool}</div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 overflow-hidden">
        <div className="bg-surface-header px-4 py-2 border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          AI Selection Matrix
        </div>
        <div className="divide-y divide-white/5">
          {jackpot.matches.map((match, idx) => (
            <div key={match.id} className="p-4 grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_auto_1fr_200px] items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-600 font-bold">{idx + 1}</span>
                <span className="text-sm font-bold text-white">{match.homeTeam.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <SelectionBox label="1" active={false} />
                <SelectionBox label="X" active={true} />
                <SelectionBox label="2" active={false} />
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-white">{match.awayTeam.name}</span>
              </div>

              <div className="hidden md:flex items-center gap-3 bg-surface-bg p-2 rounded border border-white/5">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-brand" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[9px] font-bold text-gray-500 uppercase truncate">AI Sentiment</div>
                  <div className="text-[10px] text-brand font-medium truncate">Draw projected due to defensive parity</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2.5 bg-surface-header text-gray-300 border border-white/5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-bg transition-all">
          Download Analysis PDF
        </button>
        <button className="px-6 py-2.5 bg-brand text-black rounded-lg text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">
          Generate Full Prediction Set
        </button>
      </div>
    </div>
  );
}

function SelectionBox({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className={cn(
      "w-8 h-8 rounded flex items-center justify-center text-xs font-black transition-all",
      active 
        ? "bg-brand text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
        : "bg-surface-bg border border-white/5 text-gray-600 hover:text-gray-400"
    )}>
      {label}
    </div>
  );
}
