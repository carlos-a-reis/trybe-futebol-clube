import TokenAuthentication from '../../cryptography/tokenAuthentication';
import Login from '../../interfaces/login.interface';
import User from '../../database/models/UserModel';

class UserService {
  constructor(private userModel:typeof User) { }

  async login(login: Login): Promise<string | null> {
    if (!login.email || !login.password) {
      throw new Error();
    }

    const user = await this.userModel.findOne({ where: { email: login.email } });

    if (!user) return null;

    const checkLogin = TokenAuthentication.compare(user.password, login.password);

    if (checkLogin) {
      const token = TokenAuthentication.encrypt(user);
      return token;
    }

    return null;
  }

  async loginValidate(authorization: string | undefined): Promise<User | null> {
    if (!authorization) return null;

    const { data } = TokenAuthentication.decrypt(authorization);

    const user = await this.userModel.findOne({ where: { password: data.password } });

    return user;
  }
}

export default UserService;
