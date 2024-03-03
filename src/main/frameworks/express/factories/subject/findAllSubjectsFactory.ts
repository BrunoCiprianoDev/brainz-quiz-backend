import { FindAllSubjectsController } from '../../../../../domain/subject/controllers/findAllSubjectsController';
import { FindAllSubjectsService } from '../../../../../domain/subject/services/findAllSubjectsService';
import { SubjectRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/subjectRepositoryPrisma';

export function findAllSubjectsFactory() {
  const subjectRepository = new SubjectRepositoryPrisma();
  const findAllSubjectsService = new FindAllSubjectsService(subjectRepository);
  const findAllSubjectsController = new FindAllSubjectsController(findAllSubjectsService);

  return findAllSubjectsController;
}
