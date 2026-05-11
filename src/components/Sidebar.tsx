import React from 'react';
import { Trophy, Calendar, BarChart3, Shield, Globe, Award, History, TrendingUp, User } from 'lucide-react';
import { LEAGUES } from '../mockData';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeLeague: string;
  onLeagueChange: (id: string) => void;
}

export function Sidebar({ activeLeague, onLeagueChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 w-60 h-full border-r border-white/5 bg-surface-card z-50 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-display">STRIKERS</span>
        </div>

        <nav className="space-y-6">
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Navigation</h3>
            <ul className="space-y-1">
              <SidebarItem 
                icon={<Calendar className="w-3.5 h-3.5" />} 
                label="Matchday" 
                active={activeLeague === 'all'} 
                onClick={() => onLeagueChange('all')}
              />
              <SidebarItem 
                icon={<Trophy className="w-3.5 h-3.5" />} 
                label="Jackpots" 
                active={activeLeague === 'jackpots'} 
                onClick={() => onLeagueChange('jackpots')}
              />
              <SidebarItem 
                icon={<History className="w-3.5 h-3.5" />} 
                label="My Predictions" 
                active={activeLeague === 'history'} 
                onClick={() => onLeagueChange('history')}
              />
              <SidebarItem 
                icon={<TrendingUp className="w-3.5 h-3.5" />} 
                label="Leaderboard" 
                active={activeLeague === 'leaderboard'} 
                onClick={() => onLeagueChange('leaderboard')}
              />
              <SidebarItem 
                icon={<User className="w-3.5 h-3.5" />} 
                label="Profile" 
                active={activeLeague === 'profile'} 
                onClick={() => onLeagueChange('profile')}
              />
              <SidebarItem 
                icon={<BarChart3 className="w-3.5 h-3.5" />} 
                label="Algorithm Logs" 
                active={false} 
              />
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Top Leagues</h3>
            <ul className="space-y-1">
              {LEAGUES.map((league) => (
                <SidebarItem 
                  key={league.id}
                  icon={<Globe className="w-3.5 h-3.5" />}
                  label={league.name}
                  active={activeLeague === league.name}
                  onClick={() => onLeagueChange(league.name)}
                />
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5 bg-surface-header/30">
        <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 px-2">System Status</div>
        <div className="space-y-1.5">
          <StatusRow label="Live Engine" color="bg-brand" />
          <StatusRow label="Tactical DB" color="bg-brand" />
          <StatusRow label="Cloud Sync" color="bg-orange-500" />
        </div>
      </div>
    </aside>
  );
}

function StatusRow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex justify-between items-center px-2 py-0.5">
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className={cn("w-1.5 h-1.5 rounded-full", color)}></span>
    </div>
  );
}

function SidebarItem({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  key?: string | number;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
          active 
            ? "bg-brand/10 text-brand border border-brand/20" 
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <span className={cn(
          "transition-colors",
          active ? "text-brand" : "text-gray-500 group-hover:text-gray-300"
        )}>
          {icon}
        </span>
        {label}
      </button>
    </li>
  );
}
