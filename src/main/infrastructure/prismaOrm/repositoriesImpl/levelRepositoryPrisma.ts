import { ILevel } from "../../../../domain/level/models/level";
import { ILevelRepository } from "../../../../domain/level/repositories/levelRepository";
import BaseRepositoryPrisma from "./baseRepositoryPrisma";

export class LevelRepositoryPrisma extends BaseRepositoryPrisma implements ILevelRepository {

  constructor() {
    super();
  }

  public async create(level: ILevel): Promise<void> {
    try {
      await this.dbClientInstance.level.create({ data: level });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(level: ILevel): Promise<void> {
    try {
      await this.dbClientInstance.level.update({
        where: { id: level.id },
        data: level,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(id: string): Promise<ILevel | null> {
    try {
      return await this.dbClientInstance.level.findUnique({
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
  }): Promise<ILevel[]> {
    try {
      return await this.dbClientInstance.level.findMany({
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
          points: true,
          isDeleted: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }


}