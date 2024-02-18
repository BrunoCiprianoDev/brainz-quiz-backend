/**
 * @ValidAttributes
 */
export const VALID_OPTION_UUID = '373dcbd1-0677-4a46-948d-d2e63aa7d8e4';
export const VALID_OPTION_QUESTION_ID = 'ae6c3622-2204-41e8-8565-680364894789';
export const VALID_OPTION_DESCRIPTION = 'Description';
export const VALID_OPTION_IS_CORRECT = true;

/**
 * @InvalidAttributes
 */
export const INVALID_VALID_OPTION_UUID = 'Any';
export const INVALID_VALID_OPTION_QUESTION_ID = 'Any';
export const INVALID_VALID_OPTION_DESCRIPTION = '';

/**
 * @Objects
 */

export const VALID_OPTION_TO_CREATE_01 = {
  description: '373dcbd1-0677-4a46-948d-d2e63aa7d8e1',
  isCorrect: true,
};

export const VALID_OPTION_TO_CREATE_02 = {
  description: '373dcbd1-0677-4a46-948d-d2e63aa7d8e2',
  isCorrect: false,
};

export const VALID_OPTIONS_CREATE_DATA = {
  questionId: VALID_OPTION_QUESTION_ID,
  optionsWithoutId: [VALID_OPTION_TO_CREATE_01, VALID_OPTION_TO_CREATE_02],
};

export const VALID_OPTIONS_EXPECT_SUCESSFULLY = [
  { ...VALID_OPTION_TO_CREATE_01, id: '373dcbd1-0677-4a46-948d-d2e63aa7d8e1', questionId: VALID_OPTION_QUESTION_ID },
  { ...VALID_OPTION_TO_CREATE_02, id: '373dcbd1-0677-4a46-948d-d2e63aa7d8e2', questionId: VALID_OPTION_QUESTION_ID },
];
