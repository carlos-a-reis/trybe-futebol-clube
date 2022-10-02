import Leaderboard from '../../interfaces/leaderboard.interface';
import Team from '../../database/models/TeamModel';
import Matches from '../../database/models/MatcheModel';

class LeaderboardService {
  constructor(
    private teamModel:typeof Team,
    private matchModel:typeof Matches,
  ) { }

  static calcLeaderboard(data: Matches[]): Leaderboard {
    const totalVictories = data.filter((game) => game.homeTeamGoals > game.awayTeamGoals).length;

    const totalDraws = data.filter((game) => game.homeTeamGoals === game.awayTeamGoals).length;

    const totalLosses = data.filter((game) => game.homeTeamGoals < game.awayTeamGoals).length;

    const totalPoints = 3 * (totalVictories) + totalDraws;

    const goalsFavor = data.map((game) => game.homeTeamGoals).reduce((acc, cur) => acc + cur);

    const goalsOwn = data.map((game) => game.awayTeamGoals).reduce((acc, cur) => acc + cur);

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

  static createLeaderboard(team: Team, teamData: Matches[]): Leaderboard {
    const leaderboardCalc = LeaderboardService.calcLeaderboard(teamData);

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

  async getHomeLeaderboard(): Promise<Leaderboard[]> {
    const teams = await this.teamModel.findAll();

    const matches = await this.matchModel.findAll({
      where: { inProgress: 0 },
    });

    const leaderboard = teams.map((team) => {
      const teamData = matches.filter((match) => match.homeTeam === team.id);
      return LeaderboardService.createLeaderboard(team, teamData);
    });

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(leaderboard);

    return sortedLeaderboard;
  }
}

export default LeaderboardService;
