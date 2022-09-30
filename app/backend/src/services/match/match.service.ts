import Team from '../../database/models/TeamModel';
import Matches from '../../database/models/MatcheModel';

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
}

export default MatchService;
