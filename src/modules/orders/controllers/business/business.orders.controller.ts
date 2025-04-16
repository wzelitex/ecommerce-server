import { Controller, Get, Query, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { BusinessOrdersService } from '../../services/business/business.orders.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/business/orders')
export class BusinessOrdersController {
  constructor(private readonly businessOrdersService: BusinessOrdersService) {}

  @Get('get/orders')
  getOrders(
    @Req() req: Request,
    @Query('offset') offset: string,
    @Query('limit') limit: number,
    @Query('type') type: 'canceled' | 'pending' | 'published',
  ) {
    return this.businessOrdersService.getOrders(
      req.user.userId,
      offset,
      type,
      limit,
    );
  }

  @Get('get/offers/order')
  getOffersOrder(@Query('id') id: string) {
    return this.businessOrdersService.getOrdersOffers(id);
  }

  @Get('get/order')
  findById(@Query('id') id: string) {
    return this.businessOrdersService.findById(id);
  }

  @Post('post/published')
  publishedOrder(@Query('id') id: string) {
    return this.businessOrdersService.publishedOrder(id);
  }

  @Post('post/cancel')
  cancelOrder(@Query('id') id: string) {
    return this.businessOrdersService.cancelOrder(id);
  }

  @Post('post/accept/delivery')
  acceptDelivery(@Query('id') id: string) {
    return this.businessOrdersService.acceptDeliveryOffer(id);
  }
}
