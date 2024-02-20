import { IToken, IUserPublicData } from '@src/domain/util/models/userModels';

export interface ITokenGenerator {
  generateAuthToken(data: { id: string; role: string }): Promise<IToken>;
  generateTokenResetPass(user: IUserPublicData): Promise<IToken>;
  getPayloadTokenResetPass(token: string): Promise<IUserPublicData>;
}
