import { ValidationError } from '@src/domain/util/errors';
import { ERROR_MESSAGE_STRING_VALIDATOR } from '@src/domain/util/constraints/notEmpty';
import { Level } from '../level';

describe('Level entity tests', () => {
  test('Should create a new Level instance successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Level({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      points: 100,
      isActive: true,
    });

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      points: 100,
      isActive: true,
    });
  });

  test('Should return data ILevel object successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Level({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      points: 100,
      isActive: true,
    });

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      points: 100,
      isActive: true,
    });
  });

  test('Should test methods getters and setters', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Level({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      points: 100,
      isActive: true,
    });

    sut.id = 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b';
    sut.description = 'Updated';
    sut.points = 2000;
    sut.isActive = false;

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b',
      description: 'Updated',
      points: 2000,
      isActive: false,
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
        new Level({
          id: '',
          description: 'Any description',
          points: 100,
          isActive: true,
        }),
    ).toThrow(ValidationError);
  });

  test('Should return ValidationError when description is empty', () => {
    /**
     * @Setup
     * @Execution
     * @Assert
     */
    expect(
      () =>
        new Level({
          id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
          description: '',
          points: 100,
          isActive: true,
        }),
    ).toThrow(new ValidationError(`'description' ${ERROR_MESSAGE_STRING_VALIDATOR}`));
  });
});
