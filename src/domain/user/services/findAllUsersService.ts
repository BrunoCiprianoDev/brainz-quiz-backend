import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IUserPublicData } from '../models/user';
import { IUserRepository } from '../repositories/userRepository';

export const ERROR_MESSAGE_FIND_ALL_USERS_SIZE = 'O parametro size deve ser menor que 20.';

export interface IFindAllUsersData {
  contains: string;
  page: number;
  size: number;
}

export interface IFindAllUsersService {
  execute({ contains, page, size }: IFindAllUsersData): Promise<IUserPublicData[]>;
}

export class FindAllUsersService extends ErrorHandlerServices implements FindAllUsersService {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  public async execute({ contains, page, size }: IFindAllUsersData): Promise<IUserPublicData[]> {
    try {
      if (size > 20) {
        throw new BadRequestError(ERROR_MESSAGE_FIND_ALL_USERS_SIZE);
      }
      return await this.userRepository.findAllUsers({ contains, page, size });
    } catch (error) {
      this.handleError(error);
    }
  }
}
