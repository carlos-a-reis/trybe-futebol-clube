import Leaderboard, { objectKey } from '../../interfaces/leaderboard.interface';
import Team from '../../database/models/TeamModel';
import Matches from '../../database/models/MatcheModel';

class LeaderboardService {
  constructor(
    private teamModel:typeof Team,
    private matchModel:typeof Matches,
  ) { }

  static calcLeaderboard(data: Matches[], homeOrAway: objectKey[]): Leaderboard {
    const totalVictories = data.filter((game) => game[homeOrAway[1]] > game[homeOrAway[2]]).length;

    const totalDraws = data.filter((game) => game[homeOrAway[1]] === game[homeOrAway[2]]).length;

    const totalLosses = data.filter((game) => game[homeOrAway[1]] < game[homeOrAway[2]]).length;

    const totalPoints = 3 * (totalVictories) + totalDraws;

    const goalsFavor = data.map((game) => game[homeOrAway[1]]).reduce((acc, cur) => acc + cur);

    const goalsOwn = data.map((game) => game[homeOrAway[2]]).reduce((acc, cur) => acc + cur);

    const goalsBalance = goalsFavor - goalsOwn;

    const efficiency = Number(((totalPoints / (data.length * 3)) * 100).toFixed(2));

    return {
      totalPoints,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  }

  static createLeaderboard(team: Team, teamData: Matches[], homeOrAway: objectKey[]): Leaderboard {
    const leaderboardCalc = LeaderboardService.calcLeaderboard(teamData, homeOrAway);

    const teamLeaderBoard = {
      name: team.teamName,
      totalPoints: leaderboardCalc.totalPoints,
      totalGames: teamData.length,
      totalVictories: leaderboardCalc.totalVictories,
      totalDraws: leaderboardCalc.totalDraws,
      totalLosses: leaderboardCalc.totalLosses,
      goalsFavor: leaderboardCalc.goalsFavor,
      goalsOwn: leaderboardCalc.goalsOwn,
      goalsBalance: leaderboardCalc.goalsBalance,
      efficiency: leaderboardCalc.efficiency,
    };

    return teamLeaderBoard;
  }

  static sortLeaderboard(leaderboard: Leaderboard[]): Leaderboard[] {
    const sortFunction = (teamScore1: Leaderboard, teamScore2: Leaderboard) =>
      teamScore2.totalPoints - teamScore1.totalPoints
      || teamScore2.totalVictories - teamScore1.totalVictories
      || teamScore2.goalsBalance - teamScore1.goalsBalance
      || teamScore2.goalsFavor - teamScore1.goalsFavor
      || teamScore1.goalsOwn - teamScore2.goalsOwn;

    const sortedLeaderboard = leaderboard.sort(sortFunction);

    return sortedLeaderboard;
  }

  async getHomeOrAwayLeaderboard(path: string): Promise<Leaderboard[]> {
    const homeOrAway = path.match('home')
      ? ['homeTeam', 'homeTeamGoals', 'awayTeamGoals'] as objectKey[]
      : ['awayTeam', 'awayTeamGoals', 'homeTeamGoals'] as objectKey[];

    const teams = await this.teamModel.findAll();

    const matches = await this.matchModel.findAll({
      where: { inProgress: 0 },
    });

    const leaderboard = teams.map((team) => {
      const teamData = matches.filter((match) => match[homeOrAway[0]] === team.id);
      return LeaderboardService.createLeaderboard(team, teamData, homeOrAway);
    });

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(leaderboard);

    return sortedLeaderboard;
  }

  static concatLeaderBoard(home: Leaderboard, away: Leaderboard): Leaderboard {
    const totalPoints = home.totalPoints + away.totalPoints;

    const totalGames = Number(home.totalGames) + Number(away.totalGames);

    const efficiency = Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));

    return {
      name: home.name,
      totalPoints,
      totalGames,
      totalVictories: home.totalVictories + away.totalVictories,
      totalDraws: home.totalDraws + away.totalDraws,
      totalLosses: home.totalLosses + away.totalLosses,
      goalsFavor: home.goalsFavor + away.goalsFavor,
      goalsOwn: home.goalsOwn + away.goalsOwn,
      goalsBalance: home.goalsBalance + away.goalsBalance,
      efficiency,
    };
  }

  async getLeaderboard(): Promise<Leaderboard[]> {
    const home = ['homeTeam', 'homeTeamGoals', 'awayTeamGoals'] as objectKey[];
    const away = ['awayTeam', 'awayTeamGoals', 'homeTeamGoals'] as objectKey[];

    const teams = await this.teamModel.findAll();

    const matches = await this.matchModel.findAll({
      where: { inProgress: 0 },
    });

    const leaderboard = teams.map((team) => {
      const teamHomeData = matches.filter((match) => match[home[0]] === team.id);
      const teamAwayData = matches.filter((match) => match[away[0]] === team.id);

      const homeLeaderboard = LeaderboardService.createLeaderboard(team, teamHomeData, home);
      const awayLeaderboard = LeaderboardService.createLeaderboard(team, teamAwayData, away);

      return LeaderboardService.concatLeaderBoard(homeLeaderboard, awayLeaderboard);
    });

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(leaderboard);

    return sortedLeaderboard;
  }
}

export default LeaderboardService;
