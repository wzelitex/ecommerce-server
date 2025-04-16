import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { OrderOffersDto } from '../../dto/order.offers.dto';
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
  getOrdersHistory(
    @Req() req: Request,
    @Query('offset') offset: string,
    @Query('page') page: string,
  ) {
    return this.deliveryOrdersService.getOrdersHistory(
      req.user.userId,
      offset,
      page,
    );
  }

  @Post('post/realize/offer')
  postDeliveryOffer(
    @Req() req: Request,
    @Query('id') id: string,
    @Body() data: OrderOffersDto,
  ) {
    return this.deliveryOrdersService.postOffersDelivery(
      req.user.userId,
      id,
      data.price,
    );
  }
}
