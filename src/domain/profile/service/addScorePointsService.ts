import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IProfile } from '../models/profile';
import { IProfileRepository } from '../repositories/profileRepository';

export const ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_ID = 'Perfil não encontrado.';

export interface IAddScorePointsService {
  execute(data: { id: string; points: number }): Promise<IProfile>;
}

export class AddScorePointsService extends ErrorHandlerServices implements IAddScorePointsService {
  constructor(private profileRepository: IProfileRepository) {
    super();
  }

  public async execute({ id, points }: { id: string; points: number }): Promise<IProfile> {
    try {
      const profile = await this.profileRepository.findById(id);
      if (!profile) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_ID);
      }
      profile.score = profile.score + points;
      await this.profileRepository.addScorePoins({ id, score: profile.score });
      return profile;
    } catch (error) {
      this.handleError(error);
    }
  }
}
