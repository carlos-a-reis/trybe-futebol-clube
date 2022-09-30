import { Router } from 'express';
import Matches from '../../database/models/MatcheModel';
import Team from '../../database/models/TeamModel';
import User from '../../database/models/UserModel';
import MatchService from '../../services/match/match.service';
import MatchController from '../../controllers/match/match.controller';

const MatchRoutes = Router();

const matchController = new MatchController(new MatchService(Matches, Team, User));

MatchRoutes.get('/matches', (req, res) => matchController.getAll(req, res));
MatchRoutes.post('/matches', (req, res) => matchController.create(req, res));
MatchRoutes.patch('/matches/:id', (req, res) => matchController.updateMatch(req, res));
MatchRoutes.patch('/matches/:id/finish', (req, res) => matchController.finishMatch(req, res));

export default MatchRoutes;
