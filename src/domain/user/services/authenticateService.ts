import { IPasswordEncryptor } from '../../util/adapters/passwordEncryptor';
import { ITokenGenerator } from '../../util/adapters/tokenGenerator';
import { ForbiddenError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IUserRepository } from '../repositories/userRepository';

const ERROR_MESSAGE_INVALID_CREDENTIALS = 'Email ou senha inválidos.';

export interface IAuthenticateService {
  execute(credentials: { email: string; password: string }): Promise<{ token: string }>;
}

export class AuthenticateService extends ErrorHandlerServices implements IAuthenticateService {
  constructor(
    private userRepository: IUserRepository,
    private passwordEncryptor: IPasswordEncryptor,
    private tokenGenerator: ITokenGenerator,
  ) {
    super();
  }

  public async execute(credentials: { email: string; password: string }): Promise<{ token: string }> {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        throw new ForbiddenError(ERROR_MESSAGE_INVALID_CREDENTIALS);
      }
      const passwordMatches = await this.passwordEncryptor.passwordCompare({
        password: credentials.password,
        passwordEncrypt: user.password,
      });
      if (!passwordMatches) {
        throw new ForbiddenError(ERROR_MESSAGE_INVALID_CREDENTIALS);
      }
      const token = await this.tokenGenerator.generateAuthToken({ id: user.id, role: user.role });
      return { token };
    } catch (error) {
      this.handleError(error);
    }
  }
}
