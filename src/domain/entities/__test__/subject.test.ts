import { ValidationError } from '@src/domain/util/errors';
import { ERROR_MESSAGE_STRING_VALIDATOR } from '@src/domain/util/constraints/notEmpty';
import { Subject } from '../subject';

describe('Subject entity tests', () => {
  test('Should create a new Subject instance successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Subject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      isActive: true,
    });

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      isActive: true,
    });
  });

  test('Should return data ISubject object successfully', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Subject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      isActive: true,
    });

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      isActive: true,
    });
  });

  test('Should test methods getters and setters', () => {
    /**
     * @Setup
     * @Execution
     */
    const sut = new Subject({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      description: 'Any description',
      isActive: true,
    });

    sut.id = 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b';
    sut.description = 'Updated';
    sut.isActive = false;

    /**
     * @Assert
     */
    expect(sut.data).toMatchObject({
      id: 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b',
      description: 'Updated',
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
        new Subject({
          id: 'any',
          description: 'Any description',
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
        new Subject({
          id: 'f0f343cb-b89d-4b01-876c-0dd5ef505d7b',
          description: '',
          isActive: false,
        }),
    ).toThrow(new ValidationError(`'description' ${ERROR_MESSAGE_STRING_VALIDATOR}`));
  });
});
