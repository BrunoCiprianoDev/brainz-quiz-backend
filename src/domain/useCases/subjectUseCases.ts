import { Subject } from '../entities/subject';
import { IuuidGenerator } from '../interfaces/adapters/uuidGenerator';
import { ISubjectRepository } from '../interfaces/repositories/subjectRepository';
import { BadRequestError, NotFoundError } from '../util/errors';
import { ErrorHandlerUseCases } from '../util/errors/errorHandler';
import { IFindAllSubjectData, IFindSubjectById, ISubject, ISubjectCreateData } from '../util/models/subjectModels';

export const ERROR_MESSAGE_SUBJECT_NOT_FOUND_BY_ID = 'Subject not found by id';
export const ERROR_MESSAGE_SUBJECT_FIND_ALL_PARAMS =
  'Error when searching for subjects. Please ensure that: (page > 0), (size > 0), and (size <= 10).';

export interface ISubjectUseCases {
  create(data: ISubjectCreateData): Promise<ISubject>;
  update(data: ISubject): Promise<ISubject>;
  findById(data: IFindSubjectById): Promise<ISubject>;
  findAll(data: IFindAllSubjectData): Promise<ISubject[]>;
}

export class SubjectUseCases extends ErrorHandlerUseCases implements ISubjectUseCases {
  constructor(
    private subjectRepository: ISubjectRepository,
    private uuidGenerator: IuuidGenerator,
  ) {
    super();
  }

  public async create(data: ISubjectCreateData): Promise<ISubject> {
    try {
      const id = await this.uuidGenerator.generate();
      const subjectToCreate = new Subject({ id, ...data, isActive: true });
      await this.subjectRepository.create(subjectToCreate.data);
      return subjectToCreate.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(data: ISubject): Promise<ISubject> {
    try {
      await this.findById({ id: data.id });
      const subjectToUpdate = new Subject(data);
      await this.subjectRepository.update(subjectToUpdate.data);
      return subjectToUpdate;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(data: IFindSubjectById): Promise<ISubject> {
    try {
      const result = await this.subjectRepository.findById(data);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_SUBJECT_NOT_FOUND_BY_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(data: IFindAllSubjectData): Promise<ISubject[]> {
    try {
      if (data.page < 1 || data.size < 1 || data.size > 10) {
        throw new BadRequestError(ERROR_MESSAGE_SUBJECT_FIND_ALL_PARAMS);
      }
      return await this.subjectRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
