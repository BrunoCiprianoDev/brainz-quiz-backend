import { AddScorePointsController } from '../../../../../domain/profile/controllers/addScorePointsController';
import { AddScorePointsService } from '../../../../../domain/profile/service/addScorePointsService';
import { ProfileRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/profileRepositoryPrisma';

export function addScorePointsFactory() {
  const profileRepository = new ProfileRepositoryPrisma();
  const addScorePointsService = new AddScorePointsService(profileRepository);
  const addScorePointsController = new AddScorePointsController(addScorePointsService);

  return addScorePointsController;
}
