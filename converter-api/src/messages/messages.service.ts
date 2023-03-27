import { Injectable, Inject } from '@nestjs/common';

import { Message } from 'squiss-ts';

import { EmailService } from 'src/email/email.service';
import { ConversionService } from 'src/conversion/conversion.service';

interface ExchangeRateRequestMessage {
  toCurrency: string;
  fromCurrency: string;
  email: string;
}

export interface ConversionRequestMessage extends ExchangeRateRequestMessage {
  amount: number;
}

@Injectable()
export class MessageService {
  @Inject(ConversionService)
  private readonly conversionService: ConversionService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  sanitizeSQSMessage(message: ConversionRequestMessage): void {
    for (const [key, value] of Object.entries(message)) {
      console.log(`${key}: ${value}`);
      // Capitalize the currency names
      if (typeof value === 'string' && key !== 'email') {
        message[key] = value.trim().toUpperCase();
      }
    }
  }

  async handleMessage(message: Message) {
    const messageBody: ConversionRequestMessage = message.body.message;

    this.sanitizeSQSMessage(messageBody);

    const conversion = await this.conversionService.handleConversionRequest(
      messageBody,
    );

    this.emailService.sendEmail(
      messageBody.email,
      `Your currency conversion request has been completed: ${
        messageBody.amount
      }${messageBody.fromCurrency} = ${conversion.toFixed(2)}${
        messageBody.toCurrency
      }`,
    );
  }
}
