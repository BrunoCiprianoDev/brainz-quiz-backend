import { CreateUserService } from '../../../../../domain/user/services/createUserService';
import { PasswordEncryptor } from '../../../../../shared/passwordEncryptor';
import { UuidGenerator } from '../../../../../shared/uuidGenerator';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';
import { CreateStandardController } from '../../../../../domain/user/controllers/createStandardController';

export function createStandardUserFactory(): CreateStandardController {
  const uuidGenerator = new UuidGenerator();
  const passwordEncryptor = new PasswordEncryptor();
  const userRepository = new UserRepositoryPrisma();
  const createStandardUserService = new CreateUserService(uuidGenerator, passwordEncryptor, userRepository);
  const createStandardUserController = new CreateStandardController(createStandardUserService);
  return createStandardUserController;
}
