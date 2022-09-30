import Team from '../../database/models/TeamModel';

class TeamService {
  constructor(private teamModel:typeof Team) { }

  async getAll(): Promise<Team[]> {
    const teams = await this.teamModel.findAll();

    return teams;
  }

  async getById(id: number): Promise<Team | null> {
    const team = await this.teamModel.findByPk(id);

    if (!team) throw new Error();

    return team;
  }
}

export default TeamService;
