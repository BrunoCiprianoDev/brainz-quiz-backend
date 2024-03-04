import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ILevel } from '../models/level';
import { ILevelRepository } from '../repositories/levelRepository';

export const ERROR_MESSAGE_FIND_ALL_LEVELS_SIZE = 'O parametro size deve ser menor que 20.';

export interface IFindAllLevelsService {
  execute(data: { contains: string; page: number; size: number; isDeleted: boolean }): Promise<ILevel[]>;
}

export class FindAllLevelsService extends ErrorHandlerServices implements IFindAllLevelsService {
  constructor(private levelRepository: ILevelRepository) {
    super();
  }

  public async execute(data: {
    contains: string;
    page: number;
    size: number;
    isDeleted: boolean;
  }): Promise<ILevel[]> {
    try {
      if (data.size > 20) {
        throw new BadRequestError(ERROR_MESSAGE_FIND_ALL_LEVELS_SIZE);
      }
      return this.levelRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
