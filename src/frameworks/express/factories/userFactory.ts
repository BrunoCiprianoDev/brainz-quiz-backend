import { IUserControllers, UserControllers } from '@src/domain/interfaces/controllers/userControllers';
import { UserRepositoryPrisma } from '@src/infraestructure/prismaORM/repositories/userRepositoryPrisma';
import { PasswordEncryptor } from '../ports/passwordEncryptor';
import { UuidGenerator } from '../ports/uuidGenerator';
import { UserUseCases } from '@src/domain/useCases/userUseCases';
import { TokenGenerator } from '../ports/tokenGenerator';
import { EmailSender } from '../ports/emailSender';

let cachedUserController: UserControllers | null = null;

export function userFactory(): IUserControllers {
  if (!cachedUserController) {
    const userRepository = new UserRepositoryPrisma();
    const passwordEncryptor = new PasswordEncryptor();
    const uuidGenerator = new UuidGenerator();
    const tokenGenerator = new TokenGenerator();
    const emailSender = new EmailSender();
    const userUseCases = new UserUseCases(
      userRepository,
      uuidGenerator,
      passwordEncryptor,
      tokenGenerator,
      emailSender,
    );
    cachedUserController = new UserControllers(userUseCases);
  }
  return cachedUserController;
}
