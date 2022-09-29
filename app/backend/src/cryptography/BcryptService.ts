import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

class BcryptService {
  private _salt = genSaltSync(10);

  public encrypt(password: string): string {
    return hashSync(password, this._salt);
  }

  public static compare(token: string, password: string): boolean {
    return compareSync(password, token);
  }
}

export default BcryptService;
