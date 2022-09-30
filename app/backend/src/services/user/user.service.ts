import BcryptService from '../../cryptography/BcryptService';
import Login from '../../interfaces/login.interface';
import User from '../../database/models/UserModel';

class UserService {
  constructor(private userModel:typeof User) { }

  async login(login: Login): Promise<User | null> {
    if (!login.email || !login.password) {
      throw new Error();
    }

    const user = await this.userModel.findOne({ where: { email: login.email } });

    if (!user) return null;

    const checkLogin = BcryptService.compare(user.password, login.password);

    if (checkLogin) return user;

    return null;
  }

  async loginValidate(authorization: string | undefined): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { password: authorization } });

    return user;
  }
}

export default UserService;
