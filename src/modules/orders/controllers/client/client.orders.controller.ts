import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ClientOrdersService } from '../../services/client/client.orders.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/client/orders')
export class ClientOrdersController {
  constructor(private readonly clientOrdersService: ClientOrdersService) {}

  @Get('get/history')
  getHistoryOrders(
    @Req() req: Request,
    @Query('offset') offset: string,
    @Query('limit') limit: number,
  ) {
    return this.clientOrdersService.historyOrders(
      req.user.userId,
      offset,
      limit,
    );
  }

  @Post('post/realize/order')
  postRealizeOrder(@Req() req: Request) {
    return this.clientOrdersService.realizeOrdersFromCart(req.user.userId);
  }
}
