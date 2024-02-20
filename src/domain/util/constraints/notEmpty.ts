import { ValidationError } from '../errors';

export const ERROR_MESSAGE_STRING_VALIDATOR = 'must not be empty';

export function NotEmpty() {
  return (target: any, key: string) => {
    let _value = target[key];
    const attribute = key.replace(/_/g, '');

    const getter = () => _value;
    const setter = (value: string) => {
      if (!isNotEmpty(value)) {
        throw new ValidationError(`'${attribute}' ${ERROR_MESSAGE_STRING_VALIDATOR}`);
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

export function isNotEmpty(value: string) {
  if (!value || value.trim() === '') {
    return false;
  }
  return true;
}
