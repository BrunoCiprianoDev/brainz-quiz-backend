import { IUser, IUserPublicData } from '@src/domain/util/models/userModels';

export interface IUserRepository {
  create(user: IUser): Promise<void>;

  update(user: IUser): Promise<void>;

  findById(data: { id: string }): Promise<IUser | null>;

  findByEmail(data: { email: string }): Promise<IUser | null>;

  findAll(data: { query: string; page: number; size: number }): Promise<IUserPublicData[]>;

  existsByEmail(data: { email: string }): Promise<boolean>;

  existsById(data: { id: string }): Promise<boolean>;
}
