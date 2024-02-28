import { IPasswordEncryptor } from '../../util/adapters/passwordEncryptor';
import { ITokenGenerator } from '../../util/adapters/tokenGenerator';
import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { isValidPassword } from '../../util/validators/passwordValidator';
import { IUserRepository } from '../repositories/userRepository';

export const ERROR_PASSWORD_CONFIRMPASSWORD_NOT_MATCHES = 'Senha e confirmação de senha não batem.';
export const ERROR_PASSWORD_ID_NOT_VALID = 'Senha inválida verifique se ela possui, mínimo 8 caracteres';
export const ERROR_INVALID_TOKEN_FORGOT_PASS = 'Token inválido';

export interface IUpdatePasswordService {
  execute(data: { token: string; password: string; confirmPassword: string }): Promise<void>;
}

export class UpdatePasswordService extends ErrorHandlerServices implements IUpdatePasswordService {
  constructor(
    private tokenGenerator: ITokenGenerator,
    private userRepository: IUserRepository,
    private passwordEncryptor: IPasswordEncryptor,
  ) {
    super();
  }

  public async execute(data: { token: string; password: string; confirmPassword: string }): Promise<void> {
    try {
      if (data.password !== data.confirmPassword) {
        throw new BadRequestError(ERROR_PASSWORD_CONFIRMPASSWORD_NOT_MATCHES);
      }
      if (!isValidPassword(data.password)) {
        throw new BadRequestError(ERROR_PASSWORD_ID_NOT_VALID);
      }

      const { id, email } = await this.tokenGenerator.getPayloadTokenResetPass(data.token);

      const currentUser = await this.userRepository.findByEmail(email);

      if (!currentUser) {
        throw new BadRequestError(ERROR_INVALID_TOKEN_FORGOT_PASS);
      }

      const passwordHash = await this.passwordEncryptor.encryptor(data.password);

      await this.userRepository.updatePassword({ id, password: passwordHash });
    } catch (error) {
      this.handleError(error);
    }
  }
}
