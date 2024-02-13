import { ISubject, ISubjectCreateData } from '@src/domain/entities/subject';

export interface ISubjectRepository {
  create(data: ISubjectCreateData): Promise<ISubject>;

  updateDescription(data: { id: string; description: string }): Promise<ISubject>;

  findById(data: { id: string }): Promise<ISubject>;

  findAll(data: { query: string; page: number; size: number }): Promise<ISubject[]>;

  findAllDeleted(data: { query: string; page: number; size: number }): Promise<ISubject[]>;

  restore(data: { id: string }): Promise<void>;

  delete(data: { id: string }): Promise<void>;

  existsById(data: { id: string }): Promise<boolean>;
}
