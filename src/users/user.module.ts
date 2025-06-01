import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DataBaseModule } from 'src/data-base/data-base.module';

@Module({
  imports: [DataBaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
