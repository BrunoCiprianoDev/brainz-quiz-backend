import { FindAllLevelsController } from "../../../../../domain/level/controllers/findAllLevelController";
import { FindAllLevelsService } from "../../../../../domain/level/services/findAllLevelsService";
import { LevelRepositoryPrisma } from "../../../../infrastructure/prismaOrm/repositoriesImpl/levelRepositoryPrisma";

export function findAllLevelsFactory() {
  const levelRepository = new LevelRepositoryPrisma();
  const findAllLevelsService = new FindAllLevelsService(levelRepository);
  const findAllLevelsController = new FindAllLevelsController(findAllLevelsService);

  return findAllLevelsController;
}
