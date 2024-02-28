import { IPasswordEncryptor } from '../../../util/adapters/passwordEncryptor';
import { ITokenGenerator } from '../../../util/adapters/tokenGenerator';
import { BadRequestError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IUserRepository } from '../../repositories/userRepository';
import {
  ERROR_INVALID_TOKEN_FORGOT_PASS,
  ERROR_PASSWORD_CONFIRMPASSWORD_NOT_MATCHES,
  ERROR_PASSWORD_ID_NOT_VALID,
  IUpdatePasswordService,
  UpdatePasswordService,
} from '../updatePasswordService';

describe('Update user role tests', () => {
  let updatePasswordService: IUpdatePasswordService;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let mockedUserRepository: Partial<IUserRepository>;

  beforeAll(() => {
    mockedUserRepository = {
      findByEmail: jest.fn(),
      updatePassword: jest.fn(),
    };

    mockedPasswordEncryptor = {
      encryptor: jest.fn(),
    };

    mockedTokenGenerator = {
      getPayloadTokenResetPass: jest.fn(),
    };

    updatePasswordService = new UpdatePasswordService(
      mockedTokenGenerator as ITokenGenerator,
      mockedUserRepository as IUserRepository,
      mockedPasswordEncryptor as IPasswordEncryptor,
    );
  });

  test('Should update password successfully', async () => {
    const input = {
      token: 'TOKEN_PAYLOAD_FORGOT_PASS',
      password: 'p@ssw0rd_UPDATED',
      confirmPassword: 'p@ssw0rd_UPDATED',
    };

    const mockedPayloadResponse = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johndoe@email.com',
      role: Role.Standard,
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockResolvedValue(mockedPayloadResponse);
    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue({
      id: mockedPayloadResponse.id,
      email: 'johndoe@email.com',
      password: 'PASSWORDHASH',
      role: Role.Standard,
    });
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue('PASSWORD_HASH_UPDATED');

    await updatePasswordService.execute(input);

    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledWith(input.token);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(mockedPayloadResponse.email);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledWith(input.password);
  });

  test('Should return error when password and confirmPassword not matches', async () => {
    const input = {
      token: 'TOKEN_PAYLOAD_FORGOT_PASS',
      password: 'p@ssw0rd_UPDATED',
      confirmPassword: 'p@ssw0rd****',
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockClear();
    jest.spyOn(mockedUserRepository, 'findByEmail').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    await expect(updatePasswordService.execute(input)).rejects.toEqual(
      new BadRequestError(ERROR_PASSWORD_CONFIRMPASSWORD_NOT_MATCHES),
    );

    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });

  test('Should return error when password is not valid', async () => {
    const input = {
      token: 'TOKEN_PAYLOAD_FORGOT_PASS',
      password: '****',
      confirmPassword: '****',
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockClear();
    jest.spyOn(mockedUserRepository, 'findByEmail').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    await expect(updatePasswordService.execute(input)).rejects.toEqual(
      new BadRequestError(ERROR_PASSWORD_ID_NOT_VALID),
    );

    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError if not found user by email', async () => {
    const input = {
      token: 'TOKEN_PAYLOAD_FORGOT_PASS',
      password: 'p@ssw0rd_UPDATED',
      confirmPassword: 'p@ssw0rd_UPDATED',
    };

    const mockedPayloadResponse = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johndoe@email.com',
      role: Role.Standard,
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockResolvedValue(mockedPayloadResponse);
    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    await expect(updatePasswordService.execute(input)).rejects.toEqual(
      new BadRequestError(ERROR_INVALID_TOKEN_FORGOT_PASS),
    );
    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledWith(input.token);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(mockedPayloadResponse.email);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError if token is not valid', async () => {
    const input = {
      token: 'TOKEN_PAYLOAD_FORGOT_PASS',
      password: 'p@ssw0rd_UPDATED',
      confirmPassword: 'p@ssw0rd_UPDATED',
    };

    jest
      .spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass')
      .mockRejectedValue(new BadRequestError('Invalid token'));
    jest.spyOn(mockedUserRepository, 'findByEmail').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    await expect(updatePasswordService.execute(input)).rejects.toBeInstanceOf(BadRequestError);
    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledWith(input.token);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });
});
