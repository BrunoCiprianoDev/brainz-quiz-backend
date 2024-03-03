import { UpdateSubjectController } from '../../../../../domain/subject/controllers/updateSubjectController';
import { UpdateSubjectService } from '../../../../../domain/subject/services/updateSubjectService';
import { SubjectRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/subjectRepositoryPrisma';

export function updateSubjectFactory() {
  const subjectRepository = new SubjectRepositoryPrisma();
  const updateSubjectService = new UpdateSubjectService(subjectRepository);
  const updateSubjectController = new UpdateSubjectController(updateSubjectService);

  return updateSubjectController;
}
