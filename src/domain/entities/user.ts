import { RoleEnum } from './role';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: RoleEnum;
  score: number;
}

export interface IUserCreateData extends Omit<IUser, 'id' | 'score'> {}

export interface IUserReadyOnly extends Omit<IUser, 'password'> {}
