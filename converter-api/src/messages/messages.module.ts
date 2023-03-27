import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MessageService } from './messages.service';
import { EmailService } from 'src/email/email.service';
import { ConversionService } from 'src/conversion/conversion.service';

@Module({
  imports: [HttpModule],
  providers: [ConversionService, EmailService, MessageService],
  exports: [MessageService],
})
export class MessagesModule {}
