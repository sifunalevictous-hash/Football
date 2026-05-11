import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeLeague: string;
  onLeagueChange: (id: string) => void;
}

export function Layout({ children, activeLeague, onLeagueChange }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface-bg text-gray-200 font-sans selection:bg-brand/30">
      <Sidebar activeLeague={activeLeague} onLeagueChange={onLeagueChange} />
      <main className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="h-16 border-b border-white/5 bg-surface-card flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-bold uppercase tracking-widest text-white">
              {activeLeague === 'all' ? 'Live Analytics Dashboard' : activeLeague}
            </h1>
            <div className="flex items-center bg-surface-bg rounded px-3 py-1 text-[10px] border border-white/5">
              <span className="text-brand font-bold mr-2">● LIVE FEED</span>
              <span className="text-gray-500 uppercase tracking-tighter">System Synchronized</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <div className="text-[10px] font-bold text-white uppercase leading-none">AI SQUAD v4.8.1</div>
              <div className="text-[9px] text-gray-500 uppercase mt-0.5">Neural Matcher Active</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-surface-header border border-white/5 flex items-center justify-center">
              <div className="w-4 h-4 bg-brand/20 rounded-sm" />
            </div>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLeague}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
