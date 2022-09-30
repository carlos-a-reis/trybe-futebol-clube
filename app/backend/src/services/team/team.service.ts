import Team from '../../database/models/TeamModel';

class TeamService {
  static async getAll(): Promise<Team[]> {
    const teams = await Team.findAll();

    return teams;
  }
}

export default TeamService;
