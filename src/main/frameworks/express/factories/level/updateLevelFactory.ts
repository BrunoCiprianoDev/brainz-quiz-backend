import { UpdateLevelController } from "../../../../../domain/level/controllers/updateLevelController";
import { UpdateLevelService } from "../../../../../domain/level/services/updateLevelService";
import { LevelRepositoryPrisma } from "../../../../infrastructure/prismaOrm/repositoriesImpl/levelRepositoryPrisma";

export function updateLevelFactory() {
  const levelRepository = new LevelRepositoryPrisma();
  const updateLevelService = new UpdateLevelService(levelRepository);
  const updateLevelController = new UpdateLevelController(updateLevelService);

  return updateLevelController;
}
