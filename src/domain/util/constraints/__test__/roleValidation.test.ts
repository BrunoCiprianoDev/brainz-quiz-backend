import { RoleEnum } from '@src/domain/entities/role';
import { convertStringToRoleEnum } from '../roleValidation';

describe('convertStringToRoleEnum', () => {
  it('should convert the string "PLAYER" to RoleEnum.Player', () => {
    expect(convertStringToRoleEnum({ roleString: 'PLAYER' })).toBe(RoleEnum.Player);
  });

  it('should convert the string "ADMIN" to RoleEnum.Admin', () => {
    expect(convertStringToRoleEnum({ roleString: 'ADMIN' })).toBe(RoleEnum.Admin);
  });

  it('should convert the string "player" to RoleEnum.Player (ignoring case)', () => {
    expect(convertStringToRoleEnum({ roleString: 'player' })).toBe(RoleEnum.Player);
  });

  it('should return undefined for an unrecognized string', () => {
    expect(convertStringToRoleEnum({ roleString: 'MODERATOR' })).toBeUndefined();
  });

  it('should return undefined for an empty string', () => {
    expect(convertStringToRoleEnum({ roleString: '' })).toBeUndefined();
  });

  it('should return undefined for a string with spaces', () => {
    expect(convertStringToRoleEnum({ roleString: '  ' })).toBeUndefined();
  });
});
