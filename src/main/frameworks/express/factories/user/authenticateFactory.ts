import { AuthenticateController } from '../../../../../domain/user/controllers/authenticateController';
import { AuthenticateService } from '../../../../../domain/user/services/authenticateService';
import { PasswordEncryptor } from '../../../../../shared/passwordEncryptor';
import { TokenGenerator } from '../../../../../shared/tokenGenerator';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function authenticateFactory() {
  const userRepository = new UserRepositoryPrisma();
  const passwordEncryptor = new PasswordEncryptor();
  const tokenGenerator = new TokenGenerator();
  const autheticationService = new AuthenticateService(userRepository, passwordEncryptor, tokenGenerator);
  const authenticateController = new AuthenticateController(autheticationService);

  return authenticateController;
}
