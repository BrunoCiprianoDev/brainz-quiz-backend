import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import BaseRepositoryPrisma from './baseRepositoryPrisma';
import { IUser, IUserPublicData } from '@src/domain/util/models/userModels';

export class UserRepositoryPrisma extends BaseRepositoryPrisma implements IUserRepository {
  public async create(data: IUser): Promise<void> {
    try {
      await this.dbClientInstance.user.create({ data });
    } catch (error) {
      this.handleError(error);
    }
  }
  public async update(data: IUser): Promise<void> {
    try {
      await this.dbClientInstance.user.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }
  public async findById(data: { id: string }): Promise<IUser | null> {
    try {
      return await this.dbClientInstance.user.findUnique({ where: data });
    } catch (error) {
      this.handleError(error);
    }
  }
  public async findByEmail(data: { email: string }): Promise<IUser | null> {
    try {
      return await this.dbClientInstance.user.findUnique({ where: data });
    } catch (error) {
      this.handleError(error);
    }
  }
  public async findAll(data: { query: string; page: number; size: number }): Promise<IUserPublicData[]> {
    try {
      return await this.dbClientInstance.user.findMany({
        where: {
          email: {
            contains: data.query,
          },
        },
        skip: (data.page - 1) * data.size,
        take: +data.size,
        select: {
          id: true,
          email: true,
          role: true
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }
  public async existsByEmail(data: { email: string }): Promise<boolean> {
    try {
      const result = await this.dbClientInstance.user.findUnique({ where: data });
      return !!result;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async existsById(data: { id: string }): Promise<boolean> {
    try {
      const result = await this.dbClientInstance.user.findUnique({ where: data });
      return !!result;
    } catch (error) {
      this.handleError(error);
    }
  }
}
