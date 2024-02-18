/**
 * @ValidAttributes
 */
export const VALID_LEVEL_UUID = '373dcbd1-0677-4a46-948d-d2e63aa7d8e4';
export const VALID_LEVEL_DESCRIPTION = 'Description';
export const VALID_LEVEL_POINTS = 2000;
export const VALID_LEVEL_ISACTIVE = true;

/**
 * @Objects
 */
export const VALID_LEVEL_CREATE_DATA = {
  description: VALID_LEVEL_DESCRIPTION,
  points: VALID_LEVEL_POINTS,
};

export const VALID_LEVEL_DATA = {
  ...VALID_LEVEL_CREATE_DATA,
  id: VALID_LEVEL_UUID,
  isActive: VALID_LEVEL_ISACTIVE,
};
