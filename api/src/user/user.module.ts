import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [AuthModule, S3Module],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
