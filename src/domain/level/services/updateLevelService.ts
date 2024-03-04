import { ISubject } from '../../subject/models/subject';
import { BadRequestError, NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ILevel } from '../models/level';
import { ILevelRepository } from '../repositories/levelRepository';

export const ERROR_MESSAGE_UPDATE_LEVEL_INVALID_NAME = 'Descrição inválida';
export const ERROR_MESSAGE_UPDATE_LEVEL_NOT_FOUND_BY_ID = 'Assunto não encontrado';

export interface IUpdateLevelService {
  execute(level: ILevel): Promise<ISubject>;
}

export class UpdateLevelService extends ErrorHandlerServices implements IUpdateLevelService {
  constructor(private levelRepository: ILevelRepository) {
    super();
  }

  public async execute(level: ILevel): Promise<ISubject> {
    try {
      if (!level.description || level.description.trim() === '') {
        throw new BadRequestError(ERROR_MESSAGE_UPDATE_LEVEL_INVALID_NAME);
      }
      if (!(await this.levelRepository.findById(level.id))) {
        throw new NotFoundError(ERROR_MESSAGE_UPDATE_LEVEL_NOT_FOUND_BY_ID);
      }
      await this.levelRepository.update(level);
      return level;
    } catch (error) {
      this.handleError(error);
    }
  }
}
