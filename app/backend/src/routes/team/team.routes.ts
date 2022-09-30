import { Router } from 'express';
import TeamService from '../../services/team/team.service';
import TeamController from '../../controllers/team/team.controller';
import Team from '../../database/models/TeamModel';

const TeamRoutes = Router();

const teamController = new TeamController(new TeamService(Team));

TeamRoutes.get('/teams', (req, res) => teamController.getAll(req, res));
TeamRoutes.get('/teams/:id', (req, res) => teamController.getById(req, res));

export default TeamRoutes;
