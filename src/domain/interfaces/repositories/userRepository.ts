import { RoleEnum } from '@src/domain/entities/role';
import { IUser, IUserCreateData, IUserReadyOnly } from '@src/domain/entities/user';

export interface IUserRepository {
  create(user: IUserCreateData): Promise<IUser>;

  updateRole(data: { id: string; role: RoleEnum }): Promise<IUser>;

  updateName(data: { id: string; name: string }): Promise<IUser>;

  updateAvatar(data: { id: string; avatar: string }): Promise<IUser>;

  updateScore(data: { id: string; score: number }): Promise<IUserReadyOnly>;

  findById(data: { id: string }): Promise<IUser | null>;

  findAll(data: { query: string; page: number; size: number }): Promise<IUserReadyOnly[]>;

  existsByEmail(data: { email: string }): Promise<boolean>;

  existsById(data: { id: string }): Promise<boolean>;
}
