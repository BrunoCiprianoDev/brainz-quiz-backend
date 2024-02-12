export interface IPasswordEncryptor {
  encryptor(data: { password: string }): Promise<string>;
  passwordCompare(data: { password: string; passwordEncrypt: string }): Promise<boolean>;
}
