import { CreateUserService } from '../../../../../domain/user/services/createUserService';
import { PasswordEncryptor } from '../../../../../shared/passwordEncryptor';
import { UuidGenerator } from '../../../../../shared/uuidGenerator';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';
import { CreateAdminController } from '../../../../../domain/user/controllers/createAdminController';

export function createAdminUserFactory(): CreateAdminController {
  const uuidGenerator = new UuidGenerator();
  const passwordEncryptor = new PasswordEncryptor();
  const userRepository = new UserRepositoryPrisma();
  const createAdminUserService = new CreateUserService(uuidGenerator, passwordEncryptor, userRepository);
  const createAdminUserController = new CreateAdminController(createAdminUserService);
  return createAdminUserController;
}
