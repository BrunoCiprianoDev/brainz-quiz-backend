import { IPasswordEncryptor } from '../../util/adapters/passwordEncryptor';
import { IuuidGenerator } from '../../util/adapters/uuidGenerator';
import { BadRequestError, InternalServerError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { isValidEmail } from '../../util/validators/emailValidator';
import { isValidEnumValue } from '../../util/validators/enumValidator';
import { isValidPassword } from '../../util/validators/passwordValidator';
import { IUserCreateData, IUserPublicData, Role } from '../models/user';
import { IUserRepository } from '../repositories/userRepository';

export const ERROR_MESSAGE_INVALID_EMAIL = 'Email inválido.';
export const ERROR_MESSAGE_INVALID_PASSWORD = 'Senha inválida, certifique-se que ela tenha no mínimo 8 caracteres.';
export const ERROR_MESSAGE_EMAIL_ALREADY_EXISTS = 'O email informado já está sendo usado por outro usuário.';
export const ERROR_MESSAGE_PASSWORD_CONFIRM = 'A senha e confirmação de senha devem ser iguais.';
export const ERROR_MESSAGE_INVALID_ROLE = 'Permissão inválida.';

export interface ICreateUserService {
  execute({ email, password, confirmPassword, role }: IUserCreateData): Promise<IUserPublicData>;
}

export class CreateUserService extends ErrorHandlerServices implements ICreateUserService {
  constructor(
    private uuidGenerator: IuuidGenerator,
    private passwordEncryptor: IPasswordEncryptor,
    private userRepository: IUserRepository,
  ) {
    super();
  }

  public async execute({ email, password, confirmPassword, role }: IUserCreateData): Promise<IUserPublicData> {
    try {
      if (!isValidEmail(email)) {
        throw new BadRequestError(ERROR_MESSAGE_INVALID_EMAIL);
      }
      if (!isValidPassword(password)) {
        throw new BadRequestError(ERROR_MESSAGE_INVALID_PASSWORD);
      }
      if (confirmPassword !== password) {
        throw new BadRequestError(ERROR_MESSAGE_PASSWORD_CONFIRM);
      }
      if (!isValidEnumValue(role, Role)) {
        throw new InternalServerError(ERROR_MESSAGE_INVALID_ROLE);
      }
      if (await this.userRepository.existsByEmail(email)) {
        throw new BadRequestError(ERROR_MESSAGE_EMAIL_ALREADY_EXISTS);
      }

      const id = await this.uuidGenerator.generate();
      const passwordHash = await this.passwordEncryptor.encryptor(password);

      await this.userRepository.create({ id, email, password: passwordHash, role });

      return { id, email, role };
    } catch (error) {
      this.handleError(error);
    }
  }
}
