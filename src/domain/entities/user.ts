import { RoleEnum } from './role';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: RoleEnum;
}

export interface IUserCreateData extends Omit<IUser, 'id'> {}

export interface IUserReadyOnly extends Omit<IUser, 'password'> {}
