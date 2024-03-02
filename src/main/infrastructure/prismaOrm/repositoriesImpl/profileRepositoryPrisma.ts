import { IProfile } from '../../../../domain/profile/models/profile';
import { IProfileRepository } from '../../../../domain/profile/repositories/profileRepository';
import BaseRepositoryPrisma from './baseRepositoryPrisma';

export class ProfileRepositoryPrisma extends BaseRepositoryPrisma implements IProfileRepository {
  constructor() {
    super();
  }

  public async create(profile: IProfile): Promise<void> {
    try {
      await this.dbClientInstance.profile.create({ data: profile });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(id: string): Promise<IProfile | null> {
    try {
      return this.dbClientInstance.profile.findUnique({ where: { id } });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findByUserId(userId: string): Promise<IProfile | null> {
    try {
      return this.dbClientInstance.profile.findFirst({ where: { userId } });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updateName({ id, name }: { id: string; name: string }): Promise<void> {
    try {
      await this.dbClientInstance.profile.update({
        where: { id },
        data: { name },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async addScorePoins({ id, score }: { id: string; score: number }): Promise<void> {
    try {
      await this.dbClientInstance.profile.update({
        where: { id },
        data: { score },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async userAlreadyHaveProfile(userId: string): Promise<boolean> {
    try {
      return !!(await this.dbClientInstance.profile.findFirst({
        where: { userId },
      }));
    } catch (error) {
      this.handleError(error);
    }
  }
}
