import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IProfile } from '../models/profile';
import { IProfileRepository } from '../repositories/profileRepository';

export const ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_USER_ID = 'Perfil não encontrado pelo id do usuário';

export interface IFindProfileByUserIdService {
  execute(userId: string): Promise<IProfile>;
}

export class FindProfileByUserIdService extends ErrorHandlerServices implements IFindProfileByUserIdService {
  constructor(private profileRepository: IProfileRepository) {
    super();
  }

  public async execute(userId: string): Promise<IProfile> {
    try {
      const profile = await this.profileRepository.findByUserId(userId);
      if (!profile) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_USER_ID);
      }
      return profile;
    } catch (error) {
      this.handleError(error);
    }
  }
}
