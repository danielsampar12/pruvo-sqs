import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [MessagesModule, ConfigModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}
