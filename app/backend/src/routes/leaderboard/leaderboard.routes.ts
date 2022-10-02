import { Router } from 'express';
import LeaderboardController from '../../controllers/leaderboard/leaderboard.controller';
import LeaderboardService from '../../services/leaderboard/leaderboard.service';
import Team from '../../database/models/TeamModel';
import Matches from '../../database/models/MatcheModel';

const LeaderboardRoutes = Router();

const leaderboardController = new LeaderboardController(new LeaderboardService(Team, Matches));

LeaderboardRoutes.get('/leaderboard/home', (req, res) =>
  leaderboardController.getHomeLeaderboard(req, res));

export default LeaderboardRoutes;
