import { Secret, SignOptions, sign, verify, JwtPayload } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import User from '../database/models/UserModel';

class TokenAuthentication {
  static encrypt(user: User): string {
    const userKey = { data: user };
    const secret = process.env.JWT_SECRET as Secret;
    const jwtConfig = { expiresIn: '5D', algorithm: 'HS256' } as SignOptions;

    const token = sign(userKey, secret, jwtConfig);

    return token;
  }

  static decrypt(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET as Secret;

    const decoded = verify(token, secret);

    return decoded as JwtPayload;
  }

  static compare(token: string, password: string): boolean {
    return compareSync(password, token);
  }
}

export default TokenAuthentication;
