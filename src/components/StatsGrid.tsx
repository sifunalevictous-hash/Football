import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { TeamStats } from '../types';
import { cn } from '../lib/utils';

interface StatsGridProps {
  homeStats: TeamStats;
  awayStats: TeamStats;
  homeName: string;
  awayName: string;
}

export function StatsGrid({ homeStats, awayStats, homeName, awayName }: StatsGridProps) {
  const data = [
    { name: 'Goals F', home: homeStats.goalsFor, away: awayStats.goalsFor },
    { name: 'Goals A', home: homeStats.goalsAgainst, away: awayStats.goalsAgainst },
    { name: 'Pts Rate', home: Math.round(homeStats.points / (homeStats.played || 1)), away: Math.round(awayStats.points / (awayStats.played || 1)) },
    { name: 'Eff (%)', home: Math.round((homeStats.goalsFor / (homeStats.played || 1)) * 10), away: Math.round((awayStats.goalsFor / (awayStats.played || 1)) * 10) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-card rounded-xl border border-white/5 overflow-hidden flex flex-col">
          <div className="bg-surface-header px-4 py-2 border-b border-white/5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Differential Comparison</h2>
          </div>
          <div className="p-4 flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" fontSize={9} stroke="#52525b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2329', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="home" name={homeName} fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="away" name={awayName} fill="#3f3f46" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-white/5 overflow-hidden flex flex-col">
          <div className="bg-surface-header px-4 py-2 border-b border-white/5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Offensive Variance</h2>
          </div>
          <div className="p-4 flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={9} stroke="#52525b" axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1F2329', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="home" stroke="#10b981" fillOpacity={1} fill="url(#colorHome)" strokeWidth={1} />
                <Area type="monotone" dataKey="away" stroke="#3f3f46" fillOpacity={0} fill="transparent" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 overflow-hidden flex flex-col">
        <div className="bg-surface-header px-4 py-2 border-b border-white/5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Composite Form Matrix</h2>
        </div>
        <div className="p-4 grid grid-cols-2 gap-8">
          <FormLine teamName={homeName} form={homeStats.form} />
          <FormLine teamName={awayName} form={awayStats.form} />
        </div>
      </div>
    </div>
  );
}

function FormLine({ teamName, form }: { teamName: string; form: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{teamName} Profile</div>
      <div className="flex gap-1.5 text-right justify-start">
        {form.map((res, i) => (
          <div 
            key={i} 
            className={cn(
              "w-5 h-5 rounded-sm flex items-center justify-center text-[8px] font-bold",
              res === 'W' ? "bg-brand text-black" : 
              res === 'D' ? "bg-gray-700 text-gray-300" : 
              "bg-red-500 text-white"
            )}
          >
            {res}
          </div>
        ))}
      </div>
    </div>
  )
}
