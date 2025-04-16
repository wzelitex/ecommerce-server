import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingSchemaFactory } from './schema/shoppints.schema';
import { UtilsModule } from '../utils/utils.module';
import { ProductsModule } from '../products/products.module';

/* import controllers */
import { BusinessShoppingsController } from './controllers/business/business.shoppings.controller';
import { ClientShoppingsController } from './controllers/client/client.shoppings.controller';

/* import services */
import { BusinessShoppingsService } from './services/business/business.shoppings.service';
import { ClientShoppingsService } from './services/client/client.shoppings.service';

/* import utils */
import { ExternalShoppingsService } from './utils/external/external.shoppings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Shoppings',
        schema: ShoppingSchemaFactory,
      },
    ]),
    UtilsModule,
    forwardRef(() => ProductsModule),
  ],
  controllers: [BusinessShoppingsController, ClientShoppingsController],
  providers: [
    BusinessShoppingsService,
    ClientShoppingsService,
    ExternalShoppingsService,
  ],
  exports: [ExternalShoppingsService],
})
export class ShoppingsModule {}
