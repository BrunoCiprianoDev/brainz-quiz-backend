import { User } from '@src/domain/entities/user';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { BadRequestError, ForbiddenError, NotFoundError } from '@src/domain/util/errors';
import { ErrorHandlerUseCases } from '@src/domain/util/errors/errorHandler';
import {
  IAuthenticateData,
  IFindAllUsersData,
  IFindUserByEmailData,
  IFindUserByIdData,
  IToken,
  IUpdatePasswordByEmailData,
  IUpdateUserPasswordData,
  IUpdateUserRoleData,
  IUserCreateData,
  IUserPublicData,
} from '@src/domain/util/models/userModels';
import { ITokenGenerator } from '../interfaces/adapters/tokenGenerator';
import { IEmailSender } from '../interfaces/adapters/emailSender';

export const ERROR_MESSAGE_USER_CONFIRM_PASSWORD = 'Password and confirmPassword must match.';
export const ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS = 'There is already a user using this email';
export const ERROR_MESSAGE_USER_INVALID_TOKEN = 'The token provided is not valid';
export const ERROR_MESSAGE_USER_NOT_FOUND_BY_ID = 'User not found by id';
export const ERROR_MESSAGE_USER_NOT_FOUND_BY_EMAIL = 'User not found by email';
export const ERROR_MESSAGE_USER_FIND_ALL_PARAMS =
  'Error when searching for users. Please ensure that: (page > 0), (size > 0), and (size <= 10).';
export const ERROR_MESSAGE_USER_PASSWORD_INVALID = 'Email or password invalid';

export interface IUserUseCases {
  create(data: IUserCreateData): Promise<IUserPublicData>;
  updateRole(data: IUpdateUserRoleData): Promise<IUserPublicData>;
  updatePassword(data: IUpdateUserPasswordData): Promise<IUserPublicData>;
  findById(data: IFindUserByIdData): Promise<IUserPublicData>;
  findByEmail(data: IFindUserByEmailData): Promise<IUserPublicData>;
  findAll(data: IFindAllUsersData): Promise<IUserPublicData[]>;
  sendTokenUpdatePasswordByEmail({ email }: IUpdatePasswordByEmailData): Promise<void>;
  authenticate(data: IAuthenticateData): Promise<IToken>;
}

export class UserUseCases extends ErrorHandlerUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private uuidGenerator: IuuidGenerator,
    private passwordEncryptor: IPasswordEncryptor,
    private tokenGenerator: ITokenGenerator,
    private emailSender: IEmailSender,
  ) {
    super();
  }

  public async create(userCreateData: IUserCreateData): Promise<IUserPublicData> {
    try {
      if (userCreateData.confirmPassword !== userCreateData.password) {
        throw new BadRequestError(ERROR_MESSAGE_USER_CONFIRM_PASSWORD);
      }

      const isExists = await this.userRepository.existsByEmail({ email: userCreateData.email });
      if (isExists) {
        throw new BadRequestError(ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS);
      }

      const id = await this.uuidGenerator.generate();

      const user = new User({ id, ...userCreateData });

      user.password = await this.passwordEncryptor.encryptor({ password: userCreateData.password });

      await this.userRepository.create(user.data);

      return user.publicData;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updateRole({ id, role }: IUpdateUserRoleData): Promise<IUserPublicData> {
    try {
      const currentUser = await this.userRepository.findById({ id });
      if (!currentUser) {
        throw new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID);
      }

      const userToUpdate = new User(currentUser);
      userToUpdate.role = role;

      await this.userRepository.update(userToUpdate.data);

      return userToUpdate.publicData;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById({ id }: IFindUserByIdData): Promise<IUserPublicData> {
    try {
      const result = await this.userRepository.findById({ id });
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return (({ password: _, ...userWithoutPassword }) => userWithoutPassword)(result);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findByEmail({ email }: IFindUserByEmailData): Promise<IUserPublicData> {
    try {
      const result = await this.userRepository.findByEmail({ email });
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return (({ password: _, ...userWithoutPassword }) => userWithoutPassword)(result);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(data: IFindAllUsersData): Promise<IUserPublicData[]> {
    try {
      if (data.page < 1 || data.size < 1 || data.size > 10) {
        throw new BadRequestError(ERROR_MESSAGE_USER_FIND_ALL_PARAMS);
      }
      return await this.userRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async authenticate({ email, password }: IAuthenticateData): Promise<IToken> {
    try {
      const user = await this.userRepository.findByEmail({ email });
      if (!user) {
        throw new ForbiddenError(ERROR_MESSAGE_USER_NOT_FOUND_BY_EMAIL);
      }

      const result = await this.passwordEncryptor.passwordCompare({
        password: password,
        passwordEncrypt: user.password,
      });
      if (!result) {
        throw new ForbiddenError(ERROR_MESSAGE_USER_PASSWORD_INVALID);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return await this.tokenGenerator.generateAuthToken({ id: user.id, role: user.role });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async sendTokenUpdatePasswordByEmail({ email }: IUpdatePasswordByEmailData): Promise<void> {
    try {
      const user = await this.findByEmail({ email });
      const { token } = await this.tokenGenerator.generateTokenResetPass(user);
      await this.emailSender.sendTokenForgotPass({ email, token });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async updatePassword({ token, password, confirmPassword }: IUpdateUserPasswordData): Promise<IUserPublicData> {
    try {
      if (confirmPassword !== password) {
        throw new BadRequestError(ERROR_MESSAGE_USER_CONFIRM_PASSWORD);
      }

      const payload = await this.tokenGenerator.getPayloadTokenResetPass(token);

      const currentUser = await this.userRepository.findById({ id: payload.id });

      if (!currentUser) {
        throw new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID);
      }

      if (payload.email !== currentUser.email) {
        throw new BadRequestError(ERROR_MESSAGE_USER_INVALID_TOKEN);
      }

      const userToUpdate = new User(currentUser);
      userToUpdate.password = await this.passwordEncryptor.encryptor({ password });

      await this.userRepository.update(userToUpdate.data);

      return userToUpdate.publicData;
    } catch (error) {
      this.handleError(error);
    }
  }
}
