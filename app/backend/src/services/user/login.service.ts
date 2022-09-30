import BcryptService from '../../cryptography/BcryptService';
import Login from '../../interfaces/login.interface';
import User from '../../database/models/UserModel';

class LoginService {
  static async login(login: Login): Promise<User | null> {
    if (!login.email || !login.password) {
      throw new Error();
    }

    const user = await User.findOne({ where: { email: login.email } });

    if (!user) return null;

    const checkLogin = BcryptService.compare(user.password, login.password);

    if (checkLogin) return user;

    return null;
  }

  static async loginValidate(authorization: string | undefined): Promise<User | null> {
    const user = await User.findOne({ where: { password: authorization } });

    return user;
  }
}

export default LoginService;
