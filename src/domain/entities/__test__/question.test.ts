import { ValidationError } from '@src/domain/util/errors';
import { Question } from '../question';
import { UUID_INVALID_MESSAGE } from '@src/domain/util/constraints';
import { ERROR_MESSAGE_STRING_VALIDATOR } from '@src/domain/util/constraints/notEmpty';

describe('Question entity tests', () => {
  const VALID_SUBJECT = {
    id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
    description: 'Any description',
    isActive: true,
  };

  const VALID_LEVEL = {
    id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
    description: 'Any description',
    points: 100,
    isActive: true,
  };

  test('Should create Question instance successfully', () => {
    const sut = new Question({
      id: 'ed24db8f-1d59-4f10-9de2-ed48040d32fd',
      description: 'QuestionDescription',
      level: VALID_LEVEL,
      subject: VALID_SUBJECT,
    });

    expect(sut.id).toBe('ed24db8f-1d59-4f10-9de2-ed48040d32fd');
    expect(sut.description).toBe('QuestionDescription');
    expect(sut.level).toMatchObject(VALID_LEVEL);
    expect(sut.subject).toMatchObject(VALID_SUBJECT);
  });

  test('Should return ValidationError when id is invalid', () => {
    expect(
      () =>
        new Question({
          id: '',
          description: 'QuestionDescription',
          level: VALID_LEVEL,
          subject: VALID_SUBJECT,
        }),
    ).toThrow(new ValidationError(`'id' ${UUID_INVALID_MESSAGE}`));
  });

  test('Should return ValidationError when description is invalid', () => {
    expect(
      () =>
        new Question({
          id: 'ed24db8f-1d59-4f10-9de2-ed48040d32fd',
          description: '',
          level: VALID_LEVEL,
          subject: VALID_SUBJECT,
        }),
    ).toThrow(new ValidationError(`'description' ${ERROR_MESSAGE_STRING_VALIDATOR}`));
  });

  test('Should test getters and setters methods', () => {
    const sut = new Question({
      id: 'ed24db8f-1d59-4f10-9de2-ed48040d32fd',
      description: 'QuestionDescription',
      level: VALID_LEVEL,
      subject: VALID_SUBJECT,
    });

    sut.id = '378c6457-3749-4b0c-a247-1d07ef900152';
    sut.description = 'QuestionDescription';
    sut.level = VALID_LEVEL;
    sut.subject = VALID_SUBJECT;

    expect(sut).toMatchObject({
      id: '378c6457-3749-4b0c-a247-1d07ef900152',
      description: 'QuestionDescription',
      level: VALID_LEVEL,
      subject: VALID_SUBJECT,
    });
  });

  test('Should get data test', () => {
    const sut = new Question({
      id: 'ed24db8f-1d59-4f10-9de2-ed48040d32fd',
      description: 'QuestionDescription',
      level: VALID_LEVEL,
      subject: VALID_SUBJECT,
    });

    expect(sut.data).toMatchObject({
      id: 'ed24db8f-1d59-4f10-9de2-ed48040d32fd',
      description: 'QuestionDescription',
      level: VALID_LEVEL,
      subject: VALID_SUBJECT,
    });
  });
});
