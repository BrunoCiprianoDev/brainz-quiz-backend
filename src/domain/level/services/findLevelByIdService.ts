import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { ILevel } from '../models/level';
import { ILevelRepository } from '../repositories/levelRepository';

export const ERROR_MESSAGE_FIND_BY_ID_LEVEL = 'Nível não encontrado pelo id';

export interface IFindLevelByIdService {
  execute(id: string): Promise<ILevel>;
}

export class FindLevelByIdService extends ErrorHandlerServices implements IFindLevelByIdService {
  constructor(private subjectRepository: ILevelRepository) {
    super();
  }

  public async execute(id: string): Promise<ILevel> {
    try {
      const result = await this.subjectRepository.findById(id);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_FIND_BY_ID_LEVEL);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
}
