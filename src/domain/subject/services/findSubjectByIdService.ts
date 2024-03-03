import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ISubject } from '../models/subject';
import { ISubjectRepository } from '../repositories/subjectRepository';

export const ERROR_MESSAGE_FIND_BY_ID_SUBJECT = 'Assunto não encontrado pelo id';

export interface IFindSubjectByIdService {
  execute(id: string): Promise<ISubject>;
}

export class FindSubjectByIdService extends ErrorHandlerServices implements IFindSubjectByIdService {
  constructor(private subjectRepository: ISubjectRepository) {
    super();
  }

  public async execute(id: string): Promise<ISubject> {
    try {
      const result = await this.subjectRepository.findById(id);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_FIND_BY_ID_SUBJECT);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
}
