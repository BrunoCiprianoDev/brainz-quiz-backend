import { FindByIdUsersController } from '../../../../../domain/user/controllers/findByIdUsersController';
import { FindUserByIdService } from '../../../../../domain/user/services/findUserByIdService';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function findByIdUsersFactory() {
  const findUserByIdService = findUserByIdServiceConstructor();
  const findByIdUsersController = new FindByIdUsersController(findUserByIdService);
  return findByIdUsersController;
}

export function findUserByIdServiceConstructor() {
  const userRepository = new UserRepositoryPrisma();
  const findUserByIdService = new FindUserByIdService(userRepository);
  return findUserByIdService;
}
