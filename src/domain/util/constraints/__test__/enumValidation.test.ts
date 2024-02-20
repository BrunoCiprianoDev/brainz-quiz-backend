import { RoleEnum } from '@src/domain/entities/user';
import { isValidEnumValue } from '../enumValidation';

describe('IsValidEnumValue tests', () => {
  test('It should return true when string enum is valid', () => {
    const sut = isValidEnumValue('PLAYER', RoleEnum);
    expect(sut).toEqual(true);
  });

  test('It should return false when string enum is valid', () => {
    const sut = isValidEnumValue('ANY', RoleEnum);
    expect(sut).toEqual(false);
  });
});
