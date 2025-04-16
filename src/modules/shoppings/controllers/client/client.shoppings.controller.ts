import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateShoppingDto } from '../../dto/shoppings.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClientShoppingsService } from '../../services/client/client.shoppings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/client/shoppings')
export class ClientShoppingsController {
  constructor(
    private readonly clientShoppingsService: ClientShoppingsService,
  ) {}

  @Get('get/cart')
  findShoppingCart(@Req() req: Request) {
    return this.clientShoppingsService.findShoppingCart(req.user.userId);
  }

  @Get('get/history')
  findShoppingsHistory(@Req() req: Request, offset: string) {
    return this.clientShoppingsService.findShoppingsHistory(
      req.user.userId,
      offset,
    );
  }

  @Post('post/shopping')
  addShoppingCart(@Req() req: Request, @Body() data: CreateShoppingDto) {
    return this.clientShoppingsService.addShoppingCart(req.user.userId, data);
  }

  @Delete('delete/shopping')
  deleteShoppingFromCart(@Query('id') id: string) {
    return this.clientShoppingsService.deleteShoppingFromCart(id);
  }
}
