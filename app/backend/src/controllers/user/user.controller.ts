import { Request, Response } from 'express';
import UserService from '../../services/user/user.service';

class UserController {
  constructor(private userService: UserService) { }

  async login(req: Request, res: Response) {
    try {
      const login = req.body;

      const token = await this.userService.login(login);

      if (!token) return res.status(401).json({ message: 'Incorrect email or password' });

      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: 'All fields must be filled' });
    }
  }

  async loginValidate(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;

      const user = await this.userService.loginValidate(authorization);

      res.status(200).json({ role: user.role });
    } catch (error) {
      res.status(401).json({ message: 'Incorrect token' });
    }
  }
}

export default UserController;
