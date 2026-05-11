import React from 'react';
import { Fixture } from '../types';
import { formatDate, cn } from '../lib/utils';
import { Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface FixtureListProps {
  fixtures: Fixture[];
  onSelectFixture: (f: Fixture) => void;
  selectedFixtureId?: string;
}

export function FixtureList({ fixtures, onSelectFixture, selectedFixtureId }: FixtureListProps) {
  return (
    <div className="bg-surface-card rounded-xl border border-white/5 overflow-hidden flex flex-col">
      <div className="bg-surface-header px-4 py-2 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Matchday Selection</h2>
        <span className="text-[9px] text-brand font-mono">LIVE SYNC ACTIVE</span>
      </div>
      <div className="divide-y divide-white/5">
        {fixtures.map((fixture, idx) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => onSelectFixture(fixture)}
            className={cn(
              "p-4 cursor-pointer transition-colors relative hover:bg-white/[0.02]",
              selectedFixtureId === fixture.id && "bg-brand/[0.03]"
            )}
          >
            <div className="flex justify-between text-[9px] text-gray-500 mb-2 uppercase tracking-wide font-bold">
              <span>{fixture.league}</span>
              {fixture.status === 'LIVE' ? (
                <span className="text-red-500 animate-pulse">LIVE 72'</span>
              ) : (
                <span>{formatDate(fixture.date)}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-6 h-6 bg-surface-bg rounded-sm flex items-center justify-center border border-white/5">
                  <span className="text-[8px] font-bold">{fixture.homeTeam.shortName}</span>
                </div>
                <span className="text-xs font-bold truncate">{fixture.homeTeam.name}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xl font-mono font-black text-white">
                  {fixture.status !== 'SCHEDULED' ? (
                    `${fixture.score?.home} - ${fixture.score?.away}`
                  ) : (
                    'VS'
                  )}
                </div>
                {fixture.status === 'LIVE' && (
                  <div className="text-[8px] text-brand font-bold">POS: 54% - 46%</div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 w-1/3">
                <span className="text-xs font-bold truncate">{fixture.awayTeam.name}</span>
                <div className="w-6 h-6 bg-surface-bg rounded-sm flex items-center justify-center border border-white/5">
                   <span className="text-[8px] font-bold">{fixture.awayTeam.shortName}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <div className="flex-1 bg-surface-bg p-1.5 rounded border border-white/5 flex gap-2 overflow-hidden">
                <div className="w-3.5 h-3.5 bg-brand/20 rounded flex items-center justify-center shrink-0">
                  <TrendingUp className="w-2.5 h-2.5 text-brand" />
                </div>
                <span className="text-[9px] text-gray-400 font-medium truncate uppercase tracking-tighter">
                  Analysis: {fixture.status === 'SCHEDULED' ? 'Model suggests home advantage dominant' : 'Real-time offensive momentum skewing right'}
                </span>
              </div>
            </div>

            {selectedFixtureId === fixture.id && (
              <motion.div 
                layoutId="selected-indicator"
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
