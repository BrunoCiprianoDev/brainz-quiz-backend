import { ValidationError } from '@src/domain/util/errors';
import { Option } from '../option';
import { UUID_INVALID_MESSAGE } from '@src/domain/util/constraints';
import { ERROR_MESSAGE_STRING_VALIDATOR } from '@src/domain/util/constraints/notEmpty';

describe('Option entity test', () => {
  test('Should create option successfully', async () => {
    const sut = new Option({
      id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
      questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
      description: 'AnyDescription',
      isCorrect: true,
    });

    expect(sut).toMatchObject({
      id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
      questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
      description: 'AnyDescription',
      isCorrect: true,
    });
  });

  test('Should update option with getters and setters successfully', async () => {
    const sut = new Option({
      id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
      questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
      description: 'AnyDescription',
      isCorrect: true,
    });

    sut.id = 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15';
    sut.questionId = '3dcdcfc2-192a-4ff7-8f99-11009682f857';
    sut.description = 'Updated';
    sut.isCorrect = false;

    expect(sut).toMatchObject({
      id: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
      questionId: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
      isCorrect: false,
    });
  });

  test('Should return ValidationError when id is invalid', async () => {
    expect(
      () =>
        new Option({
          id: '',
          questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
          description: 'AnyDescription',
          isCorrect: true,
        }),
    ).toThrow(new ValidationError(`'id' ${UUID_INVALID_MESSAGE}`));
  });

  test('Should return ValidationError when questionId is invalid', async () => {
    expect(
      () =>
        new Option({
          id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
          questionId: '',
          description: 'AnyDescription',
          isCorrect: true,
        }),
    ).toThrow(new ValidationError(`'questionId' ${UUID_INVALID_MESSAGE}`));
  });

  test('Should return ValidationError when description is invalid', async () => {
    expect(
      () =>
        new Option({
          id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
          questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
          description: '',
          isCorrect: true,
        }),
    ).toThrow(new ValidationError(`'description' ${ERROR_MESSAGE_STRING_VALIDATOR}`));
  });

  test('Should return Option data successfully', async () => {
    const option = new Option({
      id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
      questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
      description: 'AnyDescription',
      isCorrect: true,
    });

    const sut = option.data;

    expect(sut).toMatchObject({
      id: '3dcdcfc2-192a-4ff7-8f99-11009682f857',
      questionId: 'bfa1c2e5-40ee-440a-9b5d-f767c5299c15',
      description: 'AnyDescription',
      isCorrect: true,
    });
  });
});
