import { IUserRepository } from '../../repositories/userRepository';
import {
  CreateUserService,
  ERROR_MESSAGE_EMAIL_ALREADY_EXISTS,
  ERROR_MESSAGE_INVALID_EMAIL,
  ERROR_MESSAGE_INVALID_PASSWORD,
  ERROR_MESSAGE_INVALID_ROLE,
  ERROR_MESSAGE_PASSWORD_CONFIRM,
  ICreateUserService,
} from '../createUserService';
import { Role } from '../../models/user';
import { IuuidGenerator } from '../../../util/adapters/uuidGenerator';
import { IPasswordEncryptor } from '../../../util/adapters/passwordEncryptor';
import { BadRequestError, InternalServerError } from '../../../util/errors/appErrors';

describe('Create User Service Tests', () => {
  let userRepository: Partial<IUserRepository>;
  let uuidGenerator: Partial<IuuidGenerator>;
  let passwordEncryptor: Partial<IPasswordEncryptor>;
  let createUserService: ICreateUserService;

  beforeAll(() => {
    userRepository = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
    };

    uuidGenerator = {
      generate: jest.fn(),
    };

    passwordEncryptor = {
      encryptor: jest.fn(),
    };

    createUserService = new CreateUserService(
      uuidGenerator as IuuidGenerator,
      passwordEncryptor as IPasswordEncryptor,
      userRepository as IUserRepository,
    );
  });

  test('Should return user created successfully', async () => {
    const expectPasswordEncrypted = 'PASSWORDHASHED';
    const expectUuidGenerated = 'fefa7b41-0acd-451c-bea6-b113c6d5eae4';

    const validUser = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      confirmPassword: 'p@ssw0rd123',
      role: Role.Admin,
    };

    jest.spyOn(uuidGenerator, 'generate').mockResolvedValue(expectUuidGenerated);
    jest.spyOn(passwordEncryptor, 'encryptor').mockResolvedValue(expectPasswordEncrypted);
    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(false);

    const sut = await createUserService.execute(validUser);

    expect(sut).toMatchObject({
      id: expectUuidGenerated,
      email: validUser.email,
      role: validUser.role,
    });

    expect(uuidGenerator.generate).toHaveBeenCalledTimes(1);
    expect(passwordEncryptor.encryptor).toHaveBeenCalledWith(validUser.password);
    expect(userRepository.existsByEmail).toHaveBeenCalledWith(validUser.email);
  });

  test('Should return BadRequestError when user email is not valid', async () => {
    const userWithInvalidEmail = {
      email: '****',
      password: 'p@ssw0rd123',
      confirmPassword: 'p@ssw0rd123',
      role: Role.Admin,
    };

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(passwordEncryptor, 'encryptor').mockClear();
    jest.spyOn(userRepository, 'existsByEmail').mockClear();

    await expect(createUserService.execute(userWithInvalidEmail)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_INVALID_EMAIL),
    );

    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(passwordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(userRepository.existsByEmail).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when user password is not valid', async () => {
    const userWithInvalidPassword = {
      email: 'johnDoe@email.com',
      password: '****',
      confirmPassword: 'p@ssw0rd123',
      role: Role.Admin,
    };

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(passwordEncryptor, 'encryptor').mockClear();
    jest.spyOn(userRepository, 'existsByEmail').mockClear();

    await expect(createUserService.execute(userWithInvalidPassword)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_INVALID_PASSWORD),
    );

    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(passwordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(userRepository.existsByEmail).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when user password and confirmPassword is not matches', async () => {
    const userWithConfirmPasswordNotMatches = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      confirmPassword: '****',
      role: Role.Admin,
    };

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(passwordEncryptor, 'encryptor').mockClear();
    jest.spyOn(userRepository, 'existsByEmail').mockClear();

    await expect(createUserService.execute(userWithConfirmPasswordNotMatches)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_PASSWORD_CONFIRM),
    );

    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(passwordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(userRepository.existsByEmail).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when user email already exists', async () => {
    const validUser = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      confirmPassword: 'p@ssw0rd123',
      role: Role.Admin,
    };

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(passwordEncryptor, 'encryptor').mockClear();
    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(true);

    await expect(createUserService.execute(validUser)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_EMAIL_ALREADY_EXISTS),
    );

    expect(userRepository.existsByEmail).toHaveBeenCalledWith(validUser.email);
    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(passwordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when user role is invalid', async () => {
    const validUser = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      confirmPassword: 'p@ssw0rd123',
      role: '****',
    };

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(passwordEncryptor, 'encryptor').mockClear();
    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(true);

    await expect(createUserService.execute(validUser)).rejects.toEqual(
      new InternalServerError(ERROR_MESSAGE_INVALID_ROLE),
    );

    expect(userRepository.existsByEmail).toHaveBeenCalledTimes(0);
    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(passwordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });
});
