import { Module, Global } from '@nestjs/common';
import { DataBaseService } from './data-base.service';

@Global()
@Module({
  providers: [DataBaseService],
  exports: [DataBaseService],
})
export class DataBaseModule {}
