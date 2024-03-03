import { BadRequestError, NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ISubject } from '../models/subject';
import { ISubjectRepository } from '../repositories/subjectRepository';

export const ERROR_MESSAGE_UPDATE_SUBJECT_INVALID_NAME = 'Descrição inválida';
export const ERROR_MESSAGE_UPDATE_SUBJECT_NOT_FOUND_BY_ID = 'Assunto não encontrado';

export interface IUpdateSubjectService {
  execute(subject: ISubject): Promise<ISubject>;
}

export class UpdateSubjectService extends ErrorHandlerServices implements IUpdateSubjectService {
  constructor(private subjectRepository: ISubjectRepository) {
    super();
  }

  public async execute(subject: ISubject): Promise<ISubject> {
    try {
      if (!subject.description || subject.description.trim() === '') {
        throw new BadRequestError(ERROR_MESSAGE_UPDATE_SUBJECT_INVALID_NAME);
      }
      if (!(await this.subjectRepository.findById(subject.id))) {
        throw new NotFoundError(ERROR_MESSAGE_UPDATE_SUBJECT_NOT_FOUND_BY_ID);
      }
      await this.subjectRepository.update(subject);
      return subject;
    } catch (error) {
      this.handleError(error);
    }
  }
}
