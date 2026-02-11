import type { Match, LeagueStanding, LiveTickerItem, League } from './types';
import { mockMatches, mockStandings, mockTickerItems, leagues } from './mock-data';

// ─── Configuration ────────────────────────────────────
const API_PROVIDER = process.env.NEXT_PUBLIC_API_PROVIDER || 'mock';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'v3.football.api-sports.io';

const HEADERS_API_FOOTBALL: Record<string, string> = {
  'x-apisports-key': API_KEY,
};

const HEADERS_FOOTBALL_DATA: Record<string, string> = {
  'X-Auth-Token': API_KEY,
};

// ─── API-Football Provider ────────────────────────────
async function fetchAPIFootball(endpoint: string) {
  const res = await fetch(`https://${API_HOST}${endpoint}`, {
    headers: HEADERS_API_FOOTBALL,
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`);
  const data = await res.json();
  return data.response;
}

function mapAPIFootballMatch(fixture: any): Match {
  return {
    id: fixture.fixture.id,
    league: {
      id: fixture.league.id,
      name: fixture.league.name,
      country: fixture.league.country,
      logo: fixture.league.logo,
      flag: fixture.league.flag,
      season: fixture.league.season,
    },
    homeTeam: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      shortName: fixture.teams.home.name.substring(0, 3).toUpperCase(),
      logo: fixture.teams.home.logo,
    },
    awayTeam: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      shortName: fixture.teams.away.name.substring(0, 3).toUpperCase(),
      logo: fixture.teams.away.logo,
    },
    score: {
      home: fixture.goals.home ?? 0,
      away: fixture.goals.away ?? 0,
      htHome: fixture.score.halftime.home,
      htAway: fixture.score.halftime.away,
      ftHome: fixture.score.fulltime.home,
      ftAway: fixture.score.fulltime.away,
      etHome: fixture.score.extratime.home,
      etAway: fixture.score.extratime.away,
      penHome: fixture.score.penalty.home,
      penAway: fixture.score.penalty.away,
    },
    status: mapStatus(fixture.fixture.status.short),
    minute: fixture.fixture.status.elapsed,
    extraMinute: fixture.fixture.status.extra,
    date: fixture.fixture.date.split('T')[0],
    time: new Date(fixture.fixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    venue: fixture.fixture.venue?.name,
    referee: fixture.fixture.referee,
    events: (fixture.events || []).map((e: any, i: number) => ({
      id: `e-${fixture.fixture.id}-${i}`,
      type: mapEventType(e.type, e.detail),
      minute: e.time.elapsed,
      extraMinute: e.time.extra,
      team: e.team.id === fixture.teams.home.id ? 'home' : 'away',
      player: e.player.name || 'Unknown',
      assist: e.assist?.name,
      detail: e.detail,
    })),
    statistics: (fixture.statistics || []).length > 0
      ? mapStatistics(fixture.statistics, fixture.teams.home.id)
      : undefined,
  };
}

function mapStatus(status: string): Match['status'] {
  const statusMap: Record<string, Match['status']> = {
    'TBD': 'TBD', 'NS': 'NS', '1H': '1H', 'HT': 'HT', '2H': '2H',
    'ET': 'ET', 'BT': 'BT', 'P': 'P', 'FT': 'FT', 'AET': 'AET',
    'PEN': 'PEN', 'SUSP': 'SUSP', 'INT': 'INT', 'PST': 'PST',
    'CANC': 'CANC', 'ABD': 'ABD', 'AWD': 'AWD', 'WO': 'WO', 'LIVE': 'LIVE',
  };
  return statusMap[status] || 'NS';
}

function mapEventType(type: string, detail: string): Match['events'][0]['type'] {
  if (type === 'Goal' && detail === 'Normal Goal') return 'goal';
  if (type === 'Goal' && detail === 'Penalty') return 'penalty_goal';
  if (type === 'Goal' && detail === 'Own Goal') return 'own_goal';
  if (type === 'Goal' && detail === 'Missed Penalty') return 'penalty_missed';
  if (type === 'Card' && detail === 'Yellow Card') return 'yellow_card';
  if (type === 'Card' && detail === 'Red Card') return 'red_card';
  if (type === 'subst') return 'substitution';
  if (type === 'Var') return 'var';
  return 'goal';
}

function mapStatistics(stats: any[], homeTeamId: number): Match['statistics'] {
  if (!stats || stats.length < 2) return [];
  const homeStats = stats.find((s: any) => s.team.id === homeTeamId)?.statistics || [];
  const awayStats = stats.find((s: any) => s.team.id !== homeTeamId)?.statistics || [];

  return homeStats.map((stat: any, i: number) => ({
    type: stat.type,
    home: stat.value ?? 0,
    away: awayStats[i]?.value ?? 0,
  }));
}

// ─── football-data.org Provider ───────────────────────
async function fetchFootballData(endpoint: string) {
  const res = await fetch(`https://api.football-data.org/v4${endpoint}`, {
    headers: HEADERS_FOOTBALL_DATA,
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`football-data.org error: ${res.status}`);
  return res.json();
}

// ─── Public API Functions ─────────────────────────────

export async function getMatches(date?: string): Promise<Match[]> {
  if (API_PROVIDER === 'mock' || !API_KEY || API_KEY === 'your_api_key_here') {
    // Simulate slight network delay for realism
    await new Promise(r => setTimeout(r, 300));
    // Randomize minutes to simulate live updates
    return mockMatches.map(m => {
      if (m.status === '1H' || m.status === '2H') {
        const minuteOffset = Math.floor(Math.random() * 3);
        return { ...m, minute: (m.minute || 0) + minuteOffset };
      }
      return m;
    });
  }

  if (API_PROVIDER === 'api-football') {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const fixtures = await fetchAPIFootball(`/fixtures?date=${targetDate}`);
      return fixtures.map(mapAPIFootballMatch);
    } catch (error) {
      console.error('API-Football fetch error:', error);
      return mockMatches; // Fallback to mock data
    }
  }

  if (API_PROVIDER === 'football-data') {
    try {
      const data = await fetchFootballData('/matches');
      return data.matches.map((m: any) => ({
        id: m.id,
        league: {
          id: m.competition.id,
          name: m.competition.name,
          country: m.area.name,
          logo: m.competition.emblem || '',
        },
        homeTeam: {
          id: m.homeTeam.id,
          name: m.homeTeam.name,
          shortName: m.homeTeam.tla || m.homeTeam.name.substring(0, 3).toUpperCase(),
          logo: m.homeTeam.crest || '',
        },
        awayTeam: {
          id: m.awayTeam.id,
          name: m.awayTeam.name,
          shortName: m.awayTeam.tla || m.awayTeam.name.substring(0, 3).toUpperCase(),
          logo: m.awayTeam.crest || '',
        },
        score: {
          home: m.score.fullTime?.home ?? 0,
          away: m.score.fullTime?.away ?? 0,
          htHome: m.score.halfTime?.home,
          htAway: m.score.halfTime?.away,
        },
        status: mapFDStatus(m.status),
        date: m.utcDate.split('T')[0],
        time: new Date(m.utcDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        events: [],
      })) as Match[];
    } catch (error) {
      console.error('football-data.org fetch error:', error);
      return mockMatches;
    }
  }

  return mockMatches;
}

function mapFDStatus(status: string): Match['status'] {
  const map: Record<string, Match['status']> = {
    'SCHEDULED': 'NS', 'TIMED': 'NS', 'IN_PLAY': 'LIVE',
    'PAUSED': 'HT', 'FINISHED': 'FT', 'SUSPENDED': 'SUSP',
    'POSTPONED': 'PST', 'CANCELLED': 'CANC', 'AWARDED': 'AWD',
  };
  return map[status] || 'NS';
}

export async function getMatchById(id: number): Promise<Match | null> {
  if (API_PROVIDER === 'mock' || !API_KEY || API_KEY === 'your_api_key_here') {
    await new Promise(r => setTimeout(r, 200));
    const match = mockMatches.find(m => m.id === id);
    if (!match) return null;
    if (match.status === '1H' || match.status === '2H') {
      return { ...match, minute: (match.minute || 0) + Math.floor(Math.random() * 2) };
    }
    return match;
  }

  if (API_PROVIDER === 'api-football') {
    try {
      const fixtures = await fetchAPIFootball(`/fixtures?id=${id}`);
      if (fixtures.length === 0) return null;

      // Also fetch events, statistics, lineups
      const [events, statistics, lineups] = await Promise.all([
        fetchAPIFootball(`/fixtures/events?fixture=${id}`).catch(() => []),
        fetchAPIFootball(`/fixtures/statistics?fixture=${id}`).catch(() => []),
        fetchAPIFootball(`/fixtures/lineups?fixture=${id}`).catch(() => []),
      ]);

      const fixture = { ...fixtures[0], events, statistics };
      const match = mapAPIFootballMatch(fixture);

      if (lineups && lineups.length >= 2) {
        match.lineups = {
          home: {
            formation: lineups[0].formation || '4-4-2',
            startXI: lineups[0].startXI.map((p: any) => ({
              id: p.player.id,
              name: p.player.name,
              number: p.player.number,
              position: p.player.pos,
            })),
            substitutes: lineups[0].substitutes.map((p: any) => ({
              id: p.player.id,
              name: p.player.name,
              number: p.player.number,
              position: p.player.pos,
            })),
            coach: lineups[0].coach?.name || '',
          },
          away: {
            formation: lineups[1].formation || '4-4-2',
            startXI: lineups[1].startXI.map((p: any) => ({
              id: p.player.id,
              name: p.player.name,
              number: p.player.number,
              position: p.player.pos,
            })),
            substitutes: lineups[1].substitutes.map((p: any) => ({
              id: p.player.id,
              name: p.player.name,
              number: p.player.number,
              position: p.player.pos,
            })),
            coach: lineups[1].coach?.name || '',
          },
        };
      }

      return match;
    } catch (error) {
      console.error('API-Football fetch error for match:', error);
      return mockMatches.find(m => m.id === id) || null;
    }
  }

  return mockMatches.find(m => m.id === id) || null;
}

export async function getStandings(leagueId?: number): Promise<LeagueStanding[]> {
  if (API_PROVIDER === 'mock' || !API_KEY || API_KEY === 'your_api_key_here') {
    await new Promise(r => setTimeout(r, 250));
    if (leagueId) {
      return mockStandings.filter(s => s.league.id === leagueId);
    }
    return mockStandings;
  }

  if (API_PROVIDER === 'api-football') {
    try {
      const targetLeagues = leagueId ? [leagueId] : [39, 140, 135, 78, 61];
      const results = await Promise.all(
        targetLeagues.map(async (lid) => {
          const data = await fetchAPIFootball(`/standings?league=${lid}&season=2025`);
          if (!data || data.length === 0) return null;
          const leagueData = data[0].league;
          return {
            league: {
              id: leagueData.id,
              name: leagueData.name,
              country: leagueData.country,
              logo: leagueData.logo,
              flag: leagueData.flag,
              season: leagueData.season,
            },
            standings: leagueData.standings[0].map((s: any) => ({
              rank: s.rank,
              team: {
                id: s.team.id,
                name: s.team.name,
                shortName: s.team.name.substring(0, 3).toUpperCase(),
                logo: s.team.logo,
              },
              played: s.all.played,
              won: s.all.win,
              drawn: s.all.draw,
              lost: s.all.lose,
              goalsFor: s.all.goals.for,
              goalsAgainst: s.all.goals.against,
              goalDifference: s.goalsDiff,
              points: s.points,
              form: s.form,
              description: s.description,
            })),
          } as LeagueStanding;
        })
      );
      return results.filter(Boolean) as LeagueStanding[];
    } catch (error) {
      console.error('API-Football standings error:', error);
      return mockStandings;
    }
  }

  return mockStandings;
}

export async function getLeagues(): Promise<League[]> {
  if (API_PROVIDER === 'mock' || !API_KEY || API_KEY === 'your_api_key_here') {
    return leagues;
  }
  return leagues; // Use static leagues list for consistency
}

export async function getLiveTickerItems(): Promise<LiveTickerItem[]> {
  // Live ticker always uses internal data derived from matches
  return mockTickerItems;
}

export async function searchMatches(query: string): Promise<Match[]> {
  const matches = await getMatches();
  const lowerQuery = query.toLowerCase();
  return matches.filter(m =>
    m.homeTeam.name.toLowerCase().includes(lowerQuery) ||
    m.awayTeam.name.toLowerCase().includes(lowerQuery) ||
    m.league.name.toLowerCase().includes(lowerQuery) ||
    m.homeTeam.shortName.toLowerCase().includes(lowerQuery) ||
    m.awayTeam.shortName.toLowerCase().includes(lowerQuery)
  );
}