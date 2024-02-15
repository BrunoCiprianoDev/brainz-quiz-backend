import { IUserCreateData, IUserPublicData, User } from '@src/domain/entities/auth/user';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { BadRequestError, NotFoundError } from '@src/domain/util/errors';
import { ErrorHandlerUseCases } from '@src/domain/util/errors/errorHandler';

export const ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS = 'There is already a user using this email';
export const ERROR_MESSAGE_USER_NOT_FOUND_BY_ID = 'User not found by id';

export interface IUserUseCases {
  create(data: IUserCreateData): Promise<IUserPublicData>;
  updateRole(data: { id: string; role: string }): Promise<IUserPublicData>;
  updatePassword(data: { id: string; password: string }): Promise<IUserPublicData>;
  findById(data: { id: string }): Promise<IUserPublicData>;
  findByEmail(data: { email: string }): Promise<IUserPublicData>;
  findAll(data: { query: string; page: number; size: number }): Promise<IUserPublicData[]>;
}

export class UserUseCases extends ErrorHandlerUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private uuidGenerator: IuuidGenerator,
    private passwordEncryptor: IPasswordEncryptor,
  ) {
    super();
  }

  public async create(userCreateData: IUserCreateData): Promise<IUserPublicData> {
    try {
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

  public async updateRole({ id, role }: { id: string; role: string }): Promise<IUserPublicData> {
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

  public async updatePassword({ id, password }: { id: string; password: string }): Promise<IUserPublicData> {
    try {
      const currentUser = await this.userRepository.findById({ id });
      if (!currentUser) {
        throw new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID);
      }

      const userToUpdate = new User(currentUser);
      userToUpdate.password = await this.passwordEncryptor.encryptor({ password });

      await this.userRepository.update(userToUpdate.data);

      return userToUpdate.publicData;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById({ id }: { id: string }): Promise<IUserPublicData> {
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

  public async findByEmail({ email }: { email: string }): Promise<IUserPublicData> {
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

  public async findAll(data: { query: string; page: number; size: number }): Promise<IUserPublicData[]> {
    try {
      return await this.userRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
