import { Controller, Get, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

/* imoprt modules */
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShoppingsModule } from './modules/shoppings/shoppings.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RecomendationsModule } from './modules/recomendations/recomendations.module';
import { CommunicationsModule } from './modules/communication/communication.module';
import { PlataformModule } from './modules/plataform/plataform.module';
import { ChecksModule } from './modules/checks/checks.module';

/*

  Dev: 'mongodb://localhost:27017/ecommerces'

  Production: process.env.MONGODB_URL

*/

@Controller('api')
export class AppController {
  @Get('')
  getHome() {
    return 'Bienvenido al server';
  }
}

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerces'),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    OrdersModule,
    ShoppingsModule,
    UsersModule,
    AuthModule,
    RecomendationsModule,
    CommunicationsModule,
    PlataformModule,
    ChecksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
