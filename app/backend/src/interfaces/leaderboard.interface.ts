import Matches from '../database/models/MatcheModel';

type objectKey = keyof Matches;

interface Leaderboard {
  id?: number;
  name?: string;
  totalPoints: number;
  totalGames?: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

export default Leaderboard;

export { objectKey };
