import { Router } from 'express';
import TeamController from '../../controllers/team/team.controller';

const TeamRoutes = Router();

TeamRoutes.get('/teams', TeamController.getAll);

export default TeamRoutes;
