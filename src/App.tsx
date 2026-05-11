/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { FixtureList } from './components/FixtureList';
import { PredictionPanel } from './components/PredictionPanel';
import { StatsGrid } from './components/StatsGrid';
import { JackpotList } from './components/JackpotList';
import { JackpotView } from './components/JackpotView';
import { PredictionHistory } from './components/PredictionHistory';
import { Leaderboard } from './components/Leaderboard';
import { UserProfile } from './components/UserProfile';
import { FIXTURES, TEAM_STATS, HEAD_TO_HEAD, JACKPOTS } from './mockData';
import { Fixture, Jackpot } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeLeague, setActiveLeague] = useState('all');
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(FIXTURES[0]);
  const [selectedJackpot, setSelectedJackpot] = useState<Jackpot | null>(JACKPOTS[0]);

  const filteredFixtures = activeLeague === 'all' 
    ? FIXTURES 
    : FIXTURES.filter(f => f.league === activeLeague);

  const homeStats = selectedFixture ? TEAM_STATS[selectedFixture.homeTeam.id] || TEAM_STATS['ARS'] : null;
  const awayStats = selectedFixture ? TEAM_STATS[selectedFixture.awayTeam.id] || TEAM_STATS['MUN'] : null;
  const h2h = selectedFixture ? HEAD_TO_HEAD[selectedFixture.id] : null;

  return (
    <Layout activeLeague={activeLeague} onLeagueChange={setActiveLeague}>
      {activeLeague === 'history' ? (
        <PredictionHistory />
      ) : activeLeague === 'leaderboard' ? (
        <Leaderboard />
      ) : activeLeague === 'profile' ? (
        <UserProfile />
      ) : activeLeague === 'jackpots' ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
             <div className="px-2">
                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Available Jackpots</h2>
             </div>
             <JackpotList 
               jackpots={JACKPOTS} 
               onSelectJackpot={setSelectedJackpot} 
               selectedJackpotId={selectedJackpot?.id} 
             />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedJackpot && (
                <motion.div
                  key={selectedJackpot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <JackpotView jackpot={selectedJackpot} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            <FixtureList 
              fixtures={filteredFixtures} 
              onSelectFixture={setSelectedFixture}
              selectedFixtureId={selectedFixture?.id}
            />

            <AnimatePresence mode="wait">
            {selectedFixture && homeStats && awayStats && (
              <motion.div
                key={selectedFixture.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatsGrid 
                  homeStats={homeStats} 
                  awayStats={awayStats}
                  homeName={selectedFixture.homeTeam.shortName}
                  awayName={selectedFixture.awayTeam.shortName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-12 lg:col-span-4">
          {selectedFixture && (
            <PredictionPanel 
              fixture={selectedFixture} 
              homeStats={homeStats}
              awayStats={awayStats}
              h2h={h2h}
            />
          )}
        </div>
      </div>
      )}

      <footer className="mt-8 py-4 border-t border-white/5 text-center">
        <p className="text-[8px] text-gray-600 font-mono uppercase tracking-[0.3em]">
          DATA SYSTEM v4.8.1 • ENCRYPTION ACTIVE • SECURE CONNECTION
        </p>
      </footer>
    </Layout>
  );
}
