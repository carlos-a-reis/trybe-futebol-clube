import { Router } from 'express';
import MatchController from '../../controllers/match/match.controller';

const MatchRoutes = Router();

MatchRoutes.get('/matches', MatchController.getAll);
MatchRoutes.post('/matches', MatchController.create);

export default MatchRoutes;
