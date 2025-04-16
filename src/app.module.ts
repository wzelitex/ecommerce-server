import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/* imoprt modules */
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShoppingsModule } from './modules/shoppings/shoppings.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RecomendationsModule } from './modules/recomendations/recomendations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CommunicationsModule } from './modules/communication/communication.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerces'),
    ProductsModule,
    OrdersModule,
    ShoppingsModule,
    UsersModule,
    AuthModule,
    RecomendationsModule,
    PaymentsModule,
    CommunicationsModule,
  ],
})
export class AppModule {}
