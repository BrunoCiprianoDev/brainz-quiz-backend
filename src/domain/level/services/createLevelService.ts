import { IuuidGenerator } from '../../util/adapters/uuidGenerator';
import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ILevel } from '../models/level';
import { ILevelRepository } from '../repositories/levelRepository';

export const ERROR_MESSAGE_CREATE_LEVEL_INVALID_NAME = 'Descrição inválida';

export interface ICreateLevelService {
  execute({ description, points }: { description: string, points: number }): Promise<ILevel>;
}

export class CreateLevelService extends ErrorHandlerServices implements ICreateLevelService {
  constructor(
    private uuidGenerator: IuuidGenerator,
    private levelRespository: ILevelRepository,
  ) {
    super();
  }

  public async execute({ description, points }: { description: string, points: number }): Promise<ILevel> {
    try {
      if (!description || description.trim() === '') {
        throw new BadRequestError(ERROR_MESSAGE_CREATE_LEVEL_INVALID_NAME);
      }
      const id = await this.uuidGenerator.generate();
      const level = {
        id,
        description,
        points,
        isDeleted: false,
      };
      await this.levelRespository.create(level);
      return level;
    } catch (error) {
      this.handleError(error);
    }
  }
}
