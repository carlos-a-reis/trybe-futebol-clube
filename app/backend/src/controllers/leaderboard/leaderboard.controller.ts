import { Request, Response } from 'express';
import LeaderboardService from '../../services/leaderboard/leaderboard.service';

class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) { }

  async getHomeOrAwayLeaderboard(req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.getHomeOrAwayLeaderboard(req.path);

    res.status(200).json(leaderboard);
  }

  async getLeaderboard(_req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.getLeaderboard();

    res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
