import { FindSubjectByIdController } from '../../../../../domain/subject/controllers/findSubjectByIdController';
import { FindSubjectByIdService } from '../../../../../domain/subject/services/findSubjectByIdService';
import { SubjectRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/subjectRepositoryPrisma';

export function findSubjectByIdFactory() {
  const subjectRepository = new SubjectRepositoryPrisma();
  const findSubjectByIdService = new FindSubjectByIdService(subjectRepository);
  const findSubjectByIdController = new FindSubjectByIdController(findSubjectByIdService);

  return findSubjectByIdController;
}
