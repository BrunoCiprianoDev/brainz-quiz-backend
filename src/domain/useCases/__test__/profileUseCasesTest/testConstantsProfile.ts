/**
 * @ValidAttributes
 */
export const VALID_PROFILE_UUID = '373dcbd1-0677-4a46-948d-d2e63aa7d8e4';
export const VALID_PROFILE_USERID = 'ae6c3622-2204-41e8-8565-680364894789';
export const VALID_PROFILE_NAME = 'John Doe';
export const VALID_PROFILE_SCORE = 120;

/**
 * @InvalidAttributes
 */
export const INVALID_PROFILE_UUID = 'any';
export const INVALID_PROFILE_USERID = 'any';
export const INVALID_PROFILE_NAME = '';

/**
 * @Objects
 */
export const VALID_PROFILE_CREATE_DATA = {
  userId: VALID_PROFILE_USERID,
  name: VALID_PROFILE_NAME,
  score: VALID_PROFILE_SCORE,
};

export const VALID_PROFILE_DATA = {
  ...VALID_PROFILE_CREATE_DATA,
  id: VALID_PROFILE_UUID,
};
