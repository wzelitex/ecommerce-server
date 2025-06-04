import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchemaFactory } from './schema/orders.schema';
import { OrdersOffersSchemaFactory } from './schema/orders.offers.schema';
import { UtilsModule } from '../utils/utils.module';
import { ShoppingsModule } from '../shoppings/shoppings.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { ChecksModule } from '../checks/checks.module';

/* import controllers */
import { BusinessOrdersController } from './controllers/business/business.orders.controller';
import { ClientOrdersController } from './controllers/client/client.orders.controller';
import { DeliveryOrdersController } from './controllers/delivery/delivery.orders.controller';

/* import services */
import { BusinessOrdersService } from './services/business/business.orders.service';
import { ClientOrdersService } from './services/client/client.orders.service';
import { DeliveryOrdersService } from './services/delivery/delivery.orders.service';

/* import utils */
import { InternalCommonOrdersService } from './utils/internal/common/internal.common.orders.service';
import { InternalSpecialOrdersService } from './utils/internal/special/internal.special.orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Orders',
        schema: OrderSchemaFactory,
      },
      {
        name: 'Orders_offers',
        schema: OrdersOffersSchemaFactory,
      },
    ]),
    UtilsModule,
    ShoppingsModule,
    ProductsModule,
    UsersModule,
    ChecksModule,
  ],
  controllers: [
    BusinessOrdersController,
    ClientOrdersController,
    DeliveryOrdersController,
  ],
  providers: [
    BusinessOrdersService,
    ClientOrdersService,
    DeliveryOrdersService,
    InternalCommonOrdersService,
    InternalSpecialOrdersService,
  ],
})
export class OrdersModule {}
