import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Post()
  async create(@Body() body: { username: string; content: string }) {
    console.log('Incoming Data:', body); // This will show up in your terminal
    return await this.commentsService.create(body.username, body.content);
  }
}