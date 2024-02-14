import { ISubject, ISubjectCreateData, ISubjectReadyOnly } from '../entities/subject';
import { ISubjectRepository } from '../interfaces/repositories/subjectRepository';
import { isNotEmpty } from '../util/constraints/notEmptyValidation';
import { AppError, BadRequestError, InternalServerError, NotFoundError } from '../util/errors/appErrors';

export interface ISubjectUseCases {
  create(data: ISubjectCreateData): Promise<ISubject>;

  updateDescription(data: { id: string; description: string }): Promise<ISubjectReadyOnly>;

  findById(data: { id: string }): Promise<ISubject>;

  findAll(data: { query: string; page: number; size: number }): Promise<ISubject[]>;

  delete(data: { id: string }): Promise<void>;
}

export class SubjectUseCases implements ISubjectUseCases {
  constructor(private subjectRepository: ISubjectRepository) { }

  public async create({ description }: ISubjectCreateData): Promise<ISubject> {
    try {
      if (!isNotEmpty({ value: description })) {
        throw new BadRequestError('Subject description is not valid');
      }
      const result = await this.subjectRepository.create({ description });
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateDescription({ id, description }: { id: string; description: string }): Promise<ISubjectReadyOnly> {
    try {
      const subjectBeforeUpdated = await this.findById({ id });
      if (!subjectBeforeUpdated) {
        throw new NotFoundError('Subject not found');
      }
      if (!isNotEmpty({ value: description })) {
        throw new BadRequestError('Subject description is not valid');
      }
      const result = await this.subjectRepository.updateDescription({ id, description });
      return { id: result.id, description: result.description };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findById(id: { id: string }): Promise<ISubject> {
    try {
      const result = await this.subjectRepository.findById(id);
      if (!result) {
        throw new NotFoundError('Subject not found');
      }
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findAll({ query, page, size }: { query: string; page: number; size: number }): Promise<ISubject[]> {
    try {
      if (page < 1) {
        page = 1;
      }
      if (size < 1) {
        size = 1;
      }
      return await this.subjectRepository.findAll({ query, page, size });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async delete(id: { id: string }): Promise<void> {
    try {
      const isExists = await this.subjectRepository.existsById(id);
      if (!isExists) {
        throw new NotFoundError('Subject not found');
      }
      await this.subjectRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }
}
