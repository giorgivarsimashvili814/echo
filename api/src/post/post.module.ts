import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/auth/auth.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [AuthModule, S3Module],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
