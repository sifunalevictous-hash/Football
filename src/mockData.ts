import { League, Fixture, TeamStats, HeadToHead, Player, Jackpot } from './types';

// ... (existing constants)

export const JACKPOTS: Jackpot[] = [
  {
    id: 'wj1',
    name: 'Weekly Midweek Jackpot',
    prizePool: '£250,000',
    deadline: new Date(Date.now() + 172800000).toISOString(),
    matches: [
      {
        id: 'j1',
        league: 'Champions League',
        homeTeam: { id: 'REA', name: 'Real Madrid', shortName: 'REA' },
        awayTeam: { id: 'BAY', name: 'Bayern Munich', shortName: 'BAY' },
        date: new Date(Date.now() + 172800000).toISOString(),
        status: 'SCHEDULED'
      },
      {
        id: 'j2',
        league: 'Champions League',
        homeTeam: { id: 'PSG', name: 'PSG', shortName: 'PSG' },
        awayTeam: { id: 'BVB', name: 'Dortmund', shortName: 'BVB' },
        date: new Date(Date.now() + 172800000).toISOString(),
        status: 'SCHEDULED'
      }
    ]
  }
];

const ARS_PLAYERS: Player[] = [
  { id: 'p1', name: 'Bukayo Saka', position: 'FWD', goals: 12, assists: 8, rating: 8.2 },
  { id: 'p2', name: 'Martin Ødegaard', position: 'MID', goals: 8, assists: 10, rating: 8.1 },
  { id: 'p3', name: 'Declan Rice', position: 'MID', goals: 4, assists: 5, rating: 7.9 },
];

const MUN_PLAYERS: Player[] = [
  { id: 'p4', name: 'Bruno Fernandes', position: 'MID', goals: 10, assists: 7, rating: 7.8 },
  { id: 'p5', name: 'Marcus Rashford', position: 'FWD', goals: 7, assists: 3, rating: 7.2 },
  { id: 'p6', name: 'Alejandro Garnacho', position: 'FWD', goals: 5, assists: 4, rating: 7.5 },
];

export const LEAGUES: League[] = [
  { id: 'PL', name: 'Premier League', country: 'England' },
  { id: 'BL1', name: 'Bundesliga', country: 'Germany' },
  { id: 'SA', name: 'Serie A', country: 'Italy' },
  { id: 'PD', name: 'La Liga', country: 'Spain' },
  { id: 'FL1', name: 'Ligue 1', country: 'France' },
];

export const FIXTURES: Fixture[] = [
  {
    id: '1',
    league: 'Premier League',
    homeTeam: { id: 'ARS', name: 'Arsenal', shortName: 'ARS', players: ARS_PLAYERS },
    awayTeam: { id: 'MUN', name: 'Manchester United', shortName: 'MUN', players: MUN_PLAYERS },
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'SCHEDULED',
  },
  {
    id: '2',
    league: 'Premier League',
    homeTeam: { id: 'MCI', name: 'Manchester City', shortName: 'MCI' },
    awayTeam: { id: 'LIV', name: 'Liverpool', shortName: 'LIV' },
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'SCHEDULED',
  },
  {
    id: '3',
    league: 'Premier League',
    homeTeam: { id: 'CHE', name: 'Chelsea', shortName: 'CHE' },
    awayTeam: { id: 'TOT', name: 'Tottenham', shortName: 'TOT' },
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'LIVE',
    score: { home: 1, away: 0 },
  },
];

export const HEAD_TO_HEAD: Record<string, HeadToHead> = {
  '1': {
    homeWins: 18,
    awayWins: 24,
    draws: 15,
    lastMatches: [
      { date: '2023-09-03', score: '3-1', winner: 'Arsenal' },
      { date: '2023-01-22', score: '3-2', winner: 'Arsenal' },
      { date: '2022-09-04', score: '1-3', winner: 'Man Utd' },
    ]
  }
};

export const TEAM_STATS: Record<string, TeamStats> = {
  'ARS': {
    teamId: 'ARS',
    played: 25,
    won: 18,
    drawn: 4,
    lost: 3,
    goalsFor: 58,
    goalsAgainst: 22,
    points: 58,
    form: ['W', 'W', 'W', 'W', 'W'],
  },
  'MUN': {
    teamId: 'MUN',
    played: 25,
    won: 12,
    drawn: 5,
    lost: 8,
    goalsFor: 40,
    goalsAgainst: 35,
    points: 41,
    form: ['L', 'W', 'D', 'W', 'L'],
  },
};
