import { isValidPassword } from '../passwordValidation';

describe('isValidPassword tests', () => {
  test('Must return true if the password is 8 characters or more', () => {
    const sut = isValidPassword({ password: 'p@ssword123!' });
    expect(sut).toEqual(true);
  });
  test('must return false if password has less than 8 characters', () => {
    const sut = isValidPassword({ password: '' });
    expect(sut).toEqual(false);
  });
});