import { isValidEmail } from '../emailValidator';

describe('IsValidEmail tests', () => {
  test('It should return true when email is valid', () => {
    const sut = isValidEmail({ email: 'johnDoe@email.com' });
    expect(sut).toEqual(true);
  });

  test('It should return false when email is valid', () => {
    const sut = isValidEmail({ email: 'anyString' });
    expect(sut).toEqual(false);
  });
});
