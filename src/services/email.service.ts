import { SentMessageInfo, Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { Container, Service } from 'typedi';
import { EmailInterface } from '@interfaces';
import { HandlebarsConstants } from '@constants/email';
import { ErrorsMessages } from '@constants/errorMessages';
import { emailClient } from '@server';
import { User } from '@entities/user.entity';
import { JWTService } from './jwt.service';
import { BASE_URL, SENDER_EMAIL } from '@config';

@Service()
export class EmailService {
  private static transporter: Transporter<SentMessageInfo>;
  private static instance: EmailService;


  public static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService();
      this.transporter = emailClient.transporter;
    }

    return this.instance;
  }

  private static getHbsOptions(): EmailInterface.IHandlebarsOptions {
    const { HandlebarsConfig } = HandlebarsConstants;
    return {
      viewEngine: {
        extname: HandlebarsConfig.FILE_EXTENSION,
        layoutsDir: HandlebarsConfig.VIEWS_PATH,
        defaultLayout: HandlebarsConfig.TEMPLATE_NAME
      },
      viewPath: HandlebarsConfig.VIEWS_PATH
    };
  }

  static async sendEmail(email: EmailInterface.IEmail) {
    try {
      this.transporter.use('compile', hbs(this.getHbsOptions));
      const emailSent = await this.transporter.sendMail(email);
      return emailSent;
    } catch (error) {
      throw new Error(`${ErrorsMessages.EMAIL_NOT_SENT}: ${error}`);
    }
  }

  async sendVerification(user: User) {
    const jwtService = Container.get(JWTService);
    const token = jwtService.createVerificationToken(user);
    EmailService.sendEmail({ from: SENDER_EMAIL ?? '', to: user.email,
      subject: 'Email verification',
      text: `Click on the link to verify your account
      ${ BASE_URL??''}/users/verify?token= ${token}` });
  }

  async sendPasswordReset(user: User) {
    const jwtService = Container.get(JWTService);
    const token = jwtService.createVerificationToken(user);
    EmailService.sendEmail({ from: SENDER_EMAIL ?? '', to: user.email,
      subject: 'Password reset',
      text: `Click on the link to reset your password 
      ${BASE_URL??''}/users/resetPassword?token=${token}` });
  }
}
