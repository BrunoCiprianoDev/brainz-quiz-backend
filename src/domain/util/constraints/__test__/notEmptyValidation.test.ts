import { isNotEmpty } from '../notEmptyValidation';

describe('IsNotEmpty tests', () => {
  test('It should return true when value is not empty', () => {
    const sut = isNotEmpty({ value: 'anyString' });
    expect(sut).toEqual(true);
  });

  test('It should return false when value is empty', () => {
    const sut = isNotEmpty({ value: '' });
    expect(sut).toEqual(false);
  });
});
