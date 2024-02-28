import { IEmailSender } from '../../util/adapters/emailSender';
import { ITokenGenerator } from '../../util/adapters/tokenGenerator';
import { NotFoundError } from '../../util/errors/appErrors';
import { ErrorHandlerServices } from '../../util/errors/handlerError';
import { IUserRepository } from '../repositories/userRepository';

export const ERROR_MESSAGE_NOT_FOUND_USER_EMAIL = 'Nenhum usuário encontrado com o email informado.';

export interface IGetTokenUpdatePasswordService {
  execute(email: string): Promise<void>;
}

export class GetTokenUpdatePasswordService extends ErrorHandlerServices implements IGetTokenUpdatePasswordService {
  constructor(
    private userRepository: IUserRepository,
    private tokenGenerator: ITokenGenerator,
    private emailSender: IEmailSender,
  ) {
    super();
  }

  public async execute(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER_EMAIL);
      }
      const token = await this.tokenGenerator.generateTokenResetPass({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      await this.emailSender.sendTokenForgotPass({ email, token });
    } catch (error) {
      this.handleError(error);
    }
  }
}
