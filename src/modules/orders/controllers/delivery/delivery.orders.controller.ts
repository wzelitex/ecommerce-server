import { Controller, Post, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeliveryOrdersService } from '../../services/delivery/delivery.orders.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/delivery/orders')
export class DeliveryOrdersController {
  constructor(private readonly deliveryOrdersService: DeliveryOrdersService) {}

  @Get('get/orders/published')
  getOrdersPublished(@Query('offset') offset: string) {
    return this.deliveryOrdersService.getOrdersPublished(offset);
  }

  @Get('get/published')
  getDetailsPublished(@Query('id') id: string, @Req() req: Request) {
    return this.deliveryOrdersService.getDetailsOrderPublished(
      id,
      req.user.userId,
    );
  }

  @Get('get/history')
  getOrdersHistory(@Req() req: Request, @Query('offset') offset: string) {
    return this.deliveryOrdersService.getOrdersHistory(req.user.userId, offset);
  }

  @Post('post/realize/offer')
  postDeliveryOffer(
    @Req() req: Request,
    @Query('id') id: string,
    @Query('price') price: string,
  ) {
    return this.deliveryOrdersService.postOffersDelivery(
      req.user.userId,
      id,
      price,
    );
  }

  @Get('get/pending')
  getOrdersPending(@Req() req: Request, @Query('offset') offset: string) {
    return this.deliveryOrdersService.getOrdersPending(req.user.userId, offset);
  }

  @Post('post/complete/order')
  postCompleteOrder(@Query('id') id: string) {
    return this.deliveryOrdersService.postCompleteOrder(id);
  }
}
