import Team from '../../database/models/TeamModel';
import Matches from '../../database/models/MatcheModel';
import IMacth from '../../interfaces/match.interface';
import User from '../../database/models/UserModel';

class MatchService {
  constructor(
    private matchModel:typeof Matches,
    private teamModel:typeof Team,
    private userModel:typeof User,
  ) { }

  async getAll(): Promise<Matches[]> {
    const matches = await this.matchModel.findAll({ include: [
      { model: Team, as: 'teamHome' },
      { model: Team, as: 'teamAway' },
    ] });

    return matches;
  }

  async getByInProgressStatus(status: boolean): Promise<Matches[]> {
    const matches = await this.matchModel.findAll({ include: [
      { model: Team, as: 'teamHome' },
      { model: Team, as: 'teamAway' },
    ] });

    return matches.filter((match) => Boolean(match.inProgress) === status);
  }

  async create(match: IMacth, authorization: string | undefined): Promise<Matches | number> {
    if (match.homeTeam === match.awayTeam) return 401;

    const checkHomeTeam = await this.teamModel.findOne({ where: { id: match.homeTeam } });
    const checkAwayTeam = await this.teamModel.findOne({ where: { id: match.awayTeam } });

    if (!checkHomeTeam || !checkAwayTeam) return 404;

    const validate = await this.userModel.findOne({ where: { password: authorization } });

    if (validate) {
      const newMatch = await this.matchModel.create({ ...match, inProgress: true });

      return newMatch;
    }

    throw new Error();
  }

  async finishMatch(id: number): Promise<void> {
    await this.matchModel.update({ inProgress: false }, { where: { id } });
  }

  async updateMatch(id: number, newScore: IMacth): Promise<void> {
    await this.matchModel.update(
      { homeTeamGoals: newScore.homeTeamGoals, awayTeamGoals: newScore.awayTeamGoals },
      { where: { id } },
    );
  }
}

export default MatchService;
