export enum Role {
  Disable = 'DISABLE',
  Standard = 'STANDARD',
  Admin = 'ADMIN',
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserCreateData extends Omit<IUser, 'id'> {
  confirmPassword: string;
}

export interface IUserPublicData extends Omit<IUser, 'password'> {}
