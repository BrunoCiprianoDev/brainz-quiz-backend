import { IPasswordEncryptor } from '../../../util/adapters/passwordEncryptor';
import { ITokenGenerator } from '../../../util/adapters/tokenGenerator';
import { ForbiddenError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IUserRepository } from '../../repositories/userRepository';
import { AuthenticateService, IAuthenticateService } from '../authenticateService';

describe('Authentication service tests', () => {
  let authenticationService: IAuthenticateService;
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;

  beforeAll(() => {
    mockedUserRepository = {
      findByEmail: jest.fn(),
    };

    mockedPasswordEncryptor = {
      passwordCompare: jest.fn(),
    };

    mockedTokenGenerator = {
      generateAuthToken: jest.fn(),
    };

    authenticationService = new AuthenticateService(
      mockedUserRepository as IUserRepository,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
    );
  });

  test('Should return token when valid credentials', async () => {
    const tokenExpected = '993b58c1-cdb6-4814-be90-2dea91bd25fd';
    const id = '4bc49fd4-9466-4e2e-b378-8ca2a537fea6';
    const email = 'johnDoe@email.com';
    const password = 'p@ssword';
    const passwordEncrypt = 'PASSWORDHASH';
    const role = Role.Standard;

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue({ id, email, password: passwordEncrypt, role });
    jest.spyOn(mockedPasswordEncryptor, 'passwordCompare').mockResolvedValue(true);
    jest.spyOn(mockedTokenGenerator, 'generateAuthToken').mockResolvedValue(tokenExpected);

    const sut = await authenticationService.execute({ email, password });

    expect(sut).toEqual({ token: tokenExpected });
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledWith({ password, passwordEncrypt });
    expect(mockedTokenGenerator.generateAuthToken).toHaveBeenCalledWith({ id, role });
  });

  test('Should return ForbiddeError when not found user by email', async () => {
    const email = 'johnDoe@email.com';
    const password = 'p@ssword';

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(mockedPasswordEncryptor, 'passwordCompare').mockClear();
    jest.spyOn(mockedTokenGenerator, 'generateAuthToken').mockClear();

    await expect(authenticationService.execute({ email, password })).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledTimes(0);
    expect(mockedTokenGenerator.generateAuthToken).toHaveBeenCalledTimes(0);
  });

  test('Should return ForbidenError when password is not valid', async () => {
    const id = '4bc49fd4-9466-4e2e-b378-8ca2a537fea6';
    const email = 'johnDoe@email.com';
    const password = 'p@ssword';
    const passwordEncrypt = 'PASSWORDHASH';
    const role = Role.Standard;

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue({ id, email, password: passwordEncrypt, role });
    jest.spyOn(mockedPasswordEncryptor, 'passwordCompare').mockResolvedValue(false);
    jest.spyOn(mockedTokenGenerator, 'generateAuthToken').mockClear();

    await expect(authenticationService.execute({ email, password })).rejects.toBeInstanceOf(ForbiddenError);

    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledWith({ password, passwordEncrypt });
    expect(mockedTokenGenerator.generateAuthToken).toHaveBeenCalledTimes(0);
  });
});
