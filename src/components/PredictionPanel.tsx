import React, { useState, useEffect } from 'react';
import { Fixture, TeamStats, HeadToHead } from '../types';
import { Sparkles, BrainCircuit, Target, AlertCircle, Loader2, CheckCircle, LogIn, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getEnhancedAIInsights } from '../services/aiService';
import { savePrediction } from '../services/predictionService';
import { auth, signIn } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface PredictionPanelProps {
  fixture: Fixture;
  homeStats?: TeamStats | null;
  awayStats?: TeamStats | null;
  h2h?: HeadToHead | null;
}

export function PredictionPanel({ fixture, homeStats, awayStats, h2h }: PredictionPanelProps) {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const generatePrediction = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const data = await getEnhancedAIInsights(fixture, homeStats, awayStats, h2h);
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setError("Tactical Engine Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrediction = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await savePrediction({
        fixtureId: fixture.id,
        homeTeam: fixture.homeTeam.name,
        awayTeam: fixture.awayTeam.name,
        predictedWinner: prediction.winner,
        predictedScore: prediction.score,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError("Failed to record prediction");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setPrediction(null);
    setError(null);
    setSaved(false);
  }, [fixture.id]);

  return (
    <div className="bg-surface-card rounded-xl border border-white/5 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
          <BrainCircuit className="w-3 h-3 text-brand" />
          Neural Insight Engine
        </h2>
        <span className="text-[8px] text-brand font-mono">v3.1-PRO</span>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-10"
          >
            <Loader2 className="w-6 h-6 text-brand animate-spin mb-3" />
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter animate-pulse text-center">
              Scanning real-time news &<br/>running tactical simulation...
            </p>
          </motion.div>
        ) : error ? (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-[10px] font-bold uppercase">
            {error}
          </div>
        ) : prediction ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-surface-bg rounded border border-white/5">
                <p className="text-gray-500 text-[8px] uppercase tracking-widest font-bold mb-1 font-mono">Prediction</p>
                <div className="text-sm font-bold text-brand uppercase truncate">{prediction.winner}</div>
              </div>
              <div className="p-3 bg-surface-bg rounded border border-white/5">
                <p className="text-gray-500 text-[8px] uppercase tracking-widest font-bold mb-1 font-mono">Scoreline</p>
                <div className="text-sm font-bold text-white uppercase font-mono">{prediction.score}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold text-gray-500">
                <span>Confidence Index</span>
                <span className="text-white">{prediction.confidence}%</span>
              </div>
              <div className="w-full bg-surface-bg h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${prediction.confidence}%` }}
                  className="bg-brand h-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-surface-bg/50 p-3 rounded-lg border border-white/5">
                <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                  <Sparkles className="w-2.5 h-2.5" />
                  Tactical Breakdown
                </div>
                <ul className="text-[10px] space-y-2 text-gray-300">
                  {prediction.tacticalBreakdown?.map((pt: string, i: number) => (
                    <li key={i} className="flex gap-2 leading-tight">
                      <span className="text-brand shrink-0">●</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface-bg/50 rounded-lg border border-white/5 overflow-hidden">
                <div className="p-3 border-b border-white/5 text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Target className="w-2.5 h-2.5" />
                  Detailed Player Forecast
                </div>
                <div className="divide-y divide-white/5">
                  {prediction.playerPredictions?.map((pp: any, i: number) => (
                    <div key={i} className="p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-white leading-tight">{pp.name}</div>
                          <div className="text-[8px] text-brand/70 uppercase tracking-tighter">{pp.team}</div>
                        </div>
                        <div className="text-[10px] font-bold text-brand font-mono">
                          {pp.stats?.rating?.toFixed(1) || 'N/A'}<span className="text-[7px] text-gray-500 ml-0.5">RATING</span>
                        </div>
                      </div>
                      
                      <p className="text-[9px] text-gray-400 italic leading-tight">
                        "{pp.insight}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          {pp.stats?.form?.map((f: string, j: number) => (
                            <div 
                              key={j} 
                              className={`w-3 h-3 rounded-[2px] flex items-center justify-center text-[7px] font-bold ${
                                f === 'W' ? 'bg-green-500/20 text-green-500' : 
                                f === 'L' ? 'bg-red-500/20 text-red-500' : 
                                'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {f}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3 font-mono text-[8px] text-gray-500">
                          <span>{pp.stats?.goals || 0}G</span>
                          <span>{pp.stats?.assists || 0}A</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
              {!user ? (
                <button 
                  onClick={signIn}
                  className="w-full py-2 bg-brand/10 border border-brand/20 text-[9px] text-brand font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded hover:bg-brand/20 transition-all"
                >
                  <LogIn className="w-3 h-3" />
                  Sign In to Record Prediction
                </button>
              ) : saved ? (
                <div className="w-full py-2 bg-green-500/10 border border-green-500/20 text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Prediction Recorded
                </div>
              ) : (
                <button 
                  onClick={handleSavePrediction}
                  disabled={saving}
                  className="w-full py-2 bg-brand text-black font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 rounded hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Finalize Prediction
                </button>
              )}
              
              <button 
                onClick={() => setPrediction(null)}
                className="w-full py-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                Reset Analysis
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col justify-center gap-4 py-8">
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest font-medium leading-relaxed italic">
              Synchronize match data for<br/>AI tactical extraction
            </p>
            <button
              onClick={generatePrediction}
              className="px-4 py-2 bg-brand text-black rounded text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Initialize AI Scan
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
