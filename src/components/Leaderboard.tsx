import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';
import { getLeaderboard } from '../services/predictionService';
import { TrendingUp, Award, Crown, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Leaderboard() {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setUsers(data);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-white font-display uppercase tracking-tight">Global Oracle Rankings</h1>
        <p className="text-gray-500 text-sm max-w-md mt-2">
          The most accurate neural-enhanced predictors in our ecosystem. Ranked by accuracy and volume.
        </p>
      </div>

      <div className="bg-surface-card border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-header/30 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Predictor</div>
          <div className="col-span-2 text-center">Total</div>
          <div className="col-span-2 text-center">Correct</div>
          <div className="col-span-2 text-right">Accuracy</div>
        </div>

        <div className="divide-y divide-white/5">
          {users.map((user, index) => (
            <motion.div 
              key={user.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group"
            >
              <div className="col-span-1">
                {index === 0 ? (
                  <Crown className="w-5 h-5 text-yellow-500" />
                ) : index === 1 ? (
                  <Award className="w-5 h-5 text-gray-300" />
                ) : index === 2 ? (
                  <Award className="w-5 h-5 text-amber-600" />
                ) : (
                  <span className="text-lg font-bold text-gray-700 font-mono">#{index + 1}</span>
                )}
              </div>
              
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-header border border-white/10 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-brand font-bold text-xs">{user.displayName.charAt(0)}</div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white group-hover:text-brand transition-colors">
                    {user.displayName}
                  </span>
                  <div className="flex items-center gap-1">
                     <Zap className="w-3 h-3 text-orange-500" />
                     <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Veteran Analyst</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-center font-mono text-sm text-gray-400">
                {user.totalPredictions}
              </div>
              
              <div className="col-span-2 text-center font-mono text-sm text-white">
                {user.correctResults}
              </div>

              <div className="col-span-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-brand font-mono">{user.accuracy || 0}%</span>
                  <div className="w-16 h-1 bg-surface-bg rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-brand h-full shadow-[0_0_5px_rgba(16,185,129,0.5)]" 
                      style={{ width: `${user.accuracy || 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {users.length === 0 && (
            <div className="py-20 text-center text-gray-500 italic text-sm">
              No data synchronized yet. Join the grid to appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
