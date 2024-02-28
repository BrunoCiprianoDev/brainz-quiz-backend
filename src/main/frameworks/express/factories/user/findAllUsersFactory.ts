import { FindAllUsersController } from '../../../../../domain/user/controllers/findAllUsersController';
import { FindAllUsersService } from '../../../../../domain/user/services/findAllUsersService';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function findAllUsersFactory(): FindAllUsersController {
  const userRepository = new UserRepositoryPrisma();
  const findAllUsersService = new FindAllUsersService(userRepository);
  const findAllUsersController = new FindAllUsersController(findAllUsersService);
  return findAllUsersController;
}
