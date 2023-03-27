import { Injectable, Inject } from '@nestjs/common';
import { Squiss, Message } from 'squiss-ts';
// import { ConversionApiService } from './conversion-api/conversion-api.service';
// import { EmailerService } from './emailer/emailer.service';

interface ExchangeRateRequestMessage {
  toCurrency: string;
  fromCurrency: string;
  email: string;
}

interface ConversionRequestMessage extends ExchangeRateRequestMessage {
  amount: number;
}
@Injectable()
export class AppService {
  // @Inject(ConversionApiService)
  // private readonly exchangeConversionService: ConversionApiService;

  // @Inject(EmailerService)
  // private readonly emailService: EmailerService;

  getHello(): string {
    return 'Hello World!';
  }

  sanitizeSQSMessage(message: ConversionRequestMessage): void {
    for (const [key, value] of Object.entries(message)) {
      console.log(`${key}: ${value}`);
      // Capitalize the currency names
      if (typeof value === 'string' && key !== 'email') {
        message[key] = value.trim().toUpperCase();
      }
    }
  }

  validatePresenceOfUSD(message: ConversionRequestMessage): boolean {
    const messageValues = Object.values(message);
    if (messageValues.indexOf('USD') < 0) {
      return false;
    } else {
      return true;
    }
  }

  isConversionToUSD(message: ConversionRequestMessage): boolean {
    return message.toCurrency === 'USD';
  }

  isRequestValid(message: any): boolean {
    const doesIncludeUSD = this.validatePresenceOfUSD(message);

    if (!doesIncludeUSD) {
      console.log('Invalid currency conversion: missing USD.');
      //TODO send an email informing user the conversion is not supported
      return false;
    } else {
      return true;
    }
  }

  // async handleConversionRequest(message: ConversionRequestMessage) {
  //   try {
  //     if (message.toCurrency === 'USD') {
  //       const convertedAmount =
  //         await this.exchangeConversionService.convertToUSD(
  //           message.fromCurrency,
  //           message.amount,
  //         );

  //       this.emailService.sendEmail(
  //         message.email,
  //         `Your exchange rate request:\n${message.amount} ${message.fromCurrency} = ${convertedAmount} USD`,
  //       );
  //     }

  //     if (message.fromCurrency === 'USD') {
  //       const convertedAmount =
  //         await this.exchangeConversionService.convertFromUSD(
  //           message.toCurrency,
  //           message.amount,
  //         );
  //       this.emailService.sendEmail(
  //         message.email,
  //         `Your exchange rate request:\n${message.amount} USD = ${convertedAmount} ${message.toCurrency}`,
  //       );
  //     }
  //   } catch (error) {
  //     console.log(`Could not process conversion request.`);
  //     throw new Error(error);
  //   }
  // }

  // async handleExchangeRateRequest(message: ExchangeRateRequestMessage) {
  //   try {
  //     if (message.fromCurrency === 'USD') {
  //       const currencyExchangeRateRelativeToUSD =
  //         await this.exchangeConversionService.getCurrencyExchangeRateRelativeToUSD(
  //           message.toCurrency,
  //         );

  //       this.emailService.sendEmail(
  //         message.email,
  //         `Your exchange rate request:\n 1 ${message.fromCurrency} = ${currencyExchangeRateRelativeToUSD} ${message.toCurrency}`,
  //       );
  //     } else if (message.toCurrency === 'USD') {
  //       const currencyExchangeRateRelativeToUSD =
  //         await this.exchangeConversionService.getCurrencyExchangeRateRelativeToUSD(
  //           message.fromCurrency,
  //         );
  //       const currencyExchangeRateRelativeToCurrency =
  //         1 / currencyExchangeRateRelativeToUSD;
  //       this.emailService.sendEmail(
  //         message.email,
  //         `Your exchange rate request:\n 1 ${message.fromCurrency} = ${currencyExchangeRateRelativeToCurrency} USD`,
  //       );
  //     }
  //   } catch (error) {
  //     console.log(`Could not process conversion request.`);
  //     throw new Error(error);
  //   }
  // }

  initSQSConsumer(): void {
    const awsConfig = {
      accessKeyId: `dummy`,
      secretAccessKey: `dummy`,
      region: 'eu-west-1',
    };
    console.log('Setting up SQS consumer');
    const squiss = new Squiss({
      awsConfig,
      queueUrl: 'http://sqs:9324/queue/default',
      bodyFormat: 'json',
      maxInFlight: 15,
      idlePollIntervalMs: 500,
      pollRetryMs: 5000,
    });

    squiss.on('error', (error: Error) => {
      console.log(`squiss error ${error}`);
    });

    squiss.on('message', async (message: Message) => {
      console.log('oii');

      const messageBody = message.body.message;
      const messageBodyString = JSON.stringify(message.body.message);
      console.log(
        `${message.body.name} says: ${messageBodyString} and has no attributes`,
      );
      this.sanitizeSQSMessage(messageBody);

      // if (message.body.name === 'conversion_request') {
      //   const isValidRequest = this.isRequestValid(messageBody);
      //   console.log('isValidRequest: ', isValidRequest);
      //   isValidRequest ? this.handleConversionRequest(messageBody) : null;
      // }
      // if (message.body.name === 'exchange_rate_request') {
      //   const isValidRequest = this.isRequestValid(messageBody);
      //   isValidRequest ? this.handleExchangeRateRequest(messageBody) : null;
      // }

      message.del().then(() => {
        console.log('message deleted');
      });
    });

    squiss.start();
    console.log('SQS consumer ready');
  }
}
