import { ISubject } from '../../../../domain/subject/models/subject';
import { ISubjectRepository } from '../../../../domain/subject/repositories/subjectRepository';
import BaseRepositoryPrisma from './baseRepositoryPrisma';

export class SubjectRepositoryPrisma extends BaseRepositoryPrisma implements ISubjectRepository {
  constructor() {
    super();
  }

  public async create(subject: ISubject): Promise<void> {
    try {
      await this.dbClientInstance.subject.create({ data: subject });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(subject: ISubject): Promise<void> {
    try {
      await this.dbClientInstance.subject.update({
        where: { id: subject.id },
        data: subject,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(id: string): Promise<ISubject | null> {
    try {
      return await this.dbClientInstance.subject.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll({
    contains,
    page,
    size,
    isDeleted,
  }: {
    contains: string;
    page: number;
    size: number;
    isDeleted: boolean;
  }): Promise<ISubject[]> {
    try {
      return await this.dbClientInstance.subject.findMany({
        where: {
          description: {
            contains,
          },
          isDeleted,
        },
        skip: (page - 1) * size,
        take: +size,
        select: {
          id: true,
          description: true,
          isDeleted: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
