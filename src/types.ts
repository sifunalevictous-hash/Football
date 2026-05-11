export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  goals: number;
  assists: number;
  rating: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  players?: Player[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserStats {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
  totalPredictions: number;
  correctResults: number;
  correctScores: number;
  accuracy: number;
  badges?: Badge[];
}

export interface PredictionRecord {
  id: string;
  userId: string;
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  predictedWinner: string;
  predictedScore: string;
  actualScore?: string;
  isCorrectResult?: boolean;
  isCorrectScore?: boolean;
  timestamp: any;
  status: 'PENDING' | 'PROCESSED';
}

export interface HeadToHead {
  homeWins: number;
  awayWins: number;
  draws: number;
  lastMatches: {
    date: string;
    score: string;
    winner: string;
  }[];
}

export interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  score?: {
    home: number;
    away: number;
  };
  league: string;
}

export interface TeamStats {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: string[]; // ['W', 'D', 'L', 'W', 'W']
}

export interface JackpotMatch extends Fixture {
  aiPrediction?: '1' | 'X' | '2';
}

export interface Jackpot {
  id: string;
  name: string;
  matches: JackpotMatch[];
  prizePool: string;
  deadline: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo?: string;
}
