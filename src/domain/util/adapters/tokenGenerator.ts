import { IUserPublicData } from '../../user/models/user';

export interface ITokenGenerator {
  generateAuthToken(data: { id: string; role: string }): Promise<string>;
  getPayloadAuthToken(token: string): Promise<{ id: string; role: string }>;
  generateTokenResetPass(user: IUserPublicData): Promise<string>;
  getPayloadTokenResetPass(token: string): Promise<IUserPublicData>;
}
