import { Injectable } from '@nestjs/common';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import nodemailer from 'nodemailer';
import { RequestContactInterface } from '../../interfaces/functions/functions.post.communication';

const keyApp = 'ndva tqvc ydqr ljhu'; // reemplázalo o cárgalo desde un .env

@Injectable()
export class ExternalCommunicationsService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly sanitizeEmailsService: SanitizeService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'wzelitexprogramming23@gmail.com',
        pass: keyApp,
      },
    }) as nodemailer.Transporter;
  }

  async sendBulkNotifications(notifications: RequestContactInterface[]) {
    for (const notification of notifications) {
      try {
        const sanitizedEmail = this.sanitizeEmailsService.sanitizeAllString(
          notification.to,
        );

        await this.transporter.sendMail({
          from: '"Wzelitex" <wzelitexprogramming23@gmail.com>',
          to: sanitizedEmail,
          subject: notification.subject,
          text: notification.message,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
