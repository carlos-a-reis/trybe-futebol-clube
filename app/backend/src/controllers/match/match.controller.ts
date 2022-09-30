import { Request, Response } from 'express';
import MatchService from '../../services/match/match.service';

class MatchController {
  static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress !== undefined) {
      const status = inProgress === 'true';
      const matches = await MatchService.getByInProgressStatus(status);

      return res.status(200).json(matches);
    }

    const matches = await MatchService.getAll();

    res.status(200).json(matches);
  }

  static async create(req: Request, res: Response) {
    const match = req.body;
    const { authorization } = req.headers;

    try {
      const newMatch = await MatchService.create(match, authorization);

      res.status(201).json(newMatch);
    } catch (error) {
      res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}

export default MatchController;
