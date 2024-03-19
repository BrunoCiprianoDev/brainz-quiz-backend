import { CreateLevelController } from '../../../../../domain/level/controllers/createLevelController';
import { CreateLevelService } from '../../../../../domain/level/services/createLevelService';
import { UuidGenerator } from '../../../../../shared/uuidGenerator';
import { LevelRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/levelRepositoryPrisma';

export function createLevelFactory() {
  const uuidGenerator = new UuidGenerator();
  const levelRepository = new LevelRepositoryPrisma();
  const createLevelService = new CreateLevelService(uuidGenerator, levelRepository);
  const createLevelController = new CreateLevelController(createLevelService);

  return createLevelController;
}
