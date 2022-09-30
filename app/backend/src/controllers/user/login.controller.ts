import { Request, Response } from 'express';
import LoginService from '../../services/user/login.service';

class LoginController {
  static async login(req: Request, res: Response) {
    try {
      const login = req.body;

      const loggedUser = await LoginService.login(login);

      if (!loggedUser) return res.status(401).json({ message: 'Incorrect email or password' });

      res.status(200).json({ token: loggedUser.password });
    } catch (error) {
      res.status(400).json({ message: 'All fields must be filled' });
    }
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
