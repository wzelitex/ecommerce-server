import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Query,
  Body,
  Req,
  Param,
} from '@nestjs/common';
import { RecomendationsService } from './recomendations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecomendationsDto } from './dto/recomendations.dto';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('api/business/recomendations')
export class RecomendationsController {
  constructor(private readonly recomendationsService: RecomendationsService) {}

  @Get('get/recomendations')
  getRecomendations(
    @Query('offset') offset: string,
    @Query('limit') limit?: number,
  ) {
    return this.recomendationsService.getRecomendations(offset, limit);
  }

  @Post('post/recomendation')
  createRecomendation(
    @Body() data: CreateRecomendationsDto,
    @Req() req: Request,
  ) {
    return this.recomendationsService.createRecomendation({
      recomendation: data.recomendation,
      businessId: req.user.userId,
    });
  }

  @Patch('put/:id/recomendation')
  updateRecomendation(
    @Param('id') id: string,
    @Body('recomendation') newText: string,
  ) {
    return this.recomendationsService.updateRecomendation(id, newText);
  }

  @Delete('delete/:id/recomendation')
  deleteRecomendation(@Param('id') id: string) {
    return this.recomendationsService.deleteRecomendation(id);
  }

  @Get('get/:id/comments')
  getComments(@Param('id') id: string, @Query('offset') offset: string) {
    return this.recomendationsService.getCommentsByRecomendationId(id, offset);
  }

  @Post('post/comment')
  createComment(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @Req() req: Request,
  ) {
    return this.recomendationsService.createComment(
      id,
      comment,
      req.user.userId,
    );
  }

  @Patch('put/:id/comment')
  updateComment(@Param('id') id: string, @Body('comment') comment: string) {
    return this.recomendationsService.updateComment(id, comment);
  }

  @Delete('delete/:id/comment')
  deleteComment(@Param('id') id: string) {
    return this.recomendationsService.deleteComment(id);
  }
}
