import { FindByIdUsersController } from '../../../../../domain/user/controllers/findByIdUsersController';
import { FindUserByIdService } from '../../../../../domain/user/services/findUserByIdService';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function findByIdUsersFactory() {
  const userRepository = new UserRepositoryPrisma();
  const findUserByIdService = new FindUserByIdService(userRepository);
  const findByIdUsersController = new FindByIdUsersController(findUserByIdService);
  return findByIdUsersController;
}
