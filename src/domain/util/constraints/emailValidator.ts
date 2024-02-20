import { ValidationError } from '../errors/validationError';

export const INVALID_EMAIL_MESSAGE = 'The email provided is not valid';

export function Email() {
  return (target: any, key: string) => {
    let _email = target[key];

    const getter = () => _email;
    const setter = (email: string) => {
      if (!isValidEmail(email)) {
        throw new ValidationError(INVALID_EMAIL_MESSAGE);
      }
      _email = email;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
