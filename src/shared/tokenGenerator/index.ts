import { sign, verify } from 'jsonwebtoken';
import { IUserPublicData } from '../../domain/user/models/user';
import { ITokenGenerator } from '../../domain/util/adapters/tokenGenerator';
import { BadRequestError } from '../../domain/util/errors/appErrors';
import logger from '../logger';

export const ERROR_MESSAGE_INVALID_TOKEN_RESET_MESSAGE = 'Token inválido.';

export class TokenGenerator implements ITokenGenerator {
  public async generateAuthToken({ id, role }: { id: string; role: string }): Promise<string> {
    try {
      const token = sign(
        {
          id,
          role,
        },
        process.env.TOKEN_PAYLOAD_SECRET as string,
        {
          subject: id,
          expiresIn: process.env.TOKEN_PAYLOAD_EXPIRES_IN,
        },
      );
      return token;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('[generateAuthToken] ' + error.message);
      }
      throw error;
    }
  }

  public async getPayloadAuthToken(token: string): Promise<{ id: string; role: string }> {
    try {
      const payload = verify(token, process.env.TOKEN_PAYLOAD_SECRET as string) as { id: string; role: string };
      return payload;
    } catch (error) {
      throw new BadRequestError(ERROR_MESSAGE_INVALID_TOKEN_RESET_MESSAGE);
    }
  }
  public async generateTokenResetPass({ id, email, role }: IUserPublicData): Promise<string> {
    try {
      const token = sign(
        {
          id,
          email,
          role,
        },
        process.env.TOKEN_FORGOT_PASS_SECRET as string,
        {
          subject: id,
          expiresIn: process.env.TOKEN_FORGOT_PASS_EXPIRES_IN,
        },
      );
      return token;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('[generateTokenResetPass] ' + error.message);
      }
      throw error;
    }
  }
  public async getPayloadTokenResetPass(token: string): Promise<IUserPublicData> {
    try {
      const payload = verify(token, process.env.TOKEN_FORGOT_PASS_SECRET as string) as IUserPublicData;
      return payload;
    } catch (error) {
      throw new BadRequestError(ERROR_MESSAGE_INVALID_TOKEN_RESET_MESSAGE);
    }
  }
}
