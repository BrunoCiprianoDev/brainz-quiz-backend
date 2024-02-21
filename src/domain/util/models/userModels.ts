export interface IUser {
  id: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserCreateData extends Omit<IUser, 'id'> {
  confirmPassword: string;
}

export interface IUserPublicData extends Omit<IUser, 'password'> { }

export interface IUpdateUserRoleData {
  id: string;
  role: string;
}

export interface IUpdateUserPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IFindUserByIdData {
  id: string;
}

export interface IFindUserByEmailData {
  email: string;
}

export interface IFindAllUsersData {
  query: string;
  page: number;
  size: number;
}

export interface IAuthenticateData {
  email: string;
  password: string;
}

export interface IUpdatePasswordByEmailData {
  email: string;
}

export interface IToken {
  token: string;
}

export interface IPayloadAuthToken {
  id: string;
  role: string;
}
