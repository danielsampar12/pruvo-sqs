import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);
  console.log(appService.getHello());

  //TODO handle connection establishment errors to avoid waiting on the queue to be up
  setTimeout(() => {
    appService.initSQSConsumer();
  }, 30000);
}
bootstrap();
