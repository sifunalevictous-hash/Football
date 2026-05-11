import React, { useEffect, useState } from 'react';
import { UserStats, Badge } from '../types';
import { getUserStats } from '../services/predictionService';
import { auth } from '../lib/firebase';
import { User, Medal, Target, TrendingUp, Mail, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { PredictionHistory } from './PredictionHistory';
import { cn } from '../lib/utils';

const MOCK_BADGES: Badge[] = [
  { id: '1', name: 'Early Bird', icon: '🐦', description: 'Placed one of the first predictions of the season.' },
  { id: '2', name: 'Sharp Shooter', icon: '🎯', description: 'Achieved over 70% accuracy in a single matchday.' },
  { id: '3', name: 'Veteran', icon: '🎖️', description: 'Placed more than 50 predictions.' },
];

export function UserProfile() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (auth.currentUser) {
        const data = await getUserStats(auth.currentUser.uid);
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();
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
      <div className="bg-surface-card border border-white/5 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Profile Locked</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
          Sign in to access your personal dashboard, track your stats, and showcase your achievements.
        </p>
        <button 
           onClick={() => window.location.reload()} // Re-trigger auth flow in header or similar
           className="px-6 py-2 bg-brand text-black font-bold text-sm uppercase tracking-widest rounded hover:scale-105 transition-transform"
        >
          Initialize Auth
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-surface-card p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-surface-header border-2 border-brand/20 flex items-center justify-center overflow-hidden shadow-2xl shadow-brand/10">
              {auth.currentUser.photoURL ? (
                <img src={auth.currentUser.photoURL} alt={auth.currentUser.displayName || ''} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-brand/50" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand rounded-lg flex items-center justify-center border-4 border-surface-card">
              <ShieldCheck className="w-4 h-4 text-black" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white font-display mb-1">{auth.currentUser.displayName || 'Neural Analyst'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand/60" />
                {auth.currentUser.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand/60" />
                Joined {auth.currentUser.metadata.creationTime ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </div>
              <div className="px-2 py-0.5 bg-brand/10 rounded text-[10px] font-bold text-brand uppercase tracking-widest">
                Pro Tier
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <QuickStat label="Accuracy" value={`${stats?.accuracy || 0}%`} color="text-brand" />
            <QuickStat label="Rank" value="#12" color="text-white" />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Stats & Badges */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Performance Overview */}
          <div className="bg-surface-card rounded-2xl border border-white/5 p-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-brand" />
              Performance Overview
            </h3>
            <div className="space-y-6">
              <ProgressBar label="Correct Results" current={stats?.correctResults || 0} total={stats?.totalPredictions || 1} color="bg-brand" />
              <ProgressBar label="Correct Scores" current={stats?.correctScores || 0} total={stats?.totalPredictions || 1} color="bg-orange-500" />
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-3 bg-white/5 rounded-xl text-center">
                  <div className="text-sm font-bold text-white">{stats?.totalPredictions || 0}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Analysis Volume</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl text-center">
                  <div className="text-sm font-bold text-brand">{(stats?.correctResults || 0) + (stats?.correctScores || 0)}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Total Hits</div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-surface-card rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Medal className="w-3 h-3 text-brand" />
                Achievements
              </h3>
              <span className="text-[10px] text-brand font-bold">{stats?.badges?.length || MOCK_BADGES.length} Unlocked</span>
            </div>
            <div className="space-y-4">
              {(stats?.badges || MOCK_BADGES).map((badge, i) => (
                <motion.div 
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-header flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{badge.name}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{badge.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-brand" />
                Analysis Log History
              </h3>
            </div>
            <div className="p-6">
              <PredictionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-center min-w-[100px]">
      <div className={cn("text-xl font-bold font-mono", color)}>{value}</div>
      <div className="text-[8px] text-gray-500 uppercase tracking-[0.2em] font-bold">{label}</div>
    </div>
  );
}

function ProgressBar({ label, current, total, color }: { label: string; current: number; total: number; color: string }) {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-surface-header h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}
