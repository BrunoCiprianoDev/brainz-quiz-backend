import { IUser, IUserPublicData } from '../models/user';

export interface IUserRepository {
  create({ id, email, password, role }: IUser): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  findById(id: string): Promise<IUserPublicData | null>;
  findAllUsers(data: { contains: string; page: number; size: number }): Promise<IUserPublicData[]>;
  updateRole(data: { id: string; role: string }): Promise<void>;
  updatePassword(data: { id: string; password: string }): Promise<void>;
  findByEmail(email: string): Promise<IUser | null>;
  numberOfAdmins(): Promise<number>;
}
