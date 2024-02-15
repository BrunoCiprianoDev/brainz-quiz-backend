import { ValidationError } from '../errors/validationError';

export const INVALID_ENUM_MESSAGE = 'Invalid value for';

export function EnumType(enumType: Record<string, string>) {
  return (target: any, key: string) => {
    let _value = target[key];
    const attribute = key.replace(/_/g, '');

    const getter = () => _value;
    const setter = (value: string) => {
      if (!isValidEnumValue(value, enumType)) {
        throw new ValidationError(`${INVALID_ENUM_MESSAGE} ${attribute}`);
      }
      _value = value;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function isValidEnumValue(value: string, enumType: Record<string, string>): boolean {
  const enumValues: string[] = Object.values(enumType);
  return enumValues.includes(value);
}
