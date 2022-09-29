import { NextFunction, Request, Response } from 'express';
import LoginService from '../../services/user/login.service';

class LoginController {
  static requestValidation(req: Request, res: Response, next: NextFunction) {
    const login = req.body;

    if (!login.email || !login.password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    next();
  }

  static async login(req: Request, res: Response) {
    const login = req.body;

    const loggedUser = await LoginService.login(login);

    if (!loggedUser) return res.status(401).json({ message: 'Incorrect email or password' });

    res.status(200).json({ token: loggedUser.password });
  }

  static async loginValidate(req: Request, res: Response) {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ message: 'Incorrect token' });

    const user = await LoginService.loginValidate(authorization);

    if (!user) return res.status(401).json({ message: 'Incorrect token' });

    res.status(200).json({ role: user.role });
  }
}

export default LoginController;
