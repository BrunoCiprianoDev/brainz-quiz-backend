export interface IPasswordEncryptor {
  encryptor(password: string): Promise<string>;
  passwordCompare(data: { password: string; passwordEncrypt: string }): Promise<boolean>;
}
