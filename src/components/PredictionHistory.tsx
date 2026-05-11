import React, { useEffect, useState } from 'react';
import { PredictionRecord } from '../types';
import { getUserPredictions } from '../services/predictionService';
import { auth } from '../lib/firebase';
import { History, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function PredictionHistory() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (auth.currentUser) {
        const data = await getUserPredictions(auth.currentUser.uid);
        setPredictions(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth.currentUser) {
    return (
      <div className="bg-surface-card border border-white/5 rounded-xl p-12 text-center">
        <History className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">History Unavailable</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Please sign in to view and track your match prediction performance over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          label="Total Predictions" 
          value={predictions.length.toString()} 
          icon={<History className="w-4 h-4 text-brand" />} 
        />
        <StatsCard 
          label="Success Rate" 
          value={`${predictions.length > 0 ? Math.round((predictions.filter(p => p.isCorrectResult).length / predictions.length) * 100) : 0}%`} 
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} 
        />
        <StatsCard 
          label="Pending Sync" 
          value={predictions.filter(p => p.status === 'PENDING').length.toString()} 
          icon={<Clock className="w-4 h-4 text-orange-500" />} 
        />
      </div>

      <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-header/50 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Fixture</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Prediction</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {predictions.map((p, i) => (
              <motion.tr 
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{p.homeTeam} vs {p.awayTeam}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Match ID: {p.fixtureId.substring(0, 8)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-500 uppercase">Winner:</span>
                       <span className="text-xs font-mono font-bold text-brand">{p.predictedWinner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-500 uppercase">Score:</span>
                       <span className="text-xs font-mono font-bold text-white">{p.predictedScore}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Pending
                    </div>
                  ) : p.isCorrectResult ? (
                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      Correct
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                      <XCircle className="w-3 h-3" />
                      Incorrect
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-[10px] text-gray-500 font-mono">
                    {p.timestamp?.toDate ? p.timestamp.toDate().toLocaleDateString() : 'Syncing...'}
                  </div>
                </td>
              </motion.tr>
            ))}
            {predictions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-500 text-sm italic">
                  No prediction history found. Start analyzing matches to build your profile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-surface-card border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white font-display">
        {value}
      </div>
    </div>
  );
}
