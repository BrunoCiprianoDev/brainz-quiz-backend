import { UpdatePasswordController } from '../../../../../domain/user/controllers/updatePasswordController';
import { UpdatePasswordService } from '../../../../../domain/user/services/updatePasswordService';
import { PasswordEncryptor } from '../../../../../shared/passwordEncryptor';
import { TokenGenerator } from '../../../../../shared/tokenGenerator';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function updatePasswordFactory() {
  const tokenGenerator = new TokenGenerator();
  const userRepository = new UserRepositoryPrisma();
  const passwordEncryptor = new PasswordEncryptor();

  const updatePasswordService = new UpdatePasswordService(tokenGenerator, userRepository, passwordEncryptor);

  const updatePasswordController = new UpdatePasswordController(updatePasswordService);

  return updatePasswordController;
}
