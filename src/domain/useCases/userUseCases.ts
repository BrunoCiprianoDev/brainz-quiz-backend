import { IUserCreateData, IUserReadyOnly } from '../entities/user';
import { IPasswordEncryptor } from '../interfaces/adapters/passwordEncryptor';
import { IUserRepository } from '../interfaces/repositories/userRepository';
import { isValidEmail } from '../util/constraints/emailValidator';
import { isNotEmpty } from '../util/constraints/notEmptyValidation';
import { isValidPassword } from '../util/constraints/passwordValidation';
import { convertStringToRoleEnum } from '../util/constraints/roleValidation';
import { AppError, BadRequestError, InternalServerError, NotFoundError } from '../util/errors/appErrors';

export interface IUserUseCases {
  create(user: IUserCreateData): Promise<IUserReadyOnly>;

  updateRole(data: { id: string; role: string }): Promise<IUserReadyOnly>;

  updateName(data: { id: string; name: string }): Promise<IUserReadyOnly>;

  updateAvatar(data: { id: string; avatar: string }): Promise<IUserReadyOnly>;

  updateScore({ id, score }: { id: string; score: number }): Promise<IUserReadyOnly>;

  findById(data: { id: string }): Promise<IUserReadyOnly>;

  findAll(data: { query: string; page: number; size: number }): Promise<IUserReadyOnly[]>;
}

export class UserUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private passwordEncryptor: IPasswordEncryptor,
  ) { }

  public async create({ name, email, password, avatar, role }: IUserCreateData): Promise<IUserReadyOnly> {
    try {
      if (!isNotEmpty({ value: name })) {
        throw new BadRequestError('The name attribute cannot be empty');
      }

      if (!isValidEmail({ email })) {
        throw new BadRequestError('Invalid email');
      }

      if (!isValidPassword({ password })) {
        throw new BadRequestError('Invalid password, make sure it is at least 8 characters long');
      }

      const isExists = await this.userRepository.existsByEmail({ email });
      if (isExists) {
        throw new BadRequestError('There is already another user using this email');
      }

      const passwordHash = await this.passwordEncryptor.encryptor({ password });

      const result = await this.userRepository.create({
        name,
        email,
        password: passwordHash,
        avatar,
        role,
      });

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
        score: result.score,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateRole({ id, role }: { id: string; role: string }): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById({ id });
      if (!isExists) {
        throw new NotFoundError('No users found by the given id');
      }

      const roleEnum = convertStringToRoleEnum({ roleString: role });

      if (!roleEnum) {
        throw new BadRequestError('Invalid role');
      }

      const result = await this.userRepository.updateRole({ id, role: roleEnum });
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
        score: result.score,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateName({ id, name }: { id: string; name: string }): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById({ id });
      if (!isExists) {
        throw new NotFoundError('No users found by the given id');
      }
      if (!isNotEmpty({ value: name })) {
        throw new BadRequestError('The name attribute cannot be empty');
      }

      const result = await this.userRepository.updateName({ id, name });

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
        score: result.score,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateAvatar({ id, avatar }: { id: string; avatar: string }): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById({ id });
      if (!isExists) {
        throw new NotFoundError('No users found by the given id');
      }

      const result = await this.userRepository.updateAvatar({ id, avatar });

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
        score: result.score,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateScore({ id, score }: { id: string; score: number }): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById({ id });
      if (!isExists) {
        throw new NotFoundError('No user found by the given id');
      }
      if (score < 0) {
        throw new BadRequestError('Invalid score');
      }
      return await this.userRepository.updateScore({ id, score });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findById({ id }: { id: string }): Promise<IUserReadyOnly> {
    try {
      const result = await this.userRepository.findById({ id });
      if (!result) {
        throw new NotFoundError('No users found by the given id');
      }
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
        score: result.score,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findAll({
    query,
    page,
    size,
  }: {
    query: string;
    page: number;
    size: number;
  }): Promise<IUserReadyOnly[]> {
    try {
      if (page < 1) {
        page = 1;
      }
      if (size < 1) {
        size = 1;
      }
      return await this.userRepository.findAll({ query, page, size });
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
