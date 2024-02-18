import { Level } from '../entities/level';
import { IuuidGenerator } from '../interfaces/adapters/uuidGenerator';
import { ILevelRepository } from '../interfaces/repositories/levelRepository';
import { BadRequestError, NotFoundError } from '../util/errors';
import { ErrorHandlerUseCases } from '../util/errors/errorHandler';
import { IFindAllLevelData, IFindLevelByIdData, ILevel, ILevelCreateData } from '../util/models/levelModels';

export const ERROR_MESSAGE_LEVEL_NOT_FOUND_BY_ID = 'Level not found by id';
export const ERROR_MESSAGE_LEVEL_FIND_ALL_PARAMS =
  'Error when searching for levels. Please ensure that: (page > 0), (size > 0), and (size <= 10).';

export interface ILeveUseCases {
  create(data: ILevelCreateData): Promise<ILevel>;
  update(data: ILevel): Promise<ILevel>;
  findById(data: IFindLevelByIdData): Promise<ILevel>;
  findAll(data: IFindAllLevelData): Promise<ILevel[]>;
}

export class LevelUseCases extends ErrorHandlerUseCases implements ILeveUseCases {
  constructor(
    private levelRepository: ILevelRepository,
    private uuidGenerator: IuuidGenerator,
  ) {
    super();
  }

  public async create(data: ILevelCreateData): Promise<ILevel> {
    try {
      const id = await this.uuidGenerator.generate();
      const levelToCreate = new Level({ id, ...data, isActive: true });
      await this.levelRepository.create(levelToCreate.data);
      return levelToCreate.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(data: ILevel): Promise<ILevel> {
    try {
      await this.findById({ id: data.id });
      const levelToUpdate = new Level(data);
      await this.levelRepository.update(levelToUpdate.data);
      return levelToUpdate;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(data: IFindLevelByIdData): Promise<ILevel> {
    try {
      const result = await this.levelRepository.findById(data);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_LEVEL_NOT_FOUND_BY_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(data: IFindAllLevelData): Promise<ILevel[]> {
    try {
      if (data.page < 1 || data.size < 1 || data.size > 10) {
        throw new BadRequestError(ERROR_MESSAGE_LEVEL_FIND_ALL_PARAMS);
      }
      return await this.levelRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
