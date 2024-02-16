import { ValidationError } from '@src/domain/util/errors';
import { RoleEnum, User } from '../../user';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_ENUM_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  UUID_INVALID_MESSAGE,
} from '@src/domain/util/constraints';

describe('User entity tests', () => {
  test('Should create a new user instance successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new User({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
      role: RoleEnum.Player,
    });

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
      role: RoleEnum.Player,
    });
  });

  test('Should test setters methods', () => {
    /**
     * @Setup
     */
    const sut = new User({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
      role: RoleEnum.Player,
    });

    /**
     * @Execution
     */
    sut.id = '09e10f59-0e4a-4248-8f37-1f19f7258c5f';
    sut.email = 'johndoe@email.com';
    sut.password = '12345678';
    sut.role = RoleEnum.Admin;

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5f',
      email: 'johndoe@email.com',
      password: '12345678',
      role: RoleEnum.Admin,
    });
  });

  test('Should return validation error when id is invalid', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new User({
          id: 'anyString',
          email: 'johndoe@email.com',
          password: 'p@ssw0rd!@#$',
          role: RoleEnum.Player,
        }),
    ).toThrow(new ValidationError(`'id' ${UUID_INVALID_MESSAGE}`));
  });

  test('Should return validation error when id is invalid', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new User({
          id: 'anyString',
          email: 'johndoe@email.com',
          password: 'p@ssw0rd!@#$',
          role: RoleEnum.Admin,
        }),
    ).toThrow(ValidationError);
  });

  test('Should return validation error when email is invalid', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new User({
          id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          email: 'anyString',
          password: 'p@ssw0rd!@#$',
          role: RoleEnum.Admin,
        }),
    ).toThrow(new ValidationError(INVALID_EMAIL_MESSAGE));
  });

  test('Should return validation error when password is invalid', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new User({
          id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          email: 'johndoe@email.com',
          password: '1234567',
          role: RoleEnum.Admin,
        }),
    ).toThrow(new ValidationError(INVALID_PASSWORD_MESSAGE));
  });

  test('Should return validation erro when value Role is invalid', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new User({
          id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          email: 'johndoe@email.com',
          password: 'p@ssw0rd!@#$',
          role: 'AnyString',
        }),
    ).toThrow(new ValidationError(`${INVALID_ENUM_MESSAGE} role`));
  });

  test('Should return user data when called getUser() validated', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new User({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
      role: RoleEnum.Player,
    });

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
      role: RoleEnum.Player,
    });
  });

  test('Should return user data when called getUserReadyOnly() validated', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new User({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
      role: RoleEnum.Player,
    });

    /**
     * @Assert
     */
    expect(sut.publicData).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      email: 'johndoe@email.com',
      role: RoleEnum.Player,
    });
  });
});
