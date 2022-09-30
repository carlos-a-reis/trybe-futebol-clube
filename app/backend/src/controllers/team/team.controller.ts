import { Request, Response } from 'express';
import TeamService from '../../services/team/team.service';

class TeamController {
  static async getAll(_req: Request, res: Response) {
    const teams = await TeamService.getAll();

    res.status(200).json(teams);
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const team = await TeamService.getById(Number(id));

      res.status(200).json(team);
    } catch (error) {
      res.status(404).json({ message: 'Team not found' });
    }
  }
}

export default TeamController;
