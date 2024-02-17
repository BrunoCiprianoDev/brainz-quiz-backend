import { ValidationError } from '@src/domain/util/errors';
import { Profile } from '../../profile';
import { ERROR_MESSAGE_STRING_VALIDATOR } from '@src/domain/util/constraints/notEmpty';

describe('Profilee entity tests', () => {
  test('Should create a new Profile instance successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Profile({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      userId: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      score: 100,
    });

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      userId: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      score: 100,
    });
  });

  test('Should return data IProfile object successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Profile({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      userId: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      score: 100,
    });

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      userId: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      score: 100,
    });
  });

  test('Should test methods getters and setters', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Profile({
      id: '12e98866-27c6-4848-b9a0-bd931e5c57bb',
      userId: '12e98866-27c6-4848-b9a0-bd931e5c57bb',
      name: 'John Doe',
      score: 100,
    });

    sut.id = 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b';
    sut.name = 'John Doe2';
    sut.userId = 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b';
    sut.score = 150;

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b',
      name: 'John Doe2',
      userId: 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b',
      score: 150,
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
        new Profile({
          id: '',
          userId: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          name: 'John Doe',
          score: 100,
        }),
    ).toThrow(ValidationError);
  });

  test('Should return ValidationError when name is empty', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new Profile({
          id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          userId: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          name: '',
          score: 100,
        }),
    ).toThrow(new ValidationError(`'name' ${ERROR_MESSAGE_STRING_VALIDATOR}`));
  });
});
