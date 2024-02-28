import { IEmailSender } from '../../../util/adapters/emailSender';
import { ITokenGenerator } from '../../../util/adapters/tokenGenerator';
import { NotFoundError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IUserRepository } from '../../repositories/userRepository';
import {
  ERROR_MESSAGE_NOT_FOUND_USER_EMAIL,
  GetTokenUpdatePasswordService,
  IGetTokenUpdatePasswordService,
} from '../getTokenUpdatePasswordService';

describe('Get token update password tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let mockedEmailSender: jest.Mocked<IEmailSender>;
  let getTokenUpdatePasswordService: IGetTokenUpdatePasswordService;

  beforeAll(() => {
    mockedUserRepository = {
      findByEmail: jest.fn(),
    };

    mockedTokenGenerator = {
      generateTokenResetPass: jest.fn(),
    };

    mockedEmailSender = {
      sendTokenForgotPass: jest.fn(),
    };

    getTokenUpdatePasswordService = new GetTokenUpdatePasswordService(
      mockedUserRepository as IUserRepository,
      mockedTokenGenerator as ITokenGenerator,
      mockedEmailSender as IEmailSender,
    );
  });

  test('Should send email with token from update pass', async () => {
    const input = 'johnDoe@email.com';

    const findByEmailReturnExp = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      role: Role.Admin,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(findByEmailReturnExp);
    jest.spyOn(mockedTokenGenerator, 'generateTokenResetPass').mockResolvedValue('TOKEN_TEST');
    jest.spyOn(mockedEmailSender, 'sendTokenForgotPass').mockClear();

    await getTokenUpdatePasswordService.execute(input);

    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(input);
    expect(mockedTokenGenerator.generateTokenResetPass).toHaveBeenCalledWith({
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johnDoe@email.com',
      role: Role.Admin,
    });
    expect(mockedEmailSender.sendTokenForgotPass).toHaveBeenCalledWith({ email: input, token: 'TOKEN_TEST' });
  });

  test('Should return NotFoundError when not found user by email', async () => {
    const input = 'johnDoe@email.com';

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(mockedTokenGenerator, 'generateTokenResetPass').mockClear();
    jest.spyOn(mockedEmailSender, 'sendTokenForgotPass').mockClear();

    await expect(getTokenUpdatePasswordService.execute(input)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER_EMAIL),
    );

    expect(mockedTokenGenerator.generateTokenResetPass).toHaveBeenCalledTimes(0);
    expect(mockedEmailSender.sendTokenForgotPass).toHaveBeenCalledTimes(0);
  });
});
