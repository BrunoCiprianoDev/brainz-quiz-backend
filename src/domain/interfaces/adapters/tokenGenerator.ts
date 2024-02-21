import { IToken, IUserPublicData } from '@src/domain/util/models/userModels';

export interface ITokenGenerator {
  generateAuthToken(data: { id: string; role: string }): Promise<IToken>;
  getPayloadAuthToken(token: string): Promise<{ id: string, role: string }>;
  generateTokenResetPass(user: IUserPublicData): Promise<IToken>;
  getPayloadTokenResetPass(token: string): Promise<IUserPublicData>;
}
