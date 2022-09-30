import { Request, Response } from 'express';
import TeamService from '../../services/team/team.service';

class TeamController {
  constructor(private teamService: TeamService) { }

  async getAll(_req: Request, res: Response) {
    const teams = await this.teamService.getAll();

    res.status(200).json(teams);
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const team = await this.teamService.getById(Number(id));

      res.status(200).json(team);
    } catch (error) {
      res.status(404).json({ message: 'Team not found' });
    }
  }
}

export default TeamController;
