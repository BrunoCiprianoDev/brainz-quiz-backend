import { IEmailSender } from '@src/domain/interfaces/adapters/emailSender';
import logger from '@src/shared/logger/logger';
import nodemailer from 'nodemailer';

export const nodemailerSender = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: process.env.SERVER_EMAIL, pass: process.env.APP_PASSWORD },
});

export class EmailSender implements IEmailSender {
  public async sendTokenForgotPass({ email, token }: { email: string; token: string }): Promise<void> {
    await nodemailerSender
      .sendMail({
        from: process.env.SERVER_EMAIL,
        to: process.env.SERVER_EMAIL,
        replyTo: email,
        subject: 'Forgot password',
        text: `Your token is: ${token}`,
      })
      .catch(error => {
        if (error instanceof Error) {
          logger.error(error.message);
        }
        throw error;
      });
  }
}
