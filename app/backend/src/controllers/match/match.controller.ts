import { Request, Response } from 'express';
import MatchService from '../../services/match/match.service';

class MatchController {
  constructor(private matchService: MatchService) { }

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress !== undefined) {
      const status = inProgress === 'true';
      const matches = await this.matchService.getByInProgressStatus(status);

      return res.status(200).json(matches);
    }

    const matches = await this.matchService.getAll();

    res.status(200).json(matches);
  }

  async create(req: Request, res: Response) {
    const match = req.body;
    const { authorization } = req.headers;

    try {
      const newMatch = await this.matchService.create(match, authorization);

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

  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    await this.matchService.finishMatch(Number(id));

    res.status(200).json({ message: 'Finished' });
  }

  async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const newScore = req.body;

    await this.matchService.updateMatch(Number(id), newScore);

    res.status(200).json({ message: 'Match updated' });
  }
}

export default MatchController;
