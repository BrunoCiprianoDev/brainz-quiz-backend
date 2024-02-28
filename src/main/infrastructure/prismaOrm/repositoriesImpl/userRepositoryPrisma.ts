import { IUser, IUserPublicData } from '../../../../domain/user/models/user';
import { IUserRepository } from '../../../../domain/user/repositories/userRepository';
import { IFindAllUsersData } from '../../../../domain/user/services/findAllUsersService';
import BaseRepositoryPrisma from './baseRepositoryPrisma';

export class UserRepositoryPrisma extends BaseRepositoryPrisma implements IUserRepository {
  constructor() {
    super();
  }

  public async create(user: IUser): Promise<void> {
    try {
      await this.dbClientInstance.user.create({ data: user });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updateRole({ id, role }: { id: string; role: string }): Promise<void> {
    try {
      await this.dbClientInstance.user.update({
        where: {
          id,
        },
        data: {
          role,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updatePassword({ id, password }: { id: string; password: string }): Promise<void> {
    try {
      await this.dbClientInstance.user.update({
        where: {
          id,
        },
        data: {
          password,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.dbClientInstance.user.findUnique({ where: { email } });
      return !!result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.dbClientInstance.user.findUnique({ where: { email } });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(id: string): Promise<IUserPublicData | null> {
    try {
      const result = await this.dbClientInstance.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAllUsers({ page, size, contains }: IFindAllUsersData): Promise<IUserPublicData[]> {
    try {
      return await this.dbClientInstance.user.findMany({
        where: {
          email: {
            contains,
          },
        },
        skip: (page - 1) * size,
        take: +size,
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async numberOfAdmins(): Promise<number> {
    try {
      return await this.dbClientInstance.user.count({
        where: { role: 'ADMIN' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
