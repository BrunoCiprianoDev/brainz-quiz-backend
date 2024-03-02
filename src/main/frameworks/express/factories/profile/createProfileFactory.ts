import { CreateProfileController } from '../../../../../domain/profile/controllers/createProfileController';
import { CreateProfileService } from '../../../../../domain/profile/service/createProfileService';
import { UuidGenerator } from '../../../../../shared/uuidGenerator';
import { ProfileRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/profileRepositoryPrisma';
import { findUserByIdServiceConstructor } from '../user/findByIdUsersFactory';

export function createProfileFactory() {
  const profileRepository = new ProfileRepositoryPrisma();
  const findUserByIdService = findUserByIdServiceConstructor();
  const uuidGenerator = new UuidGenerator();

  const createProfileService = new CreateProfileService(profileRepository, findUserByIdService, uuidGenerator);

  return new CreateProfileController(createProfileService);
}
