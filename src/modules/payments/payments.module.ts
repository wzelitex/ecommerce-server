import { Module } from '@nestjs/common';
import { PaymentsMPService } from './services/payments.mp.service';
import { UtilsModule } from '../utils/utils.module';
import { ExternalPaymentsService } from './utils/external/external.payments.service';
import { ProductsModule } from '../products/products.module';
import { PaymentsMpController } from './controller/payments.mp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentCredentialsSchemaFactory } from './schema/payment.credentials.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'credentials_payment',
        schema: PaymentCredentialsSchemaFactory,
      },
    ]),
    UtilsModule,
    ProductsModule,
  ],
  controllers: [PaymentsMpController],
  providers: [ExternalPaymentsService, PaymentsMPService],
  exports: [ExternalPaymentsService],
})
export class PaymentsModule {}
