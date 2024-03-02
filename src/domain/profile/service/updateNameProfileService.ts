import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IProfile } from '../models/profile';
import { IProfileRepository } from '../repositories/profileRepository';

export const ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_ID = 'Perfil não encontrado pelo ID';

export interface IUpdateNameProfileService {
  execute(data: { id: string; name: string }): Promise<IProfile>;
}

export class UpdateNameProfileService extends ErrorHandlerServices implements IUpdateNameProfileService {
  constructor(private profileRepository: IProfileRepository) {
    super();
  }

  public async execute({ id, name }: { id: string; name: string }): Promise<IProfile> {
    try {
      const profile = await this.profileRepository.findById(id);
      if (!profile) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_ID);
      }
      await this.profileRepository.updateName({ id, name });
      profile.name = name;
      return profile;
    } catch (error) {
      this.handleError(error);
    }
  }
}
