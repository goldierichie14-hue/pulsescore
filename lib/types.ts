export type MatchStatus =
  | 'TBD'
  | 'NS'     // Not Started
  | '1H'     // First Half
  | 'HT'     // Half Time
  | '2H'     // Second Half
  | 'ET'     // Extra Time
  | 'BT'     // Break Time (in Extra Time)
  | 'P'      // Penalty In Progress
  | 'FT'     // Full Time
  | 'AET'    // After Extra Time
  | 'PEN'    // After Penalty
  | 'SUSP'   // Suspended
  | 'INT'    // Interrupted
  | 'PST'    // Postponed
  | 'CANC'   // Cancelled
  | 'ABD'    // Abandoned
  | 'AWD'    // Awarded
  | 'WO'     // Walkover
  | 'LIVE';  // Generic live

export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'penalty_goal' | 'own_goal' | 'penalty_missed';

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  code?: string;
}

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  extraMinute?: number;
  team: 'home' | 'away';
  player: string;
  assist?: string;
  detail?: string;
}

export interface MatchScore {
  home: number;
  away: number;
  htHome?: number;
  htAway?: number;
  ftHome?: number;
  ftAway?: number;
  etHome?: number;
  etAway?: number;
  penHome?: number;
  penAway?: number;
}

export interface MatchStatistic {
  type: string;
  home: number | string;
  away: number | string;
}

export interface PlayerLineup {
  id: number;
  name: string;
  number: number;
  position: string;
  rating?: string;
  photo?: string;
}

export interface TeamLineup {
  formation: string;
  startXI: PlayerLineup[];
  substitutes: PlayerLineup[];
  coach: string;
}

export interface Match {
  id: number;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  status: MatchStatus;
  minute?: number;
  extraMinute?: number;
  date: string;
  time: string;
  venue?: string;
  referee?: string;
  events: MatchEvent[];
  statistics?: MatchStatistic[];
  lineups?: {
    home: TeamLineup;
    away: TeamLineup;
  };
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: string;
  season?: number;
}

export interface StandingEntry {
  rank: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
  description?: string;
}

export interface LeagueStanding {
  league: League;
  standings: StandingEntry[];
}

export interface LiveTickerItem {
  id: string;
  matchId: number;
  type: EventType;
  message: string;
  minute: number;
  timestamp: string;
}

export type TabType = 'live' | 'fixtures' | 'results';
export type FilterType = 'all' | 'live' | 'favorites';