import { FindProfileByUserIdController } from '../../../../../domain/profile/controllers/findProfileByUserIdController';
import { FindProfileByUserIdService } from '../../../../../domain/profile/service/findProfileByUserIdService';
import { ProfileRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/profileRepositoryPrisma';

export function findProfileByUserIdFactory() {
  const profileRepository = new ProfileRepositoryPrisma();
  const findProfileByUserIdService = new FindProfileByUserIdService(profileRepository);
  const findProfileByUserIdController = new FindProfileByUserIdController(findProfileByUserIdService);

  return findProfileByUserIdController;
}
