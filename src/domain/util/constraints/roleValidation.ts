import { RoleEnum } from '@src/domain/entities/role';

export function isValidRole(roleString: string): boolean {
  const roleValues: string[] = Object.values(RoleEnum);
  return roleValues.includes(roleString);
}
