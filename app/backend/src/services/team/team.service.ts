import Team from '../../database/models/TeamModel';

class TeamService {
  static async getAll(): Promise<Team[]> {
    const teams = await Team.findAll();

    return teams;
  }

  static async getById(id: number): Promise<Team | null> {
    const team = await Team.findByPk(id);

    if (!team) throw new Error();

    return team;
  }
}

export default TeamService;
