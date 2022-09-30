import { Router } from 'express';
import TeamController from '../../controllers/team/team.controller';

const TeamRoutes = Router();

TeamRoutes.get('/teams', TeamController.getAll);
TeamRoutes.get('/teams/:id', TeamController.getById);

export default TeamRoutes;
