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

      if (newMatch === 401) {
        return res.status(newMatch).json({
          message: 'It is not possible to create a match with two equal teams',
        });
      }

      if (newMatch === 404) {
        return res.status(newMatch).json({ message: 'There is no team with such id!' });
      }

      res.status(201).json(newMatch);
    } catch (error) {
      res.status(401).json({ message: 'Token must be a valid token' });
    }
  }

  static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    await MatchService.finishMatch(Number(id));

    res.status(200).json({ message: 'Finished' });
  }

  static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const newScore = req.body;

    await MatchService.updateMatch(Number(id), newScore);

    res.status(200).json({ message: 'Match updated' });
  }
}

export default MatchController;
