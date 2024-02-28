import { BadRequestError, NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { isValidEnumValue } from '../../util/validators/enumValidator';
import { IUserPublicData, Role } from '../models/user';
import { IUserRepository } from '../repositories/userRepository';

export const ERROR_MESSAGE_INVALID_ROLE_TO_UPDATE = 'A permissão informada não é válida.';
export const ERROR_MESSAGE_NOT_FOUND_USER_ID_FROM_UPDATE = 'Nenhum usuário encontrado com o id informado.';
export const ERROR_MESSAGE_NUMBER_OF_ADMINS = 'O sistema deve conter, pelo menos, 1 administrador.';

export interface IUpdateRoleData {
  id: string;
  role: string;
}
export interface IUpdateRoleService {
  execute({ id, role }: IUpdateRoleData): Promise<IUserPublicData>;
}

export class UpdateRoleService extends ErrorHandlerServices implements IUpdateRoleService {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  public async execute({ id, role }: IUpdateRoleData): Promise<IUserPublicData> {
    try {
      if (!isValidEnumValue(role, Role)) {
        throw new BadRequestError(ERROR_MESSAGE_INVALID_ROLE_TO_UPDATE);
      }
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER_ID_FROM_UPDATE);
      }
      if (role !== Role.Admin && user.role === Role.Admin) {
        const numberOfAdmins = await this.userRepository.numberOfAdmins();
        if (numberOfAdmins <= 1) {
          throw new BadRequestError(ERROR_MESSAGE_NUMBER_OF_ADMINS);
        }
      }
      user.role = role;
      await this.userRepository.updateRole({ id, role });
      return user;
    } catch (error) {
      this.handleError(error);
    }
  }
}
