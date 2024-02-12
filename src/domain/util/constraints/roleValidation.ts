import { RoleEnum } from '@src/domain/entities/role';

export function convertStringToRoleEnum({ roleString }: { roleString: string }): RoleEnum | undefined {
  for (const role of Object.values(RoleEnum)) {
    if (role.toLowerCase() === roleString.toLowerCase()) {
      return role as RoleEnum;
    }
  }
  return undefined;
}
