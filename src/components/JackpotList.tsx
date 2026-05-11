import { Jackpot, JackpotMatch } from '../types';
import { formatDate, cn } from '../lib/utils';
import { Zap, Trophy, Timer } from 'lucide-react';
import { motion } from 'motion/react';

interface JackpotListProps {
  jackpots: Jackpot[];
  onSelectJackpot: (j: Jackpot) => void;
  selectedJackpotId?: string;
}

export function JackpotList({ jackpots, onSelectJackpot, selectedJackpotId }: JackpotListProps) {
  return (
    <div className="space-y-4">
      {jackpots.map((jackpot) => (
        <motion.div
          key={jackpot.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onSelectJackpot(jackpot)}
          className={cn(
            "p-4 rounded-xl border cursor-pointer transition-all",
            selectedJackpotId === jackpot.id
              ? "bg-brand/10 border-brand"
              : "bg-surface-card border-white/5 hover:border-white/10"
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-brand" />
              {jackpot.name}
            </h3>
            <span className="text-[10px] font-mono text-brand font-bold">{jackpot.prizePool}</span>
          </div>
          <div className="flex justify-between items-end text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1">
               <Zap className="w-3 h-3 text-orange-500" /> {jackpot.matches.length} SELECTIONS
            </span>
            <span className="flex items-center gap-1">
               <Timer className="w-3 h-3" /> ENDS: {formatDate(jackpot.deadline)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
