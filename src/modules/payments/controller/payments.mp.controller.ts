import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsMPService } from '../services/payments.mp.service';

@Controller('api/payments')
export class PaymentsMpController {
  constructor(private readonly paymentsMpService: PaymentsMPService) {}

  @Get('connect')
  redirectToMercadoPago() {
    return this.paymentsMpService.redirectToMercadoPago();
  }

  @Get('callback')
  async mercadoPagoCallback(
    @Query('code') code: string,
    @Query('state') businessId: string,
  ) {
    return this.paymentsMpService.mercadoPagoCallback(code, businessId);
  }

  @Post('web-hook')
  webHookMP(@Body() data: any) {
    return this.paymentsMpService.webHookMP(data);
  }
}
