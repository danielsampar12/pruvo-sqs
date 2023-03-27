import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConversionService } from './conversion.service';

@Module({
  imports: [HttpModule],
  providers: [ConversionService],
  exports: [ConversionService],
})
export class ConversionModule {}
