import { ITokenPayload } from '@src/domain/util/models/authModels';
import { IUserPublicData } from '@src/domain/util/models/userModels';

export interface ITokenGenerator {
  generateToken(user: IUserPublicData): Promise<ITokenPayload>;
  getPayload(token: string): Promise<IUserPublicData>;
}
