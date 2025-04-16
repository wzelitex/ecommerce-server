import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductShoeSchemaFactory } from './schema/product.schema';
import { UtilsModule } from '../utils/utils.module';
import { ShoppingsModule } from '../shoppings/shoppings.module';

/* import controllers */
import { BusinessProductsController } from './controllers/business/business.products.controller';
import { ClientProductsController } from './controllers/client/client.products.controller';

/* import services */

import { BusinessProductsService } from './services/business/business.products.service';
import { ClientProductsService } from './services/client/client.products.service';

/* import utils */
import { ExternalProductsService } from './utils/external/external.products.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Shoe',
        schema: ProductShoeSchemaFactory,
      },
    ]),
    UtilsModule,
    forwardRef(() => ShoppingsModule),
  ],
  controllers: [BusinessProductsController, ClientProductsController],
  providers: [
    BusinessProductsService,
    ClientProductsService,
    ExternalProductsService,
  ],
  exports: [ExternalProductsService],
})
export class ProductsModule {}
