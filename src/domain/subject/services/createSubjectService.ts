import { IuuidGenerator } from '../../util/adapters/uuidGenerator';
import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ISubject } from '../models/subject';
import { ISubjectRepository } from '../repositories/subjectRepository';

export const ERROR_MESSAGE_CREATE_SUBJECT_INVALID_NAME = 'Descrição inválida';

export interface ICreateSubjectService {
  execute(description: string): Promise<ISubject>;
}

export class CreateSubjectService extends ErrorHandlerServices implements ICreateSubjectService {
  constructor(
    private uuidGenerator: IuuidGenerator,
    private subjectRespository: ISubjectRepository,
  ) {
    super();
  }

  public async execute(description: string): Promise<ISubject> {
    try {
      if (!description || description.trim() === '') {
        throw new BadRequestError(ERROR_MESSAGE_CREATE_SUBJECT_INVALID_NAME);
      }
      const id = await this.uuidGenerator.generate();
      const subject = {
        id,
        description,
        isDeleted: false,
      };
      await this.subjectRespository.create(subject);
      return subject;
    } catch (error) {
      this.handleError(error);
    }
  }
}
