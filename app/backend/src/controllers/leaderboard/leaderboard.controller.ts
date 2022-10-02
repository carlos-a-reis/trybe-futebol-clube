import { Request, Response } from 'express';
import LeaderboardService from '../../services/leaderboard/leaderboard.service';

class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) { }

  async getHomeLeaderboard(_req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.getHomeLeaderboard();

    res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
