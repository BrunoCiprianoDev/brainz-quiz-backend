import { Email } from '../../util/constraints/emailValidator';
import { Password } from '../../util/constraints/passwordValidation';
import { EnumType } from '../../util/constraints/enumValidation';
import { Uuid } from '../../util/constraints/uuidValidator';

export enum RoleEnum {
  Disabled = 'DISABLED',
  Player = 'PLAYER',
  Admin = 'ADMIN',
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserCreateData extends Omit<IUser, 'id'> {}

export interface IUserPublicData extends Omit<IUser, 'password'> {}

export class User implements IUser {
  @Uuid()
  private _id: string;

  @Email()
  private _email: string;

  @Password()
  private _password: string;

  @EnumType(RoleEnum)
  private _role: string;

  public constructor({ id, email, password, role }: IUser) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._role = role;
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  set email(email: string) {
    this._email = email;
  }

  get email(): string {
    return this._email;
  }

  set password(password: string) {
    this._password = password;
  }

  get password(): string {
    return this._password;
  }

  set role(role: string) {
    this._role = role;
  }

  get role(): string {
    return this._role;
  }

  get data(): IUser {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }

  get publicData(): IUserPublicData {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
    };
  }
}
