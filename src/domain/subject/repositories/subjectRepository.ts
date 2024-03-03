import { ISubject } from '../models/subject';

export interface ISubjectRepository {
  create(subject: ISubject): Promise<void>;
  update(subject: ISubject): Promise<void>;
  findById(id: string): Promise<ISubject | null>;
  findAll(data: { contains: string; page: number; size: number; isDeleted: boolean }): Promise<ISubject[]>;
}
