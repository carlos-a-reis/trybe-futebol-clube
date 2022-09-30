import { Request, Response } from 'express';
import TeamService from '../../services/team/team.service';

class TeamController {
  static async getAll(_req: Request, res: Response) {
    const teams = await TeamService.getAll();

    res.status(200).json(teams);
  }
}

export default TeamController;
