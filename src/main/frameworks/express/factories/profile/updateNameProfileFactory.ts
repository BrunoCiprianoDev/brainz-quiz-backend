import { UpdateNameProfileController } from '../../../../../domain/profile/controllers/updateNameProfileService';
import { UpdateNameProfileService } from '../../../../../domain/profile/service/updateNameProfileService';
import { ProfileRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/profileRepositoryPrisma';

export function updateNameProfileFactory() {
  const profileRepository = new ProfileRepositoryPrisma();
  const updateNameProfileService = new UpdateNameProfileService(profileRepository);
  const updateNameProfileController = new UpdateNameProfileController(updateNameProfileService);

  return updateNameProfileController;
}
