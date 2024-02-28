import { IPasswordEncryptor } from '../../domain/util/adapters/passwordEncryptor';
import logger from '../logger';
import { compare, hash } from 'bcryptjs';

export class PasswordEncryptor implements IPasswordEncryptor {
  public async encryptor(password: string): Promise<string> {
    try {
      return await hash(password, 8);
    } catch (error) {
      const message = `Error PasswordEncryptor 'bcrypt' password`;
      logger.error(message);
      throw Error(message);
    }
  }

  public async passwordCompare(data: { password: string; passwordEncrypt: string }): Promise<boolean> {
    try {
      return await compare(data.password, data.passwordEncrypt);
    } catch (error) {
      const message = `Error PasswordCompare 'bcrypt' password`;
      logger.error(message);
      throw Error(message);
    }
  }
}
