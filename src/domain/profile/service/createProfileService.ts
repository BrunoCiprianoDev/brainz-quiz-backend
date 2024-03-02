import { IFindUserByIdService } from '../../user/services/findUserByIdService';
import { IuuidGenerator } from '../../util/adapters/uuidGenerator';
import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IProfile } from '../models/profile';
import { IProfileRepository } from '../repositories/profileRepository';

export const ERROR_MESSAGE_THIS_USER_ALREADY_HAS_PROFILE = 'Esse usuário já possui um perfil cadastrado.';

export interface ICreateProfileService {
  execute(data: { name: string; userId: string }): Promise<IProfile>;
}

export class CreateProfileService extends ErrorHandlerServices implements ICreateProfileService {
  constructor(
    private profileRepository: IProfileRepository,
    private findUserByIdService: IFindUserByIdService,
    private uuidGenerator: IuuidGenerator,
  ) {
    super();
  }

  public async execute({ name, userId }: { name: string; userId: string }): Promise<IProfile> {
    try {
      await this.findUserByIdService.execute(userId);
      if (await this.profileRepository.userAlreadyHaveProfile(userId)) {
        throw new BadRequestError(ERROR_MESSAGE_THIS_USER_ALREADY_HAS_PROFILE);
      }
      const uuid = await this.uuidGenerator.generate();
      const profileToCreate = {
        id: uuid,
        userId,
        name,
        score: 0,
      };
      await this.profileRepository.create(profileToCreate);
      return profileToCreate;
    } catch (error) {
      this.handleError(error);
    }
  }
}
