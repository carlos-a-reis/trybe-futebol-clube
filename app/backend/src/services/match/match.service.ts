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

  static async create(match: IMacth, authorization: string | undefined): Promise<Matches> {
    const validate = await User.findOne({ where: { password: authorization } });

    if (validate) {
      const newMatch = await Matches.create({ ...match, inProgress: true });

      return newMatch;
    }

    throw new Error();
  }
}

export default MatchService;
