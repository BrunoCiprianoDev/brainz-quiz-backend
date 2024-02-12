import { RoleEnum } from '../entities/role';
import { IUserCreateData, IUserReadyOnly } from '../entities/user';
import { IPasswordEncryptor } from '../interfaces/adapters/passwordEncryptor';
import { IUserRepository } from '../interfaces/repositories/userRepository';
import { isValidEmail } from '../util/constraints/emailValidator';
import { isNotEmpty } from '../util/constraints/notEmptyValidation';
import { isValidPassword } from '../util/constraints/passwordValidation';
import { isValidRole } from '../util/constraints/roleValidation';
import { AppError, BadRequestError, InternalServerError, NotFoundError } from '../util/errors/appErrors';

export interface IUserUseCases {
  create(user: IUserCreateData): Promise<IUserReadyOnly>;

  updateRole(id: string, role: RoleEnum): Promise<IUserReadyOnly>;

  updateName(id: string, name: string): Promise<IUserReadyOnly>;

  updateAvatar(id: string, name: string): Promise<IUserReadyOnly>;

  findById(id: string): Promise<IUserReadyOnly>;

  findAll(query: string, page: number, size: number): Promise<IUserReadyOnly[]>;
}

export class UserUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private passwordEncryptor: IPasswordEncryptor,
  ) { }

  public async create({ name, email, password, avatar, role }: IUserCreateData): Promise<IUserReadyOnly> {
    try {
      if (!isNotEmpty(name)) {
        throw new BadRequestError('The name attribute cannot be empty');
      }

      if (!isValidEmail(email)) {
        throw new BadRequestError('Invalid email');
      }

      if (!isValidPassword(password)) {
        throw new BadRequestError('Invalid password, make sure it is at least 8 characters long');
      }

      const isExists = await this.userRepository.existsByEmail(email);
      if (isExists) {
        throw new BadRequestError('There is already another user using this email');
      }

      const passwordHash = await this.passwordEncryptor.encryptor(password);

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
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateRole(id: string, role: RoleEnum): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById(id);
      if (isExists) {
        throw new NotFoundError('There is already another user using this email');
      }
      if (!isValidRole(role)) {
        throw new BadRequestError('Invalid role');
      }

      const result = await this.userRepository.updateRole(id, role);

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateName(id: string, name: string): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById(id);
      if (isExists) {
        throw new NotFoundError('There is already another user using this email');
      }
      if (!isNotEmpty(name)) {
        throw new BadRequestError('The name attribute cannot be empty');
      }

      const result = await this.userRepository.updateName(id, name);

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateAvatar(id: string, avatar: string): Promise<IUserReadyOnly> {
    try {
      const isExists = await this.userRepository.existsById(id);
      if (isExists) {
        throw new NotFoundError('There is already another user using this email');
      }

      const result = await this.userRepository.updateAvatar(id, avatar);

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findById(id: string): Promise<IUserReadyOnly> {
    try {
      const result = await this.userRepository.findById(id);
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findAll(query: string, page: number, size: number): Promise<IUserReadyOnly[]> {
    try {
      return await this.userRepository.findAll(query, page, size);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }
}
