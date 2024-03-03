import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ISubject } from '../models/subject';
import { ISubjectRepository } from '../repositories/subjectRepository';

export const ERROR_MESSAGE_FIND_ALL_SUBJECTS_SIZE = 'O parametro size deve ser menor que 20.';

export interface IFindAllSubjectsService {
  execute(data: { contains: string; page: number; size: number; isDeleted: boolean }): Promise<ISubject[]>;
}

export class FindAllSubjectsService extends ErrorHandlerServices implements IFindAllSubjectsService {
  constructor(private subjectRepository: ISubjectRepository) {
    super();
  }

  public async execute(data: {
    contains: string;
    page: number;
    size: number;
    isDeleted: boolean;
  }): Promise<ISubject[]> {
    try {
      if (data.size > 20) {
        throw new BadRequestError(ERROR_MESSAGE_FIND_ALL_SUBJECTS_SIZE);
      }
      return this.subjectRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
