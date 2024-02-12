import { RoleEnum } from '@src/domain/entities/role';
import { IUser, IUserCreateData, IUserReadyOnly } from '@src/domain/entities/user';

export interface IUserRepository {
  create(user: IUserCreateData): Promise<IUser>;

  updateRole(id: string, role: RoleEnum): Promise<IUser>;

  updateName(id: string, name: string): Promise<IUser>;

  updateAvatar(id: string, avatar: string): Promise<IUser>;

  findById(id: string): Promise<IUser>;

  findAll(query: string, page: number, size: number): Promise<IUserReadyOnly[]>;

  existsByEmail(email: string): Promise<boolean>;

  existsById(id: string): Promise<boolean>;
}
