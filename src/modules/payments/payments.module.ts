import { Module } from '@nestjs/common';
import { PaymentsMPController } from './controller/mp/payments.mp.controller';
import { PaymentsMPService } from './services/mp/payments.mp.service';
import { UtilsModule } from '../utils/utils.module';
import { ExternalPaymentsService } from './utils/external/external.payments.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [UtilsModule, ProductsModule],
  controllers: [PaymentsMPController],
  providers: [ExternalPaymentsService, PaymentsMPService],
  exports: [ExternalPaymentsService],
})
export class PaymentsModule {}
