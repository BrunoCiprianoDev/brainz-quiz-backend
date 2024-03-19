import { FindLevelByIdController } from "../../../../../domain/level/controllers/findLevelByIdController";
import { FindLevelByIdService } from "../../../../../domain/level/services/findLevelByIdService";
import { LevelRepositoryPrisma } from "../../../../infrastructure/prismaOrm/repositoriesImpl/levelRepositoryPrisma";

export function findLevelByIdFactory() {
  const subjectRepository = new LevelRepositoryPrisma();
  const findLevelByIdService = new FindLevelByIdService(subjectRepository);
  const findLevelByIdController = new FindLevelByIdController(findLevelByIdService);

  return findLevelByIdController;
}
