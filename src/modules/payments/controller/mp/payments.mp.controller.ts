import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsMPService } from '../../services/mp/payments.mp.service';

@Controller('api/payments')
export class PaymentsMPController {
  constructor(private readonly paymentService: PaymentsMPService) {}

  @Post('web/hook')
  webHookMP(@Body() webHookData: any) {
    return this.paymentService.webHookMP(webHookData);
  }
}
