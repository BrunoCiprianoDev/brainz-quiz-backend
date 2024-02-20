import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';
import { IToken, IUserPublicData } from '@src/domain/util/models/userModels';
import { sign } from 'jsonwebtoken';
import config from 'config';
import logger from '@src/shared/logger/logger';
import { ValidationError } from '@src/domain/util/errors';
import { verify } from 'jsonwebtoken';

export const ERROR_MESSAGE_INVALID_TOKEN_RESET_MESSAGE = 'Invalid token reset pass';

export class TokenGenerator implements ITokenGenerator {
  public async generateAuthToken({ id, role }: { id: string; role: string }): Promise<IToken> {
    try {
      const token = sign(
        {
          id,
          role,
        },
        config.get('App.security.tokenPayloadSecret') as string,
        {
          subject: id,
          expiresIn: config.get('App.security.tokenPayloadExpires'),
        },
      );
      return { token };
    } catch (error) {
      if (error instanceof Error) {
        logger.error('[generateAuthToken] ' + error.message);
      }
      throw error;
    }
  }
  public async generateTokenResetPass({ id, email, role }: IUserPublicData): Promise<IToken> {
    try {
      const token = sign(
        {
          id,
          email,
          role,
        },
        config.get('App.security.tokenForgotPassSercret') as string,
        {
          subject: id,
          expiresIn: config.get('App.security.tokenForgotPassExpires'),
        },
      );
      return { token };
    } catch (error) {
      if (error instanceof Error) {
        logger.error('[generateTokenResetPass] ' + error.message);
      }
      throw error;
    }
  }
  public async getPayloadTokenResetPass(token: string): Promise<IUserPublicData> {
    try {
      const [, tokenLocal] = token.split(' ');
      const payload = verify(tokenLocal, config.get('App.tokenPayloadSecret')) as IUserPublicData;
      return payload;
    } catch (error) {
      throw new ValidationError(ERROR_MESSAGE_INVALID_TOKEN_RESET_MESSAGE);
    }
  }
}
