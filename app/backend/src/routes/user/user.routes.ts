import { Router } from 'express';
import UserService from '../../services/user/user.service';
import UserController from '../../controllers/user/user.controller';
import User from '../../database/models/UserModel';

const UserRoutes = Router();

const userController = new UserController(new UserService(User));

UserRoutes.post('/login', (req, res) => userController.login(req, res));
UserRoutes.get('/login/validate', (req, res) => userController.loginValidate(req, res));

export default UserRoutes;
