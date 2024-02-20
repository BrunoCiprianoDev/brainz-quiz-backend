/**
 * @ValidAttributes
 */
export const VALID_SUBJECT_UUID = '373dcbd1-0677-4a46-948d-d2e63aa7d8e4';
export const VALID_SUBJECT_DESCRIPTION = 'Description';
export const VALID_SUBJECT_ISACTIVE = true;

/**
 * @Objects
 */
export const VALID_SUBJECT_CREATE_DATA = {
  description: VALID_SUBJECT_DESCRIPTION,
};

export const VALID_SUBJECT_DATA = {
  ...VALID_SUBJECT_CREATE_DATA,
  id: VALID_SUBJECT_UUID,
  isActive: VALID_SUBJECT_ISACTIVE,
};
