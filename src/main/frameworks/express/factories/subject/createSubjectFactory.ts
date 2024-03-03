import { CreateSubjectController } from '../../../../../domain/subject/controllers/createSubjectController';
import { CreateSubjectService } from '../../../../../domain/subject/services/createSubjectService';
import { UuidGenerator } from '../../../../../shared/uuidGenerator';
import { SubjectRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/subjectRepositoryPrisma';

export function createSubjectFactory() {
  const uuidGenerator = new UuidGenerator();
  const subjectRepository = new SubjectRepositoryPrisma();
  const createSubjectService = new CreateSubjectService(uuidGenerator, subjectRepository);
  const createSubjectController = new CreateSubjectController(createSubjectService);

  return createSubjectController;
}
