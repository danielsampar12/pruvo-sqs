import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendEmail(email: string, message: string) {
    console.log('Email recipient: ', email);
    console.log('Email message: ', message);
    console.log('Email sent');
  }
}
