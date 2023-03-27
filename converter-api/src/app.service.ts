import { Injectable, Inject } from '@nestjs/common';
import { Squiss, Message } from 'squiss-ts';

import { MessageService } from './messages/messages.service';

@Injectable()
export class AppService {
  @Inject(MessageService)
  private readonly messageService: MessageService;

  getHello(): void {
    console.log('⚡️[nest:server]');
  }

  initSQSConsumer(): void {
    const awsConfig = {
      accessKeyId: `dummy`,
      secretAccessKey: `dummy`,
      region: 'dummy',
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
      this.messageService.handleMessage(message);

      message.del().then(() => {
        console.log('message deleted');
      });
    });

    squiss.start();
    console.log('SQS consumer ready');
  }
}
