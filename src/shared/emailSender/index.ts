import { IEmailSender } from '../../domain/util/adapters/emailSender';
import logger from '../logger';
import nodemailer from 'nodemailer';

export class EmailSender implements IEmailSender {
  public async sendTokenForgotPass({ email, token }: { email: string; token: string }): Promise<void> {
    const enviroment = process.env.ENVIROMENT;
    const user = process.env.SERVER_EMAIL;
    const pass = process.env.APP_PASSWORD;

    if (enviroment !== 'production') {
      if (!user || !pass) {
        logger.warn('Email not sent because the SERVER_EMAIL and APP_PASSWORD parameters were not defined');
        return;
      }
    }

    const nodemailerSender = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: { user: process.env.SERVER_EMAIL, pass: process.env.APP_PASSWORD },
    });

    await nodemailerSender
      .sendMail({
        from: process.env.SERVER_EMAIL,
        to: email,
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
