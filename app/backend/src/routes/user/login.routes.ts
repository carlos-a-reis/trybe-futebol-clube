import { Router } from 'express';
import LoginController from '../../controllers/user/login.controller';

const LoginRoutes = Router();

LoginRoutes.post('/login', LoginController.login);
LoginRoutes.get('/login/validate', LoginController.loginValidate);

export default LoginRoutes;
