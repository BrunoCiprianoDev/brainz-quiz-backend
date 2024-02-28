import {
  GetTokenUpdatePasswordController,
  IGetTokenUpdatePasswordController,
} from '../../../../../domain/user/controllers/getTokenUpdatePasswordController';
import { GetTokenUpdatePasswordService } from '../../../../../domain/user/services/getTokenUpdatePasswordService';
import { EmailSender } from '../../../../../shared/emailSender';
import { TokenGenerator } from '../../../../../shared/tokenGenerator';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function getTokenUpdatePasswordFactory(): IGetTokenUpdatePasswordController {
  const userRepository = new UserRepositoryPrisma();
  const tokenGenerator = new TokenGenerator();
  const emailSender = new EmailSender();
  const getTokenForgotPasswordService = new GetTokenUpdatePasswordService(userRepository, tokenGenerator, emailSender);

  const getTokenUpdatePasswordController = new GetTokenUpdatePasswordController(getTokenForgotPasswordService);

  return getTokenUpdatePasswordController;
}
