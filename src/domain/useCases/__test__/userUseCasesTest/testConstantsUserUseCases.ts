import { RoleEnum } from '@src/domain/entities/user';

/**
 * @ValidAttributes
 */
export const VALID_USER_UUID = '373dcbd1-0677-4a46-948d-d2e63aa7d8e4';
export const VALID_USER_EMAIL = 'johnDoe@email.com';
export const VALID_USER_ROLE = RoleEnum.Disabled;
export const VALID_USER_PASSWORD = '12345678';
export const VALID_USER_PASSWORD_HASH = 'PASSWORDHASH';
export const VALID_TOKEN = '3c0eaa7fbf653b338a468816e65bd109';

/**
 * @InvalidAttributes
 */
export const INVALID_USER_UUID = 'invalidString';
export const INVALID_USER_EMAIL = 'invalidEmail';
export const INVALID_USER_ROLE = 'invalidRole';
export const INVALID_USER_PASSWORD = '***';

/**
 * @Objects
 */
export const VALID_USER_PUBLIC_DATA = {
  id: VALID_USER_UUID,
  email: VALID_USER_EMAIL,
  role: VALID_USER_ROLE,
};

export const VALID_USER_DATA = {
  ...VALID_USER_PUBLIC_DATA,
  password: VALID_USER_PASSWORD_HASH,
};

export const VALID_USER_CREATE_DATA = {
  email: VALID_USER_EMAIL,
  password: VALID_USER_PASSWORD,
  confirmPassword: VALID_USER_PASSWORD,
  role: VALID_USER_ROLE,
};

export const USER_CREATE_DATA_WITH_INVALID_EMAIL = {
  ...VALID_USER_CREATE_DATA,
  email: INVALID_USER_EMAIL,
};

export const USER_CREATE_DATA_WITH_INVALID_PASSWORD = {
  ...VALID_USER_CREATE_DATA,
  password: INVALID_USER_PASSWORD,
};

export const USER_CREATE_DATA_WITH_INVALID_ROLE = {
  ...VALID_USER_CREATE_DATA,
  role: INVALID_USER_ROLE,
};
