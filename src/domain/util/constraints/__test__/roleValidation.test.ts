import { isValidRole } from '../roleValidation';

describe('Role converter tests', () => {
  test('Should return true when roleString is valid', () => {
    const sut = isValidRole('ADMIN');

    expect(sut).toEqual(true);
  });

  test('Should return ValidationError when roleString not matches a enum options', () => {
    const sut = isValidRole('anyString');

    expect(sut).toEqual(false);
  });
});
