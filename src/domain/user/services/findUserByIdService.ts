import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IUserPublicData } from '../models/user';
import { IUserRepository } from '../repositories/userRepository';

export const ERROR_MESSAGE_NOT_FOUND_USER_BY_ID = 'Nenhum usuário encontrado com o id informado.';

export interface IFindUserByIdService {
  execute(id: string): Promise<IUserPublicData>;
}

export class FindUserByIdService extends ErrorHandlerServices implements IFindUserByIdService {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  public async execute(id: string): Promise<IUserPublicData> {
    try {
      const result = await this.userRepository.findById(id);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER_BY_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
}
