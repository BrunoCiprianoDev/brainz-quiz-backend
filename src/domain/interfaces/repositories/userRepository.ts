import { IUser, IUserCreateData, IUserPublicData } from '@src/domain/entities/auth/user';

export interface IUserRepository {
  create(user: IUserCreateData): Promise<void>;

  update(user: IUser): Promise<void>;

  findById(data: { id: string }): Promise<IUser | null>;

  findByEmail(data: { email: string }): Promise<IUser | null>;

  findAll(data: { query: string; page: number; size: number }): Promise<IUserPublicData[]>;

  existsByEmail(data: { email: string }): Promise<boolean>;

  existsById(data: { id: string }): Promise<boolean>;
}
