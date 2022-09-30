import Team from '../../database/models/TeamModel';
import Matches from '../../database/models/MatcheModel';
import IMacth from '../../interfaces/match.interface';
import User from '../../database/models/UserModel';

class MatchService {
  static async getAll(): Promise<Matches[]> {
    const matches = await Matches.findAll({ include: [
      { model: Team, as: 'teamHome' },
      { model: Team, as: 'teamAway' },
    ] });

    return matches;
  }

  static async getByInProgressStatus(status: boolean): Promise<Matches[]> {
    const matches = await Matches.findAll({ include: [
      { model: Team, as: 'teamHome' },
      { model: Team, as: 'teamAway' },
    ] });

    return matches.filter((match) => Boolean(match.inProgress) === status);
  }

  static async create(match: IMacth, authorization: string | undefined): Promise<Matches | number> {
    if (match.homeTeam === match.awayTeam) return 401;

    const checkHomeTeam = await Team.findOne({ where: { id: match.homeTeam } });
    const checkAwayTeam = await Team.findOne({ where: { id: match.awayTeam } });

    if (!checkHomeTeam || !checkAwayTeam) return 404;

    const validate = await User.findOne({ where: { password: authorization } });

    if (validate) {
      const newMatch = await Matches.create({ ...match, inProgress: true });

      return newMatch;
    }

    throw new Error();
  }

  static async finishMatch(id: number): Promise<void> {
    await Matches.update({ inProgress: false }, { where: { id } });
  }

  static async updateMatch(id: number, newScore: IMacth): Promise<void> {
    await Matches.update(
      { homeTeamGoals: newScore.homeTeamGoals, awayTeamGoals: newScore.awayTeamGoals },
      { where: { id } },
    );
  }
}

export default MatchService;
