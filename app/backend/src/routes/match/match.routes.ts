import { Router } from 'express';
import MatchController from '../../controllers/match/match.controller';

const MatchRoutes = Router();

MatchRoutes.get('/matches', MatchController.getAll);
MatchRoutes.post('/matches', MatchController.create);
MatchRoutes.patch('matches/:id', MatchController.updateMatch);
MatchRoutes.patch('/matches/:id/finish', MatchController.finishMatch);

export default MatchRoutes;
