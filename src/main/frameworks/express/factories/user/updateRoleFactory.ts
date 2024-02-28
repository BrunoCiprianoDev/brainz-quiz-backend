import { UpdateRoleController } from '../../../../../domain/user/controllers/updateRoleController';
import { UpdateRoleService } from '../../../../../domain/user/services/updateRoleService';
import { UserRepositoryPrisma } from '../../../../infrastructure/prismaOrm/repositoriesImpl/userRepositoryPrisma';

export function updateRoleFactory() {
  const userRepository = new UserRepositoryPrisma();
  const updateRoleService = new UpdateRoleService(userRepository);
  const updateRoleController = new UpdateRoleController(updateRoleService);
  return updateRoleController;
}
