export interface IEmailSender {
  sendTokenForgotPass(data: { email: string; token: string }): Promise<void>;
}
