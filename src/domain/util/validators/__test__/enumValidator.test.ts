import { Role } from '../../../user/models/user';
import { isValidEnumValue } from '../enumValidator';

describe('IsValidEnumValue tests', () => {
  test('It should return true when string enum is valid', () => {
    const sut = isValidEnumValue('STANDARD', Role);
    expect(sut).toEqual(true);
  });

  test('It should return false when string enum is valid', () => {
    const sut = isValidEnumValue('ANY', Role);
    expect(sut).toEqual(false);
  });
});
