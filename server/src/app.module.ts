import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Add this
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Add this!
    CommentsModule,
  ],
})
export class AppModule {}